'use client';

import {usePathname} from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {SidebarNav} from '@/components/layout/sidebar-nav';
import {Sparkles} from 'lucide-react';
import type {ReactNode} from 'react';
import Link from 'next/link';

const pageTitles: {[key: string]: string} = {
  '/dashboard': 'Dashboard',
  '/brainstorm': 'Blog Idea Generator',
  '/rewriter': 'Tone Adjuster',
  '/proofreader': 'Proofreader',
  '/summarizer': 'Summarizer',
  '/drafts': 'My Drafts',
  '/settings': 'Settings',
};

export default function AppLayout({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'ContentSpark';

  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex h-full flex-col">
          <Link href="/dashboard">
            <div className="flex h-16 items-center gap-3 p-4">
              <Sparkles className="size-8 text-ring" />
              <h2 className="text-2xl font-bold group-data-[collapsible=icon]:hidden">
                ContentSpark
              </h2>
            </div>
          </Link>
          <SidebarNav />
        </div>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 p-4 backdrop-blur-sm">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">{title}</h1>
          </header>
          <main className="flex-1 p-4 lg:p-6">{children}</main>
          <footer className="border-t py-4 text-center text-sm text-muted-foreground">
            Powered by Gemini. Made with ❤️ by the ContentSpark Team.
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
