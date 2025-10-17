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
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                    side: 'right',
                    align: 'center',
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
      <SidebarMenu className="p-2">
        <SidebarMenuItem>
          <Link href={settingsNav.href}>
            <SidebarMenuButton
              isActive={pathname === settingsNav.href}
              tooltip={{
                children: settingsNav.label,
                side: 'right',
                align: 'center',
              }}
            >
              <Settings className="h-5 w-5" />
              <span>{settingsNav.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
