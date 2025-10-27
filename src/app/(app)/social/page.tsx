'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  generateSocialMediaPost,
  type GenerateSocialMediaPostInput,
} from '@/ai/flows/social-media-post-generator';
import {TypingAnimation} from '@/components/typing-animation';
import {CopyButton} from '@/components/copy-button';
import {useToast} from '@/hooks/use-toast';
import {Save, ThumbsUp} from 'lucide-react';
import {addDraft} from '@/lib/db';
import {Textarea} from '@/components/ui/textarea';

type Platform = 'Twitter' | 'LinkedIn' | 'Instagram';

export default function SocialMediaPostGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('Twitter');
  const [post, setPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        variant: 'destructive',
        title: 'Topic is empty',
        description: 'Please enter a topic to generate a post about.',
      });
      return;
    }
    setIsLoading(true);
    setPost('');

    try {
      const input: GenerateSocialMediaPostInput = {
        topic,
        platform,
      };
      const response = await generateSocialMediaPost(input);
      setPost(response.post);
    } catch (error) {
      console.error('Post generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate post. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!post) return;
    try {
      const content = post;
      await addDraft({
        title: `Social Post: ${topic.substring(0, 30)}...`,
        content: content,
      });
      toast({title: 'Draft saved successfully!'});
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast({variant: 'destructive', title: 'Error saving draft.'});
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Post Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Enter a topic, summary, or a few keywords..."
            className="min-h-[150px]"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              value={platform}
              onValueChange={(value: Platform) => setPlatform(value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Twitter">Twitter</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="glow-effect"
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              {isLoading ? 'Generating...' : 'Generate Post'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {(isLoading || post) && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Post</CardTitle>
            {post && !isLoading && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                  <Save className="mr-2 h-4 w-4" /> Save Draft
                </Button>
                <CopyButton text={post} />
              </div>
            )}
          </CardHeader>
          <CardContent className="min-h-[150px]">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[70%]" />
              </div>
            ) : (
              <TypingAnimation
                text={post}
                className="whitespace-pre-wrap text-sm"
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
