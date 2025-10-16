'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {useOffline} from '@/hooks/use-offline';
import {rewriteText, type RewriteTextInput} from '@/ai/flows/text-rewriting';
import {TypingAnimation} from '@/components/typing-animation';
import {CopyButton} from '@/components/copy-button';
import {useToast} from '@/hooks/use-toast';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Info, Save, Sparkles} from 'lucide-react';
import {addDraft} from '@/lib/db';

async function mockBrainstorm(topic: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `Here are some creative ideas for "${topic}":\n\n- Idea 1: A completely novel concept based on your topic.\n- Idea 2: A twist on a classic theme related to your idea.\n- Idea 3: An unexpected combination of genres inspired by your input.`;
}

export default function BrainstormPage() {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isOffline = useOffline();
  const {toast} = useToast();

  const handleBrainstorm = async () => {
    if (!topic) {
      toast({
        variant: 'destructive',
        title: 'Topic is empty',
        description: 'Please enter a topic to brainstorm.',
      });
      return;
    }
    setIsLoading(true);
    setIdeas('');

    try {
      let result;
      if (isOffline) {
        result = await mockBrainstorm(topic);
        toast({
          title: 'Offline Mode',
          description: 'Showing mock AI data.',
        });
      } else {
        const prompt = `You are an expert idea generator. Brainstorm a list of creative ideas and outlines for the following topic: ${topic}. Format the output clearly with headings and bullet points.`;
        const input: RewriteTextInput = {
          text: prompt,
          tone: 'Creative',
        };
        const response = await rewriteText(input);
        result = response.rewrittenText;
      }
      setIdeas(result);
    } catch (error) {
      console.error('Brainstorming failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate ideas. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!ideas) return;
    try {
      await addDraft({
        title: `Brainstorm: ${topic.substring(0, 30)}...`,
        content: ideas,
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
          <CardTitle>Let's Brainstorm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Enter a topic, e.g., 'a new mobile app for gardeners'"
              className="flex-1"
              disabled={isLoading}
              onKeyDown={e => e.key === 'Enter' && handleBrainstorm()}
            />
            <Button
              onClick={handleBrainstorm}
              disabled={isLoading}
              className="glow-effect"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoading ? 'Generating...' : 'Generate Ideas'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {(isLoading || ideas) && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Ideas</CardTitle>
            {ideas && !isLoading && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                  <Save className="mr-2 h-4 w-4" /> Save Draft
                </Button>
                <CopyButton text={ideas} />
              </div>
            )}
          </CardHeader>
          <CardContent className="min-h-[150px]">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[70%]" />
                <Skeleton className="h-4 w-[85%]" />
              </div>
            ) : (
              <TypingAnimation
                text={ideas}
                className="whitespace-pre-wrap text-sm"
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
