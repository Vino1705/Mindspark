'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import {useDraftStore} from '@/lib/draft-store';
import {addDraft} from '@/lib/db';
import {BookText, Feather, FileCheck, Save} from 'lucide-react';

export default function WriterPage() {
  const [content, setContent] = useState('');
  const router = useRouter();
  const {setDraftContent} = useDraftStore();
  const {toast} = useToast();

  const handleMove = (path: string) => {
    if (!content) {
      toast({
        variant: 'destructive',
        title: 'Content is empty',
        description: 'Please write some content before moving it.',
      });
      return;
    }
    setDraftContent(content);
    router.push(path);
  };

  const handleSaveDraft = async () => {
    if (!content) return;
    try {
      await addDraft({
        title: `Writer Draft: ${content.substring(0, 20)}...`,
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
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Content Writer</CardTitle>
          <CardDescription>
            Your blank canvas. Write your content here and then move it to a
            tool for refinement.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Start writing your next masterpiece..."
            className="min-h-[400px] flex-1 text-base"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleMove('/rewriter')}
              className="glow-effect"
            >
              <Feather className="mr-2 h-4 w-4" /> Move to Rewriter
            </Button>
            <Button
              variant="outline"
              onClick={() => handleMove('/proofreader')}
              className="glow-effect"
            >
              <FileCheck className="mr-2 h-4 w-4" /> Move to Proofreader
            </Button>
            <Button
              variant="outline"
              onClick={() => handleMove('/summarizer')}
              className="glow-effect"
            >
              <BookText className="mr-2 h-4 w-4" /> Move to Summarizer
            </Button>
            <div className="flex-grow" />
            <Button variant="default" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
