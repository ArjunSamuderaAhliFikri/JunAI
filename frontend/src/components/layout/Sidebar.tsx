import React from 'react'
import {
  LayoutDashboard,
  Radio,
  FileText,
  History,
  Calendar,
  Bell,
  Users,
  Settings,
  CheckSquare,
  LogOut,
  Command,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserRole } from '@/types'

export type NavTab =
  | 'dashboard'
  | 'meetings'
  | 'documents'
  | 'history'
  | 'schedule'
  | 'followup'
  | 'notifications'
  | 'users'
  | 'settings'

interface SidebarProps {
  activeTab: NavTab
  onSelectTab: (tab: NavTab) => void
  currentRole: UserRole
  unreadNotifsCount: number
  pendingTasksCount: number
  onLogout: () => void
  isRecording?: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  unreadNotifsCount,
  pendingTasksCount,
  onLogout,
  isRecording,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'meetings' as NavTab,
      label: 'Meetings & Recorder',
      icon: Radio,
      badge: isRecording ? 'REC' : null,
      badgeColor: isRecording ? 'bg-red-500/20 text-red-400 border border-red-500/30' : undefined,
    },
    {
      id: 'documents' as NavTab,
      label: 'Files & Dokumen AI',
      icon: FileText,
      badge: '3',
    },
    {
      id: 'history' as NavTab,
      label: 'Riwayat Sesi',
      icon: History,
      badge: null,
    },
    {
      id: 'schedule' as NavTab,
      label: 'Jadwal & Kalender',
      icon: Calendar,
      badge: '4',
    },
    {
      id: 'followup' as NavTab,
      label: 'Follow-up & Task',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : null,
    },
    {
      id: 'notifications' as NavTab,
      label: 'Notifikasi',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : null,
      badgeColor: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
    },
    {
      id: 'users' as NavTab,
      label: 'Pengguna & RBAC',
      icon: Users,
      badge: null,
      hidden: currentRole === 'Guest' || currentRole === 'Super Guest',
    },
    {
      id: 'settings' as NavTab,
      label: 'Pengaturan',
      icon: Settings,
      badge: null,
    },
  ]

  return (
    <aside className="w-[240px] bg-zinc-950 text-zinc-300 flex flex-col shrink-0 min-h-screen select-none border-r border-zinc-800">
      {/* Brand Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-xs shadow-xs">
            <Command className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-100 leading-none">
              JunAI
            </h1>
            <p className="text-[10px] font-medium text-zinc-500 tracking-wider mt-0.5 uppercase">
              Meeting Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5">
        <div className="px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase text-zinc-500">
          Workspace
        </div>
        {navItems
          .filter((item) => !item.hidden)
          .map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'bg-zinc-850 text-zinc-50 font-semibold shadow-2xs'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      'h-3.5 w-3.5 transition-colors',
                      isActive ? 'text-zinc-100' : 'text-zinc-500'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.2 rounded font-mono',
                      item.badgeColor || 'bg-zinc-800 text-zinc-400'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
      </nav>

      {/* System Status Pill */}
      <div className="px-3 py-2.5 mx-2.5 my-2 rounded-md bg-zinc-900/60 border border-zinc-800/80 text-[11px]">
        <div className="flex items-center justify-between text-zinc-400">
          <span>Engine</span>
          <span className="inline-flex items-center gap-1 font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Gemini Flash
          </span>
        </div>
        <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">
          PCM → WAV (48kHz)
        </p>
      </div>

      {/* Role & User Footer */}
      <div className="p-3 border-t border-zinc-850 bg-zinc-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-semibold text-zinc-200 shrink-0">
              {currentRole[0]}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-zinc-200 truncate">
                {currentRole}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Keluar / Reset Sesi"
            className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
