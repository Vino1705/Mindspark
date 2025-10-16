'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {useOffline} from '@/hooks/use-offline';
import {
  proofreadText,
  type ProofreadTextInput,
  type ProofreadTextOutput,
} from '@/ai/flows/proofreading-assistance';
import {useToast} from '@/hooks/use-toast';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {FileCheck2, Info, Save} from 'lucide-react';
import {CopyButton} from '@/components/copy-button';
import {addDraft} from '@/lib/db';
import {Separator} from '@/components/ui/separator';

async function mockProofread(text: string): Promise<ProofreadTextOutput> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const correctedText = text
    .replace(/teh/gi, 'the')
    .replace(/wierd/gi, 'weird');
  const suggestions = [];
  if (text.includes('teh')) {
    suggestions.push({
      startIndex: text.indexOf('teh'),
      length: 3,
      suggestion: 'Corrected "teh" to "the".',
    });
  }
  if (text.includes('wierd')) {
    suggestions.push({
      startIndex: text.indexOf('wierd'),
      length: 5,
      suggestion: 'Corrected "wierd" to "weird".',
    });
  }
  return {
    correctedText,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

export default function ProofreaderPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ProofreadTextOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isOffline = useOffline();
  const {toast} = useToast();

  const handleProofread = async () => {
    if (!text) {
      toast({
        variant: 'destructive',
        title: 'Text is empty',
        description: 'Please enter some text to proofread.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);

    try {
      let response: ProofreadTextOutput;
      if (isOffline) {
        response = await mockProofread(text);
        toast({
          title: 'Offline Mode',
          description: 'Showing mock AI data.',
        });
      } else {
        const input: ProofreadTextInput = {text};
        response = await proofreadText(input);
      }
      setResult(response);
    } catch (error) {
      console.error('Proofread failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to proofread text. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!result) return;
    try {
      await addDraft({
        title: `Proofread: ${text.substring(0, 20)}...`,
        content: result.correctedText,
      });
      toast({title: 'Draft saved successfully!'});
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast({variant: 'destructive', title: 'Error saving draft.'});
    }
  };

  return (
    <div className="space-y-6">
      {isOffline && (
        <Alert variant="default">
          <Info className="h-4 w-4" />
          <AlertTitle>Offline or Demo Mode Active</AlertTitle>
          <AlertDescription>
            You are currently running in a demo environment. AI responses are
            simulated.
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Proofread your Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter text with grammar or spelling mistakes..."
            className="min-h-[200px] text-base"
            disabled={isLoading}
          />
          <Button
            onClick={handleProofread}
            disabled={isLoading}
            className="glow-effect"
          >
            <FileCheck2 className="mr-2 h-4 w-4" />
            {isLoading ? 'Checking...' : 'Check Text'}
          </Button>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Corrected Text</CardTitle>
            {result && !isLoading && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <CopyButton text={result.correctedText} />
              </div>
            )}
          </CardHeader>
          <CardContent className="min-h-[200px]">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            ) : result ? (
              <p className="whitespace-pre-wrap text-base">
                {result.correctedText}
              </p>
            ) : null}
          </CardContent>
          {result?.suggestions && result.suggestions.length > 0 && (
            <>
              <Separator className="my-4" />
              <CardContent>
                <h3 className="mb-2 font-semibold">Suggestions:</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {result.suggestions.map((s, i) => (
                    <li key={i}>{s.suggestion}</li>
                  ))}
                </ul>
              </CardContent>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
