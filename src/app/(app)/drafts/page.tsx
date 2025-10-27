'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {getDrafts, deleteDraft, type Draft} from '@/lib/db';
import {format} from 'date-fns';
import {Trash2, Download, Edit} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {Skeleton} from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useDraftStore} from '@/lib/draft-store';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {toast} = useToast();
  const router = useRouter();
  const {setDraftContent} = useDraftStore();

  const fetchDrafts = async () => {
    setIsLoading(true);
    try {
      const savedDrafts = await getDrafts();
      setDrafts(savedDrafts);
    } catch (error) {
      console.error('Failed to fetch drafts:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load drafts from the database.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteDraft(id);
      toast({title: 'Draft deleted successfully.'});
      fetchDrafts();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete draft.',
      });
    }
  };

  const handleEdit = (draft: Draft) => {
    let path = '';
    if (draft.title.startsWith('Brainstorm:')) {
      path = '/rewriter'; // Send brainstorm ideas to the rewriter
    } else if (draft.title.startsWith('Rewritten:')) {
      path = '/rewriter';
    } else if (draft.title.startsWith('Proofread:')) {
      path = '/proofreader';
    } else if (draft.title.startsWith('Summary:')) {
      path = '/summarizer';
    }

    if (path) {
      setDraftContent(draft.content);
      router.push(path);
    } else {
      toast({
        variant: 'destructive',
        title: 'Unknown Draft Type',
        description: 'Could not determine the correct tool for this draft.',
      });
    }
  };

  const exportAsFile = (
    content: string,
    filename: string,
    type: 'txt' | 'md'
  ) => {
    const blob = new Blob([content], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Export successful',
      description: `Draft exported as a .${type} file.`,
    });
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      {drafts.length === 0 ? (
        <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border-2 border-dashed">
          <h2 className="text-2xl font-semibold">No Drafts Yet</h2>
          <p className="mt-2 text-muted-foreground">
            Your saved content from Brainstorm, Rewriter, and other tools will
            appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drafts.map(draft => (
            <Card key={draft.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  {draft.title || 'Untitled Draft'}
                </CardTitle>
                <CardDescription>
                  Last updated: {format(new Date(draft.updatedAt), 'PPp')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-3 text-sm">{draft.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(draft)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="glow-effect">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Export</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        exportAsFile(draft.content, draft.title, 'txt')
                      }
                    >
                      Export as .txt
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        exportAsFile(draft.content, draft.title, 'md')
                      }
                    >
                      Export as .md
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(draft.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
