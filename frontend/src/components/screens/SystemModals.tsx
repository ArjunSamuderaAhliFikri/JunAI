import React, { useState, useEffect } from 'react'
import {
  Search,
  AlertOctagon,
  Inbox,
  FileText,
  Radio,
  RotateCcw,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockMeetings, mockDocuments, wireframeScreensList } from '@/data/mockData'

// S-50: Command Palette / Global Search
interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (tab: any, id?: string) => void
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  onNavigate,
}) => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  if (!open) return null

  const filteredDocs = mockDocuments.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase())
  )
  const filteredMeetings = mockMeetings.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase())
  )
  const filteredScreens = wireframeScreensList.filter(
    (s) =>
      s.id.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.group.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-xl shadow-2xl border-zinc-800 bg-zinc-950">
        <div className="p-3 border-b border-zinc-850 flex items-center gap-2 bg-zinc-900/50">
          <Search className="h-4 w-4 text-zinc-500 shrink-0 ml-1" />
          <input
            autoFocus
            className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
            placeholder="Cari dokumen, rapat, user, atau nomor wireframe (S-01 s/d S-50)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-850 border border-zinc-750 text-zinc-400 font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-2.5">
          {filteredScreens.length > 0 && (
            <div className="space-y-0.5">
              <span className="px-2 text-[10px] font-medium text-zinc-500 uppercase tracking-wider font-mono">
                Wireframes
              </span>
              {filteredScreens.slice(0, 4).map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onOpenChange(false)
                    onNavigate('wireframe', s.id)
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-md text-xs text-left hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-zinc-100">{s.id}</span>
                    <span className="text-zinc-300">{s.name}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono border-zinc-800">{s.group}</Badge>
                </button>
              ))}
            </div>
          )}

          {filteredDocs.length > 0 && (
            <div className="space-y-0.5">
              <span className="px-2 text-[10px] font-medium text-zinc-500 uppercase tracking-wider font-mono">
                Dokumen AI
              </span>
              {filteredDocs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    onOpenChange(false)
                    onNavigate('documents', d.id)
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-md text-xs text-left hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-zinc-300 truncate">{d.title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{d.format}</span>
                </button>
              ))}
            </div>
          )}

          {filteredMeetings.length > 0 && (
            <div className="space-y-0.5">
              <span className="px-2 text-[10px] font-medium text-zinc-500 uppercase tracking-wider font-mono">
                Riwayat Meeting
              </span>
              {filteredMeetings.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onOpenChange(false)
                    onNavigate('history')
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-md text-xs text-left hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Radio className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-zinc-300 truncate">{m.title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{m.platform}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// S-47: Empty State View
export const EmptyStateCard: React.FC<{
  title?: string
  description?: string
  actionText?: string
  onAction?: () => void
}> = ({
  title = 'Belum Ada Data Meeting atau Dokumen',
  description = 'Mulai sesi rekaman pertama Anda untuk menghasilkan transkripsi dan rangkuman cerdas otomatis.',
  actionText = 'Mulai Recorder',
  onAction,
}) => {
  return (
    <div className="p-10 text-center rounded-lg border border-dashed border-zinc-800 bg-zinc-950/60 space-y-3.5 max-w-md mx-auto my-8">
      <div className="h-10 w-10 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 flex items-center justify-center mx-auto">
        <Inbox className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-zinc-200">{title}</h4>
        <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>
      {onAction && (
        <Button
          onClick={onAction}
          className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-medium px-4"
        >
          {actionText}
        </Button>
      )}
    </div>
  )
}

// S-49: Error Pemrosesan Modal
export const ErrorProcessingDialog: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
  onRetry: () => void
  errorMessage?: string
}> = ({ open, onOpenChange, onRetry, errorMessage }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <div className="p-2 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-red-950/60 text-red-400 border border-red-800/60 flex items-center justify-center mx-auto">
            <AlertOctagon className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-100">
            S-49: Gagal Memproses Audio Rekaman
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
            {errorMessage ||
              'Terjadi kendala saat menyinkronkan stream PCM atau menghubungi API Gemini. File audio mentah tersimpan aman di buffer.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              onClick={onRetry}
              className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-xs gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Coba Lagi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// SVG Wireframe Modal Viewer
export const SvgWireframeModal: React.FC<{
  screenId: string | null
  onClose: () => void
}> = ({ screenId, onClose }) => {
  if (!screenId) return null

  const screenObj = wireframeScreensList.find((s) => s.id === screenId)
  if (!screenObj) return null

  const filename = `${screenObj.id}_${screenObj.name.replace(/\s+/g, '_').replace(/\//g, '_')}.svg`
  const svgUrl = `/JunAI_Figma_Wireframes/${filename}`

  return (
    <Dialog open={!!screenId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onClose={onClose}
        className="max-w-5xl w-full p-4 max-h-[92vh] flex flex-col border-zinc-800 bg-zinc-950"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-zinc-200">
              {screenObj.id}
            </span>
            <h3 className="text-xs font-semibold text-zinc-100">{screenObj.name}</h3>
            <Badge variant="outline" className="text-[10px] font-mono border-zinc-800">{screenObj.group}</Badge>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">1440 × 900 px</span>
        </div>

        <div className="flex-1 overflow-auto bg-zinc-900/60 border border-zinc-850 rounded-lg p-2 my-2 flex items-center justify-center min-h-[380px]">
          <img
            src={svgUrl}
            alt={screenObj.name}
            className="w-full h-auto rounded shadow-sm border border-zinc-800"
          />
        </div>

        <div className="text-xs text-zinc-400 flex justify-between items-center pt-2 border-t border-zinc-850">
          <span className="text-[11px] text-zinc-400">{screenObj.desc}</span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs h-7">
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
