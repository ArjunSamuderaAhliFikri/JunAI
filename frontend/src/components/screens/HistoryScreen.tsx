import React, { useState } from 'react'
import {
  Search,
  FileSpreadsheet,
  Play,
  Volume2,
  ArrowLeft,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { mockMeetings } from '@/data/mockData'
import type { MeetingItem, UserRole } from '@/types'

interface HistoryScreenProps {
  currentRole: UserRole
  onViewSummaryDoc: (docId: string) => void
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  currentRole,
  onViewSummaryDoc,
}) => {
  const [meetings] = useState<MeetingItem[]>(mockMeetings)
  const [searchQuery, setSearchQuery] = useState('')
  const [platformFilter, setPlatformFilter] = useState<string>('ALL')
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingItem | null>(null)

  // S-28: Export Excel Modal & RBAC check
  const [showExportExcel, setShowExportExcel] = useState(false)
  const [exportNotice, setExportNotice] = useState<string | null>(null)

  const canExportExcel =
    currentRole === 'Super Admin' || currentRole === 'Admin / Project Manager'

  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.organizer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform =
      platformFilter === 'ALL' ? true : m.platform === platformFilter
    return matchesSearch && matchesPlatform
  })

  const handleExportExcel = () => {
    if (!canExportExcel) {
      setExportNotice('Hak akses ditolak: Hanya Admin / Project Manager yang dapat mengekspor riwayat ke Excel.')
      return
    }

    const csvContent = `ID,Judul Meeting,Platform,Tanggal,Waktu,Durasi (Menit),Jumlah Partisipan,Organizer,Status
${meetings
  .map(
    (m) =>
      `"${m.id}","${m.title}","${m.platform}","${m.date}","${m.time}",${m.durationMinutes},${m.participantsCount},"${m.organizer}","${m.status}"`
  )
  .join('\n')}`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `JunAI_Meeting_History_Report_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)

    setShowExportExcel(false)
    setExportNotice('Berkas CSV/Excel berhasil di-generate dan diunduh.')
    setTimeout(() => setExportNotice(null), 4000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-20">
      {exportNotice && (
        <div
          className={`p-3 rounded-lg text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in ${
            exportNotice.includes('ditolak')
              ? 'bg-red-950/60 border border-red-800 text-red-200'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {exportNotice.includes('ditolak') ? (
              <ShieldAlert className="h-4 w-4 text-red-400" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            )}
            <span>{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="text-zinc-400 hover:text-zinc-200">
            Tutup
          </button>
        </div>
      )}

      {/* S-24: RIWAYAT MEETING LIST */}
      {!selectedMeeting ? (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle>S-24: Riwayat Meeting</CardTitle>
                <CardDescription>
                  Arsip seluruh sesi meeting yang telah direkam dan diproses audio transkripsinya.
                </CardDescription>
              </div>

              {/* S-28: Ekspor Excel Button */}
              <Button
                onClick={() => setShowExportExcel(true)}
                variant="outline"
                size="sm"
                className="text-xs font-medium gap-1.5 border-zinc-800 text-zinc-300 hover:bg-zinc-900 shadow-xs"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-zinc-400" />
                S-28 Ekspor ke Excel (.xlsx)
              </Button>
            </div>

            {/* S-25: Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-zinc-850">
              <div className="sm:col-span-2">
                <Input
                  icon={<Search className="h-3.5 w-3.5" />}
                  placeholder="Cari berdasarkan judul meeting atau nama organizer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium">
                {['ALL', 'Discord', 'Zoom', 'Google Meet'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatformFilter(p)}
                    className={`flex-1 py-0.5 rounded transition-colors text-center cursor-pointer ${
                      platformFilter === p
                        ? 'bg-zinc-800 text-zinc-100 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {p === 'Google Meet' ? 'Meet' : p}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meeting &amp; Tanggal</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Durasi / WAV</TableHead>
                  <TableHead>Partisipan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetings.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium text-xs text-zinc-200">
                        {item.title}
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {item.date} • {item.time} WIB • {item.organizer}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.platform === 'Discord'
                            ? 'discord'
                            : item.platform === 'Zoom'
                            ? 'zoom'
                            : 'gmeet'
                        }
                        className="text-[10px]"
                      >
                        {item.platform}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-zinc-400 font-mono">
                      {item.audioDuration || `${item.durationMinutes} mnt`}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-400">
                      {item.participantsCount} Peserta
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => setSelectedMeeting(item)}
                        size="sm"
                        variant="secondary"
                        className="text-[11px] h-7 px-2.5 font-medium"
                      >
                        S-26 Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        /* S-26 & S-27: DETAIL MEETING & KONTRIBUTOR VIEW */
        <div className="space-y-5 animate-in fade-in duration-150">
          <Button
            onClick={() => setSelectedMeeting(null)}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Riwayat
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* S-26: Detail Meeting Main Card */}
            <div className="lg:col-span-2 space-y-5">
              <Card>
                <CardHeader className="border-b border-zinc-850 pb-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{selectedMeeting.platform}</Badge>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Processing Complete
                    </span>
                  </div>
                  <CardTitle className="text-base font-semibold mt-2">
                    {selectedMeeting.title}
                  </CardTitle>
                  <p className="text-xs text-zinc-500 font-mono">
                    {selectedMeeting.date} • {selectedMeeting.time} WIB • Organizer: {selectedMeeting.organizer}
                  </p>
                </CardHeader>
                <CardContent className="space-y-5 pt-4">
                  {/* WAV Audio Player Card */}
                  <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Volume2 className="h-3.5 w-3.5 text-zinc-300" />
                        stereo_audio_merged.wav (16-bit 48kHz)
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500">
                        {selectedMeeting.audioDuration}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="h-8 w-8 rounded-full bg-zinc-100 text-zinc-950 flex items-center justify-center hover:bg-zinc-300 transition-colors cursor-pointer shrink-0">
                        <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                      </button>
                      <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="w-1/3 h-full bg-zinc-200" />
                      </div>
                    </div>
                  </div>

                  {/* Summary Link CTA */}
                  {selectedMeeting.summaryDocId && (
                    <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-zinc-200">
                          Dokumen Rangkuman AI Gemini Tersedia
                        </h4>
                        <p className="text-[11px] text-zinc-400">
                          Poin inti, keputusan utama, dan action items yang diekstrak.
                        </p>
                      </div>
                      <Button
                        onClick={() => onViewSummaryDoc(selectedMeeting.summaryDocId!)}
                        className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-medium gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Buka Dokumen AI
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* S-27: Kontributor Meeting Side Panel */}
            <div className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xs uppercase tracking-wider text-zinc-400">
                    S-27: Kontributor &amp; Talk-Time
                  </CardTitle>
                  <CardDescription>
                    Porsi durasi berbicara per partisipan hasil isolasi audio PCM
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3.5">
                  {selectedMeeting.contributors.map((c, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-zinc-200">{c.name}</span>
                        <span className="font-mono text-zinc-500 text-[11px]">{c.talkPercentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-850 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-200 rounded-full transition-all"
                          style={{ width: `${c.talkPercentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">{c.role}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* S-28: EKSPOR RIWAYAT EXCEL MODAL */}
      <Dialog open={showExportExcel} onOpenChange={setShowExportExcel}>
        <DialogContent onClose={() => setShowExportExcel(false)}>
          <DialogHeader>
            <DialogTitle>S-28: Ekspor Riwayat Meeting ke Excel (.xlsx)</DialogTitle>
            <DialogDescription>
              Generate rekapitulasi sesi meeting, durasi, platform, dan kontributor untuk laporan audit.
            </DialogDescription>
          </DialogHeader>

          {canExportExcel ? (
            <div className="space-y-2 my-2 text-xs">
              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-300">
                <span className="font-semibold text-zinc-200">Otorisasi: {currentRole}</span>
                <p className="mt-0.5 text-zinc-400 text-[11px]">
                  Anda memiliki wewenang untuk mengekspor data komprehensif riwayat rapat ke format CSV / Excel.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 my-2 text-xs">
              <div className="p-3 bg-red-950/60 rounded-lg border border-red-900/60 text-red-200">
                <span className="font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-red-400" />
                  Pembatasan Hak Akses (PRD RBAC)
                </span>
                <p className="mt-1 text-red-300 text-[11px]">
                  Sesuai ketentuan PRD JunAI V1.0, fitur ekspor Excel hanya diperbolehkan untuk <strong>Admin / Project Manager</strong> dan <strong>Super Admin</strong>. Role Anda saat ini adalah <strong>{currentRole}</strong>.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportExcel(false)}>
              Batal
            </Button>
            {canExportExcel && (
              <Button
                onClick={handleExportExcel}
                className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium"
              >
                Unduh Berkas Excel Sekarang
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Wireframe Reference */}
      <div className="pt-2 text-[10px] text-zinc-500 flex items-center justify-between border-t border-zinc-850">
        <span>JunAI • PRD V1.0.0 • Riwayat S-24 sampai S-28</span>
        <span className="font-mono">RBAC Excel Protected</span>
      </div>
    </div>
  )
}
