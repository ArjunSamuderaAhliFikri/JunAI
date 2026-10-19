import React from 'react'
import {
  Search,
  Bell,
  Radio,
  Shield,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { UserRole } from '@/types'

interface TopbarProps {
  title: string
  breadcrumb: string
  currentRole: UserRole
  onChangeRole: (role: UserRole) => void
  onOpenSearch: () => void
  onOpenNotifications: () => void
  onStartRecorder: () => void
  unreadCount: number
}

const roles: UserRole[] = [
  'Super Admin',
  'Admin / Project Manager',
  'Employee',
  'Guest',
  'Super Guest',
]

export const Topbar: React.FC<TopbarProps> = ({
  title,
  breadcrumb,
  currentRole,
  onChangeRole,
  onOpenSearch,
  onOpenNotifications,
  onStartRecorder,
  unreadCount,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false)

  return (
    <header className="h-20 px-8 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* Title & Breadcrumbs with vertical room */}
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-zinc-100 tracking-tight leading-none">
          {title}
        </h2>
        <p className="text-xs text-zinc-400 font-mono">
          {breadcrumb}
        </p>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 h-9 px-3.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-xs text-zinc-400 transition-colors cursor-pointer hover:border-zinc-700 min-w-[220px]"
        >
          <Search className="h-4 w-4 text-zinc-500" />
          <span className="flex-1 text-left text-zinc-400">Pencarian global...</span>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-850 border border-zinc-750 text-zinc-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Start Recorder CTA (Shadcn Primary) */}
        <Button
          onClick={onStartRecorder}
          size="default"
          className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 gap-2 font-semibold text-xs h-9 px-4 shadow-xs"
        >
          <Radio className="h-3.5 w-3.5 text-red-600 animate-pulse" />
          Mulai Recorder
        </Button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative h-9 w-9 flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          title="Notifikasi"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Live RBAC Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 h-9 px-3 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
          >
            <Shield className="h-3.5 w-3.5 text-zinc-400" />
            <span className="max-w-[140px] truncate">{currentRole}</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
          </button>

          {roleMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setRoleMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-60 rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider font-mono">
                  Simulasi Role (RBAC)
                </div>
                {roles.map((r) => {
                  const isCurrent = r === currentRole
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        onChangeRole(r)
                        setRoleMenuOpen(false)
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors cursor-pointer"
                    >
                      <span className={isCurrent ? 'font-semibold text-zinc-50' : ''}>
                        {r}
                      </span>
                      {isCurrent && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-zinc-700 bg-zinc-900 text-zinc-300">
                          Aktif
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
