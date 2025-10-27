import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {
  Brain,
  Feather,
  FileCheck,
  BookText,
  Save,
  Settings,
  PlusCircle,
} from 'lucide-react';

const tools = [
  {
    href: '/brainstorm',
    icon: Brain,
    label: 'Blog Idea Generator',
    description: 'Brainstorm compelling topics and outlines for your next blog post.',
  },
  {
    href: '/rewriter',
    icon: Feather,
    label: 'Tone Adjuster',
    description: 'Rewrite your content to match the perfect tone for your audience.',
  },
  {
    href: '/proofreader',
    icon: FileCheck,
    label: 'Proofreader',
    description: 'Polish your writing by catching grammar and spelling errors.',
  },
  {
    href: '/summarizer',
    icon: BookText,
    label: 'Summarizer',
    description: 'Condense articles and research into key takeaways instantly.',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="text-left">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to ContentSpark
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your AI partner for creating exceptional marketing content.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/writer">
          <div className="glow-effect flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-card p-6 text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-primary/20">
            <PlusCircle className="mb-4 size-10 text-primary" />
            <h2 className="text-xl font-semibold">Create New Content</h2>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Start with a blank canvas.
            </p>
          </div>
        </Link>
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <Link href={tool.href} key={tool.href}>
              <div className="flex h-full min-h-[200px] flex-col items-start justify-between rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">{tool.label}</h2>
                  </div>
                  <p className="text-muted-foreground">{tool.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
