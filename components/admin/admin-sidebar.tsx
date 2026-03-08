'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FileText, Users, Settings, ScrollText, Building2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/listings', label: 'Manage Listings', icon: FileText },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/settings', label: 'Phases & Blocks', icon: Settings },
  { href: '/admin/logs', label: 'Activity Logs', icon: ScrollText },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card min-h-screen">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <div>
            <div className="font-bold">NTR Admin</div>
            <div className="text-xs text-muted-foreground">Management Panel</div>
          </div>
        </Link>
      </div>
      <nav className="p-4 space-y-1">
        {adminLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
        <div className="pt-4 mt-4 border-t border-border">
          <Button variant="outline" className="w-full justify-start gap-3" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to User Panel
            </Link>
          </Button>
        </div>
      </nav>
    </aside>
  )
}
