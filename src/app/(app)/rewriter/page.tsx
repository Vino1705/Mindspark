'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {useOffline} from '@/hooks/use-offline';
import {
  rewriteText,
  type RewriteTextInput,
  type RewriteTextOutput,
} from '@/ai/flows/text-rewriting';
import {TypingAnimation} from '@/components/typing-animation';
import {CopyButton} from '@/components/copy-button';
import {useToast} from '@/hooks/use-toast';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Info, Save, Wand2} from 'lucide-react';
import {addDraft} from '@/lib/db';

type Tone = 'Formal' | 'Casual' | 'Creative' | 'Concise';

async function mockRewrite(
  text: string,
  tone: Tone
): Promise<RewriteTextOutput> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    rewrittenText: `This is a mock rewritten text in a ${tone.toLowerCase()} tone for: "${text.substring(
      0,
      50
    )}..."`,
  };
}

export default function RewriterPage() {
  const [originalText, setOriginalText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [tone, setTone] = useState<Tone>('Formal');
  const [isLoading, setIsLoading] = useState(false);
  const isOffline = useOffline();
  const {toast} = useToast();

  const handleRewrite = async () => {
    if (!originalText) {
      toast({
        variant: 'destructive',
        title: 'Text is empty',
        description: 'Please enter some text to rewrite.',
      });
      return;
    }
    setIsLoading(true);
    setRewrittenText('');

    try {
      let result: RewriteTextOutput;
      if (isOffline) {
        result = await mockRewrite(originalText, tone);
        toast({
          title: 'Offline Mode',
          description: 'Showing mock AI data.',
        });
      } else {
        const input: RewriteTextInput = {
          text: originalText,
          tone: tone,
        };
        result = await rewriteText(input);
      }
      setRewrittenText(result.rewrittenText);
    } catch (error) {
      console.error('Rewrite failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to rewrite text. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!rewrittenText) return;
    try {
      await addDraft({
        title: `Rewritten: ${originalText.substring(0, 20)}...`,
        content: rewrittenText,
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
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Original Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={originalText}
              onChange={e => setOriginalText(e.target.value)}
              placeholder="Enter text to rewrite..."
              className="min-h-[250px] text-base"
              disabled={isLoading}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rewritten Text</CardTitle>
            {rewrittenText && !isLoading && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <CopyButton text={rewrittenText} />
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            ) : rewrittenText ? (
              <TypingAnimation text={rewrittenText} className="text-base" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Your rewritten text will appear here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center gap-4">
        <Select
          value={tone}
          onValueChange={(value: Tone) => setTone(value)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Formal">Formal</SelectItem>
            <SelectItem value="Casual">Casual</SelectItem>
            <SelectItem value="Creative">Creative</SelectItem>
            <SelectItem value="Concise">Concise</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleRewrite}
          disabled={isLoading}
          className="glow-effect"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isLoading ? 'Rewriting...' : 'Rewrite'}
        </Button>
      </div>
    </div>
  );
}
