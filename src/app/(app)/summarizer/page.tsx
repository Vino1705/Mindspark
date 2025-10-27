'use client';

import {useState, useRef, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {useOffline} from '@/hooks/use-offline';
import {
  summarizeText,
  type SummarizeTextInput,
  type SummarizeTextOutput,
} from '@/ai/flows/text-summarization';
import {TypingAnimation} from '@/components/typing-animation';
import {CopyButton} from '@/components/copy-button';
import {useToast} from '@/hooks/use-toast';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {BookText, Info, Save, Upload} from 'lucide-react';
import {addDraft} from '@/lib/db';
import {useDraftStore} from '@/lib/draft-store';

async function mockSummarize(text: string): Promise<SummarizeTextOutput> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const summary = text.split('.').slice(0, 2).join('.') + '.';
  return {summary: `This is a mock summary of your text. ${summary}`};
}

export default function SummarizerPage() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isOffline = useOffline();
  const {toast} = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {consumeDraftContent} = useDraftStore();

  useEffect(() => {
    const draftContent = consumeDraftContent();
    if (draftContent) {
      setText(draftContent);
      toast({
        title: 'Draft Loaded',
        description: 'Draft content loaded and ready to be summarized.',
      });
    }
  }, [consumeDraftContent, toast]);

  const handleSummarize = async () => {
    if (!text) {
      toast({
        variant: 'destructive',
        title: 'Text is empty',
        description: 'Please enter some text to summarize.',
      });
      return;
    }
    setIsLoading(true);
    setSummary('');

    try {
      let result: SummarizeTextOutput;
      if (isOffline) {
        result = await mockSummarize(text);
        toast({
          title: 'Offline Mode',
          description: 'Showing mock AI data.',
        });
      } else {
        const input: SummarizeTextInput = {text};
        result = await summarizeText(input);
      }
      setSummary(result.summary);
    } catch (error) {
      console.error('Summarize failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to summarize text. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setText(e.target?.result as string);
        toast({title: 'File loaded', description: `${file.name} is ready.`});
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveDraft = async () => {
    if (!summary) return;
    try {
      await addDraft({
        title: `Summary: ${text.substring(0, 20)}...`,
        content: summary,
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
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Enter or paste long text here..."
              className="min-h-[300px] text-base"
              disabled={isLoading}
            />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                onClick={handleSummarize}
                disabled={isLoading}
                className="glow-effect"
              >
                <BookText className="mr-2 h-4 w-4" />
                {isLoading ? 'Summarizing...' : 'Summarize Text'}
              </Button>
              <Button
                variant="outline"
                onClick={handleUploadClick}
                disabled={isLoading}
              >
                <Upload className="mr-2 h-4 w-4" /> Upload .txt
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt"
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Summary</CardTitle>
            {summary && !isLoading && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <CopyButton text={summary} />
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            ) : summary ? (
              <TypingAnimation text={summary} className="text-base" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Your summary will appear here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
