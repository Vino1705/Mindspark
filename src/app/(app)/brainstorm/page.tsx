'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {useOffline} from '@/hooks/use-offline';
import {aiBrainstorm, type AiBrainstormInput} from '@/ai/ai-brainstorm';
import {TypingAnimation} from '@/components/typing-animation';
import {CopyButton} from '@/components/copy-button';
import {useToast} from '@/hooks/use-toast';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Info, Save, Sparkles} from 'lucide-react';
import {addDraft} from '@/lib/db';

async function mockBrainstorm(topic: string): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    `Idea 1 for "${topic}": A completely novel concept.`,
    `Idea 2 for "${topic}": A twist on a classic theme.`,
    `Idea 3 for "${topic}": An unexpected combination.`,
  ];
}

export default function BrainstormPage() {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
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
    setIdeas([]);

    try {
      let result;
      if (isOffline) {
        result = await mockBrainstorm(topic);
        toast({
          title: 'Offline Mode',
          description: 'Showing mock AI data.',
        });
      } else {
        const input: AiBrainstormInput = {
          topic,
        };
        const response = await aiBrainstorm(input);
        result = response.ideas;
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
    if (ideas.length === 0) return;
    try {
      const content = ideas.join('\n\n');
      await addDraft({
        title: `Brainstorm: ${topic.substring(0, 30)}...`,
        content: content,
      });
      toast({title: 'Draft saved successfully!'});
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast({variant: 'destructive', title: 'Error saving draft.'});
    }
  };

  const ideasText = ideas.join('\n\n');

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

      {(isLoading || ideas.length > 0) && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Ideas</CardTitle>
            {ideas.length > 0 && !isLoading && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                  <Save className="mr-2 h-4 w-4" /> Save Draft
                </Button>
                <CopyButton text={ideasText} />
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
                text={ideasText}
                className="whitespace-pre-wrap text-sm"
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
