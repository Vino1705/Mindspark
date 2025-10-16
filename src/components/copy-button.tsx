'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Check, Copy} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({text}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const {toast} = useToast();

  const copyToClipboard = async () => {
    if (!text) {
      toast({
        variant: 'destructive',
        title: 'Nothing to copy',
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
      toast({title: 'Copied to clipboard!'});
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to copy',
        description: 'Could not copy text to clipboard.',
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={copyToClipboard}>
            {hasCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy to clipboard</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy to clipboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
