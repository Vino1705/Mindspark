import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {
  Brain,
  Feather,
  FileCheck,
  BookText,
  Save,
  Settings,
} from 'lucide-react';

const tools = [
  {
    href: '/brainstorm',
    icon: Brain,
    label: 'Brainstorm',
    description: 'Generate creative ideas and outlines.',
  },
  {
    href: '/rewriter',
    icon: Feather,
    label: 'Rewriter',
    description: 'Rewrite text with different tones.',
  },
  {
    href: '/proofreader',
    icon: FileCheck,
    label: 'Proofreader',
    description: 'Check for grammar and spelling errors.',
  },
  {
    href: '/summarizer',
    icon: BookText,
    label: 'Summarizer',
    description: 'Condense long text into key points.',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to MindSpark
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your offline AI co-creator. Select a tool to get started.
        </p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <Link href={tool.href} key={tool.href} className="glow-effect">
              <div className="flex h-full flex-col items-start justify-between rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-primary/20">
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
