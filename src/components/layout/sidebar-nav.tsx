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
  {href: '/brainstorm', icon: Brain, label: 'Brainstorm'},
  {href: '/rewriter', icon: Feather, label: 'Rewriter'},
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
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{
                  children: item.label,
                  side: 'right',
                  align: 'center',
                }}
              >
                <Link href={item.href}>
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
      <SidebarMenu className="p-2">
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname === settingsNav.href}
            tooltip={{
              children: settingsNav.label,
              side: 'right',
              align: 'center',
            }}
          >
            <Link href={settingsNav.href}>
              <Settings className="h-5 w-5" />
              <span>{settingsNav.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
