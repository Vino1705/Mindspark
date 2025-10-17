'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {
  Brain,
  Feather,
  FileCheck,
  BookText,
  Save,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {cn} from '@/lib/utils';

const navItems = [
  {href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard'},
  {href: '/brainstorm', icon: Brain, label: 'Blog Idea Generator'},
  {href: '/rewriter', icon: Feather, label: 'Tone Adjuster'},
  {href: '/proofreader', icon: FileCheck, label: 'Proofreader'},
  {href: '/summarizer', icon: BookText, label: 'Summarizer'},
  {href: '/drafts', icon: Save, label: 'Drafts'},
];

const settingsNav = {
  href: '/settings',
  icon: Settings,
  label: 'Settings',
};

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 flex-col justify-between">
      <SidebarMenu className="flex-1 p-2">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <SidebarMenuItem key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50',
                  'h-8 text-sm',
                  pathname === item.href &&
                    'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
      <SidebarMenu className="p-2">
        <SidebarMenuItem>
          <Link
            href={settingsNav.href}
            className={cn(
              'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50',
              'h-8 text-sm',
              pathname === settingsNav.href &&
                'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
            )}
          >
            <Settings className="h-5 w-5" />
            <span>{settingsNav.label}</span>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
