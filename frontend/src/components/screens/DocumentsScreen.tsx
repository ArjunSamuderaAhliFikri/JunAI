import React, { useState } from 'react'
import {
  Search,
  FileText,
  Download,
  Calendar,
  User as UserIcon,
  CheckSquare,
  Sparkles,
  ArrowLeft,
  History,
  FileCheck,
  Check,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { mockDocuments } from '@/data/mockData'
import type { DocumentItem } from '@/types'

interface DocumentsScreenProps {
  initialDocId?: string | null
  onBackToDashboard: () => void
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({
  initialDocId,
}) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments)
  const [searchQuery, setSearchQuery] = useState('')
  const [formatFilter, setFormatFilter] = useState<'ALL' | 'PDF' | 'TXT'>('ALL')
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(
    initialDocId
      ? mockDocuments.find((d) => d.id === initialDocId) || mockDocuments[0]
      : null
  )

  // Export Modals (S-20, S-21, S-22, S-23)
  const [showExportPdf, setShowExportPdf] = useState(false)
  const [showExportTxt, setShowExportTxt] = useState(false)
  const [showDownloadAlert, setShowDownloadAlert] = useState<string | null>(null)
  const [showDocHistory, setShowDocHistory] = useState(false)

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFormat =
      formatFilter === 'ALL'
        ? true
        : doc.format === formatFilter || doc.format === 'BOTH'

    return matchesSearch && matchesFormat
  })

  const handleToggleTask = (taskIndex: number) => {
    if (!selectedDoc) return
    const updated = { ...selectedDoc }
    const currentStatus = updated.actionItems[taskIndex].status
    updated.actionItems[taskIndex].status =
      currentStatus === 'Completed' ? 'Pending' : 'Completed'
    setSelectedDoc(updated)
    setDocuments((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    )
  }

  const handleDownloadFile = (format: 'PDF' | 'TXT') => {
    if (!selectedDoc) return

    if (format === 'TXT') {
      const content = `=========================================
JUNAI MEETING SUMMARY - ${selectedDoc.title}
=========================================
Tanggal: ${selectedDoc.createdAt}
Author: ${selectedDoc.author}

[RINGKASAN EKSEKUTIF]
${selectedDoc.summary}

[KEPUTUSAN UTAMA]
${selectedDoc.keyDecisions.map((kd, idx) => `${idx + 1}. ${kd}`).join('\n')}

[ACTION ITEMS]
${selectedDoc.actionItems
  .map(
    (a) =>
      `[${a.status === 'Completed' ? 'X' : ' '}] ${a.task} (PIC: ${a.assignee}, Deadline: ${a.deadline})`
  )
  .join('\n')}

[TRANSKRIPSI]
${selectedDoc.transcription
  .map((t) => `[${t.timestamp}] ${t.speaker}: ${t.text}`)
  .join('\n')}
`
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${selectedDoc.title.replace(/\s+/g, '_')}.txt`
      link.click()
      URL.revokeObjectURL(url)
    }

    setShowExportPdf(false)
    setShowExportTxt(false)
    setShowDownloadAlert(`Dokumen ${selectedDoc.title} format ${format} berhasil diunduh.`)
    setTimeout(() => setShowDownloadAlert(null), 4000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-20">
      {/* Download Alert (S-22) */}
      {showDownloadAlert && (
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-400" />
            <span>S-22 Unduh Dokumen: {showDownloadAlert}</span>
          </div>
          <button
            onClick={() => setShowDownloadAlert(null)}
            className="text-zinc-400 hover:text-zinc-200"
          >
            Tutup
          </button>
        </div>
      )}

      {/* S-18: DAFTAR DOKUMEN VIEW */}
      {!selectedDoc ? (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle>S-18: Daftar Dokumen AI</CardTitle>
                <CardDescription>
                  Koleksi rangkuman cerdas, keputusan, dan transkrip hasil meeting.
                </CardDescription>
              </div>

              {/* Format Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setFormatFilter('ALL')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    formatFilter === 'ALL'
                      ? 'bg-zinc-800 text-zinc-100 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFormatFilter('PDF')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    formatFilter === 'PDF'
                      ? 'bg-zinc-800 text-zinc-100 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  PDF
                </button>
                <button
                  onClick={() => setFormatFilter('TXT')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    formatFilter === 'TXT'
                      ? 'bg-zinc-800 text-zinc-100 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  TXT
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="pt-2">
              <Input
                icon={<Search className="h-3.5 w-3.5" />}
                placeholder="Cari berdasarkan kata kunci dokumen, author, atau isi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Dokumen</TableHead>
                  <TableHead>Author / PIC</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                      Tidak ada dokumen yang sesuai dengan pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="font-medium text-xs text-zinc-200">
                          {doc.title}
                        </div>
                        <p className="text-[11px] text-zinc-500 line-clamp-1 max-w-md">
                          {doc.summary}
                        </p>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-400">
                        {doc.author}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500 font-mono">
                        {doc.createdAt}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-mono border-zinc-800 text-zinc-400">
                          {doc.format}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => setSelectedDoc(doc)}
                          size="sm"
                          variant="secondary"
                          className="text-[11px] h-7 px-2.5 font-medium"
                        >
                          Buka
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        /* S-19: DETAIL RANGKUMAN VIEW */
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Top Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <Button
              onClick={() => setSelectedDoc(null)}
              variant="outline"
              size="sm"
              className="text-xs text-zinc-300 w-fit gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Daftar Dokumen
            </Button>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowDocHistory(true)}
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
              >
                <History className="h-3.5 w-3.5 text-zinc-400" /> S-23 Riwayat
              </Button>
              <Button
                onClick={() => setShowExportTxt(true)}
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
              >
                <FileText className="h-3.5 w-3.5 text-zinc-400" /> S-21 Ekspor TXT
              </Button>
              <Button
                onClick={() => setShowExportPdf(true)}
                size="sm"
                className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-medium gap-1.5 shadow-xs"
              >
                <Download className="h-3.5 w-3.5 text-zinc-950" /> S-20 Ekspor PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2 Cols: Main Summary Content */}
            <div className="lg:col-span-2 space-y-5">
              <Card>
                <CardHeader className="border-b border-zinc-850 pb-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-zinc-800 text-zinc-300 font-mono text-[10px]">
                      Gemini Flash
                    </Badge>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {selectedDoc.fileSize}
                    </span>
                  </div>
                  <CardTitle className="text-base font-semibold mt-2">
                    {selectedDoc.title}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 pt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <UserIcon className="h-3.5 w-3.5" /> {selectedDoc.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {selectedDoc.createdAt}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 pt-4">
                  {/* Executive Summary */}
                  <div className="space-y-1.5">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
                      Ringkasan Eksekutif
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3.5 rounded-lg border border-zinc-800">
                      {selectedDoc.summary}
                    </p>
                  </div>

                  {/* Key Decisions */}
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Keputusan Utama (Key Decisions)
                    </h4>
                    <div className="space-y-1.5">
                      {selectedDoc.keyDecisions.map((kd, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-2 rounded-md border border-zinc-850 bg-zinc-900/40 text-xs text-zinc-300"
                        >
                          <span className="h-4 w-4 rounded bg-zinc-800 text-zinc-300 font-mono flex items-center justify-center shrink-0 text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed text-[11px]">{kd}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Items Checklist */}
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <CheckSquare className="h-3.5 w-3.5 text-zinc-300" />
                      Daftar Tindak Lanjut (Action Items)
                    </h4>
                    <div className="space-y-1.5">
                      {selectedDoc.actionItems.map((item, idx) => {
                        const isDone = item.status === 'Completed'
                        return (
                          <div
                            key={idx}
                            onClick={() => handleToggleTask(idx)}
                            className={`p-2.5 rounded-lg border transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                              isDone
                                ? 'bg-zinc-950/60 border-zinc-850 opacity-50'
                                : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div
                                className={`mt-0.5 h-3.5 w-3.5 rounded flex items-center justify-center border transition-colors ${
                                  isDone
                                    ? 'bg-zinc-200 border-zinc-200 text-zinc-950'
                                    : 'border-zinc-700 bg-zinc-900'
                                }`}
                              >
                                {isDone && <Check className="h-3 w-3" />}
                              </div>
                              <div>
                                <p
                                  className={`text-xs ${
                                    isDone
                                      ? 'line-through text-zinc-500'
                                      : 'text-zinc-200 font-medium'
                                  }`}
                                >
                                  {item.task}
                                </p>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                  PIC: {item.assignee} • Tenggat: {item.deadline}
                                </span>
                              </div>
                            </div>
                            <Badge
                              variant={
                                item.priority === 'High'
                                  ? 'destructive'
                                  : item.priority === 'Medium'
                                  ? 'warning'
                                  : 'secondary'
                              }
                              className="text-[9px] px-1.5 py-0"
                            >
                              {item.priority}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right 1 Col: Speaker Diarization */}
            <div className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xs uppercase tracking-wider text-zinc-400">
                    Transkrip Suara Partisipan
                  </CardTitle>
                  <CardDescription>
                    Hasil diarization multi-channel PCM yang dipadankan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {selectedDoc.transcription.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-md bg-zinc-900/60 border border-zinc-800 text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between font-medium text-zinc-200">
                        <span>{t.speaker}</span>
                        <span className="font-mono text-[10px] text-zinc-500">
                          {t.timestamp}
                        </span>
                      </div>
                      <p className="text-zinc-400 leading-relaxed text-[11px]">
                        {t.text}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-zinc-950 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-[11px] uppercase text-zinc-400">
                    Hak Akses Dokumen
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-zinc-400 space-y-1.5">
                  <p>• Terbuka untuk seluruh peserta rapat yang diundang.</p>
                  <p>• Format ekspor PDF &amp; TXT tersedia untuk semua role.</p>
                  <p>• Audit log versi tersimpan otomatis.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* S-20: EKSPOR PDF MODAL */}
      <Dialog open={showExportPdf} onOpenChange={setShowExportPdf}>
        <DialogContent onClose={() => setShowExportPdf(false)}>
          <DialogHeader>
            <DialogTitle>S-20: Ekspor Rangkuman ke PDF</DialogTitle>
            <DialogDescription>
              Buat dokumen PDF resmi dengan tata letak eksekutif dan transkrip terstruktur.
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs text-zinc-300">
            <span className="font-medium text-zinc-200">Tata Letak Laporan PDF</span>
            <p className="text-zinc-400 mt-1">
              A4 Portrait • Font Inter • Lampiran Action Items &amp; Timestamp Diarization.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportPdf(false)}>
              Batal
            </Button>
            <Button
              onClick={() => handleDownloadFile('PDF')}
              className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium"
            >
              Unduh Berkas PDF Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* S-21: EKSPOR TXT MODAL */}
      <Dialog open={showExportTxt} onOpenChange={setShowExportTxt}>
        <DialogContent onClose={() => setShowExportTxt(false)}>
          <DialogHeader>
            <DialogTitle>S-21: Ekspor Rangkuman ke TXT</DialogTitle>
            <DialogDescription>
              Format teks murni berukuran ringan, cocok untuk catatan pribadi atau dokumentasi Git.
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs text-zinc-400 font-mono text-[11px]">
            Ukuran estimasi: ~18 KB • Kompatibel dengan semua text editor
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportTxt(false)}>
              Batal
            </Button>
            <Button
              onClick={() => handleDownloadFile('TXT')}
              className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium"
            >
              Unduh Berkas TXT Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* S-23: RIWAYAT DOKUMEN MODAL */}
      <Dialog open={showDocHistory} onOpenChange={setShowDocHistory}>
        <DialogContent onClose={() => setShowDocHistory(false)}>
          <DialogHeader>
            <DialogTitle>S-23: Riwayat &amp; Audit Trail Dokumen</DialogTitle>
            <DialogDescription>
              Log aktivitas generate, perubahan status checklist, dan pengunduhan berkas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 my-3 text-xs max-h-56 overflow-y-auto">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex justify-between font-medium text-zinc-200">
                <span>Rangkuman Di-generate (Gemini)</span>
                <span className="text-[10px] text-zinc-500 font-mono">17 Okt, 15:30</span>
              </div>
              <p className="text-zinc-400 mt-0.5 text-[11px]">Versi 1.0 dibuat otomatis.</p>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex justify-between font-medium text-zinc-200">
                <span>Action Item Diselesaikan</span>
                <span className="text-[10px] text-zinc-500 font-mono">17 Okt, 16:10</span>
              </div>
              <p className="text-zinc-400 mt-0.5 text-[11px]">Siti Nurhaliza menandai tugas PCM ke WAV selesai.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocHistory(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Wireframe Reference */}
      <div className="pt-2 text-[10px] text-zinc-500 flex items-center justify-between border-t border-zinc-850">
        <span>JunAI • PRD V1.0.0 • Dokumen S-18 sampai S-23</span>
        <span className="font-mono">Ekspor PDF &amp; TXT</span>
      </div>
    </div>
  )
}
