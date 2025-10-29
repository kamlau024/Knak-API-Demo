'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  Palette,
  Sparkles,
  Folders,
  Settings,
  Boxes,
  Tag,
  RefreshCw,
  Languages,
  Plug,
  FolderTree,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Assets',
    href: '/assets',
    icon: FileText,
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Themes',
    href: '/themes',
    icon: Palette,
  },
  {
    name: 'Brands',
    href: '/brands',
    icon: Sparkles,
  },
  {
    name: 'Asset Folders',
    href: '/asset-folders',
    icon: Folders,
  },
  {
    name: 'Asset Custom Fieldsets',
    href: '/asset-custom-fieldsets',
    icon: Settings,
  },
  {
    name: 'Available Platforms',
    href: '/available-platforms',
    icon: Boxes,
  },
  {
    name: 'Merge Tags',
    href: '/merge-tags',
    icon: Tag,
  },
  {
    name: 'Sync Statuses',
    href: '/sync-statuses',
    icon: RefreshCw,
  },
  {
    name: 'Translations',
    href: '/translations',
    icon: Languages,
  },
  {
    name: 'Integrations',
    href: '/integrations',
    icon: Plug,
  },
  {
    name: 'Organization',
    href: '/organization',
    icon: FolderTree,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
