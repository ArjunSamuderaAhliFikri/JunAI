import React from 'react'
import {
  Layers,
  ChevronUp,
  ChevronDown,
  X,
  Eye,
} from 'lucide-react'
import { wireframeScreensList } from '@/data/mockData'
import { cn } from '@/lib/utils'

interface WireframeNavigatorProps {
  currentScreenId: string
  onSelectScreen: (screenId: string) => void
  onOpenSvgViewer: (screenId: string) => void
}

export const WireframeNavigator: React.FC<WireframeNavigatorProps> = ({
  currentScreenId,
  onSelectScreen,
  onOpenSvgViewer,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [filterGroup, setFilterGroup] = React.useState<string>('All')

  const groups = ['All', 'Auth', 'Core', 'Meeting', 'Documents', 'History', 'Scheduling', 'Users & RBAC', 'Follow-up', 'System']

  const filteredScreens = wireframeScreensList.filter((s) =>
    filterGroup === 'All' ? true : s.group === filterGroup
  )

  const activeScreen = wireframeScreensList.find((s) => s.id === currentScreenId) || wireframeScreensList[5]

  return (
    <div className="fixed bottom-4 right-6 z-40 flex flex-col items-end">
      {/* Expanded Screen Selector Tray */}
      {isExpanded && (
        <div className="mb-2 w-[460px] max-h-[500px] rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl p-4 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-zinc-400" />
              <h4 className="text-xs font-semibold text-zinc-200">
                Figma Wireframes Catalog (50 Screens)
              </h4>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Group Filter Chips */}
          <div className="flex flex-wrap gap-1 py-2 border-b border-zinc-850">
            {groups.map((g) => (
              <button
                key={g}
                onClick={() => setFilterGroup(g)}
                className={cn(
                  'px-2 py-0.5 text-[10px] font-medium rounded transition-colors cursor-pointer',
                  filterGroup === g
                    ? 'bg-zinc-100 text-zinc-950 font-semibold'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
                )}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Screen List */}
          <div className="flex-1 overflow-y-auto space-y-1 py-2 max-h-[320px] pr-1">
            {filteredScreens.map((s) => {
              const isSelected = s.id === currentScreenId
              return (
                <div
                  key={s.id}
                  className={cn(
                    'p-2 rounded-md border transition-colors flex items-center justify-between gap-3 text-left cursor-pointer group',
                    isSelected
                      ? 'border-zinc-700 bg-zinc-900 shadow-2xs'
                      : 'border-zinc-850/80 hover:border-zinc-750 hover:bg-zinc-900/40'
                  )}
                  onClick={() => onSelectScreen(s.id)}
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-zinc-200">
                        {s.id}
                      </span>
                      <span className="text-xs text-zinc-300 font-medium truncate">
                        {s.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                        {s.group}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                      {s.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenSvgViewer(s.id)
                      }}
                      title="Lihat Wireframe SVG Asli"
                      className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer stats */}
          <div className="pt-2 text-[10px] text-zinc-500 border-t border-zinc-850 flex items-center justify-between">
            <span>50 wireframes loaded</span>
            <span className="font-mono">PRD V1.0.0</span>
          </div>
        </div>
      )}

      {/* Floating Pill Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/95 hover:bg-zinc-850 text-zinc-300 shadow-xl border border-zinc-800 transition-colors text-xs font-medium cursor-pointer"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
        <span>
          Wireframe: <strong className="text-zinc-100 font-mono">{activeScreen.id}</strong> {activeScreen.name}
        </span>
        {isExpanded ? (
          <ChevronDown className="h-3 w-3 text-zinc-500" />
        ) : (
          <ChevronUp className="h-3 w-3 text-zinc-500" />
        )}
      </button>
    </div>
  )
}
