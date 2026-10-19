import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Bell,
  Users,
  ChevronLeft,
  ChevronRight,
  Sliders,
  History,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { mockSchedules } from '@/data/mockData'
import type { ScheduleItem, MeetingPlatform, ReminderType, UserRole } from '@/types'

interface ScheduleScreenProps {
  currentRole: UserRole
  onStartRecorder: () => void
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  currentRole,
  onStartRecorder,
}) => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(mockSchedules)
  const [selectedDate, setSelectedDate] = useState<number>(19)

  // Modals (S-30, S-33, S-34)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showReminderSettings, setShowReminderSettings] = useState(false)
  const [showReminderHistory, setShowReminderHistory] = useState(false)

  // Form State for S-30
  const [newTitle, setNewTitle] = useState('')
  const [newPlatform, setNewPlatform] = useState<MeetingPlatform>('Discord')
  const [newActivityType] = useState<ScheduleItem['activityType']>('Weekly Sync')
  const [newReminderType, setNewReminderType] = useState<ReminderType>('Kickoff')
  const [newOffset, setNewOffset] = useState('10 Menit Sebelumnya')

  const canCreateSchedule =
    currentRole === 'Super Admin' || currentRole === 'Admin / Project Manager'

  const handleCreateSchedule = () => {
    if (!newTitle.trim()) return

    const newSch: ScheduleItem = {
      id: `sch-${Date.now()}`,
      title: newTitle,
      platform: newPlatform,
      dateTime: `2026-10-${selectedDate.toString().padStart(2, '0')}T14:00:00`,
      activityType: newActivityType,
      participants: ['Dimas W', 'Budi S'],
      reminderOffset: newOffset,
      reminderType: newReminderType,
      status: 'Upcoming',
    }

    setSchedules([newSch, ...schedules])
    setShowCreateModal(false)
    setNewTitle('')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-20">
      {/* S-29: Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">
            S-29: Kalender Jadwal &amp; Smart Reminder
          </h2>
          <p className="text-xs text-zinc-400">
            Jadwal kegiatan rapat dan konfigurasi pengingat bot otomatis di Discord / Zoom / Meet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowReminderHistory(true)}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
          >
            <History className="h-3.5 w-3.5 text-zinc-400" /> S-34 Riwayat
          </Button>
          <Button
            onClick={() => setShowReminderSettings(true)}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
          >
            <Sliders className="h-3.5 w-3.5 text-zinc-400" /> S-33 Pengaturan
          </Button>
          {canCreateSchedule ? (
            <Button
              onClick={() => setShowCreateModal(true)}
              size="sm"
              className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-medium gap-1.5 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" /> S-30 Buat Jadwal
            </Button>
          ) : (
            <div title="Role Guest / Employee tidak diizinkan membuat jadwal baru sesuai aturan PRD">
              <Button
                disabled
                size="sm"
                variant="outline"
                className="text-xs opacity-50 cursor-not-allowed"
              >
                Buat Jadwal (Role Terbatas)
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Interactive Calendar Grid */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-850">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-zinc-400" />
                <CardTitle className="text-sm">Oktober 2026</CardTitle>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <button className="p-1 rounded hover:bg-zinc-900 cursor-pointer">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs font-medium text-zinc-300 px-1 font-mono">Bulan Ini</span>
                <button className="p-1 rounded hover:bg-zinc-900 cursor-pointer">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              {/* Day Headers */}
              <div className="grid grid-cols-7 text-center text-[11px] font-medium text-zinc-500 mb-2 font-mono">
                <span>Sen</span>
                <span>Sel</span>
                <span>Rab</span>
                <span>Kam</span>
                <span>Jum</span>
                <span>Sab</span>
                <span>Min</span>
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const isSelected = selectedDate === day
                  const hasEvents = day === 19 || day === 20 || day === 21
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(day)}
                      className={`h-12 p-1.5 rounded-md border text-left transition-colors flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-zinc-500 bg-zinc-900 shadow-xs'
                          : 'border-zinc-850/80 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900/40'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-xs font-mono ${
                            isSelected ? 'text-zinc-50 font-bold' : 'text-zinc-400'
                          }`}
                        >
                          {day}
                        </span>
                        {hasEvents && (
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        )}
                      </div>
                      {hasEvents && (
                        <span className="text-[9px] text-zinc-400 truncate font-mono">
                          {day === 19 ? '2 Meetings' : '1 Meeting'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: S-31 Detail Jadwal Hari Ini */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-zinc-850">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs uppercase tracking-wider text-zinc-400">
                  Agenda Tanggal {selectedDate} Okt
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {schedules.length} Kegiatan
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-3">
              {schedules.map((sch) => (
                <div
                  key={sch.id}
                  className="p-3 rounded-md border border-zinc-850 bg-zinc-900/40 hover:border-zinc-750 transition-colors space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        sch.platform === 'Discord'
                          ? 'discord'
                          : sch.platform === 'Zoom'
                          ? 'zoom'
                          : 'gmeet'
                      }
                      className="text-[9px]"
                    >
                      {sch.platform}
                    </Badge>
                    <span className="text-[9px] font-mono text-zinc-400">
                      {sch.reminderType}
                    </span>
                  </div>

                  <h4 className="text-xs font-medium text-zinc-200">
                    {sch.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-0.5 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(sch.dateTime).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })} WIB
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {sch.participants.length}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Bell className="h-3 w-3 text-zinc-400" /> {sch.reminderOffset}
                    </span>
                    <Button
                      onClick={onStartRecorder}
                      size="sm"
                      variant="secondary"
                      className="text-[10px] h-6 px-2 font-medium"
                    >
                      Mulai
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* S-30: BUAT JADWAL MODAL */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent onClose={() => setShowCreateModal(false)}>
          <DialogHeader>
            <DialogTitle>S-30: Buat Jadwal Meeting Baru</DialogTitle>
            <DialogDescription>
              Atur judul rapat, platform, waktu, dan jenis reminder otomatis bot.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 my-2 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-zinc-300">Judul Kegiatan</label>
              <Input
                placeholder="Contoh: Sprint Retro &amp; Architecture Sync"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Platform Meeting</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as MeetingPlatform)}
                  className="w-full h-8 rounded-md border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-200 focus:outline-none"
                >
                  <option value="Discord">Discord (Rekomendasi)</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Google Meet">Google Meet</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Jenis Reminder</label>
                <select
                  value={newReminderType}
                  onChange={(e) => setNewReminderType(e.target.value as ReminderType)}
                  className="w-full h-8 rounded-md border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-200 focus:outline-none"
                >
                  <option value="Kickoff">Kickoff</option>
                  <option value="Deadline">Deadline</option>
                  <option value="Follow_Up">Follow_Up</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-zinc-300">Offset Pengingat</label>
              <Input
                value={newOffset}
                onChange={(e) => setNewOffset(e.target.value)}
                placeholder="Contoh: 10 Menit Sebelumnya"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Batal
            </Button>
            <Button
              onClick={handleCreateSchedule}
              className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium"
            >
              Simpan Jadwal Rapat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* S-33: PENGATURAN REMINDER MODAL */}
      <Dialog open={showReminderSettings} onOpenChange={setShowReminderSettings}>
        <DialogContent onClose={() => setShowReminderSettings(false)}>
          <DialogHeader>
            <DialogTitle>S-33: Pengaturan Reminder Bot</DialogTitle>
            <DialogDescription>
              Konfigurasi saluran pengiriman reminder untuk kegiatan kickoff dan deadline.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 my-2 text-xs">
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-200">Discord Bot Ping Mention</span>
                <span className="text-emerald-400 font-mono text-[11px]">Aktif</span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Bot akan mem-mention role @everyone atau peserta di channel text terkait sebelum meeting dimulai.
              </p>
            </div>

            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-200">Email Digest Pengingat</span>
                <span className="text-emerald-400 font-mono text-[11px]">Aktif</span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Ringkasan agenda harian dikirimkan setiap pukul 08:00 WIB.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReminderSettings(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* S-34: RIWAYAT REMINDER MODAL */}
      <Dialog open={showReminderHistory} onOpenChange={setShowReminderHistory}>
        <DialogContent onClose={() => setShowReminderHistory(false)}>
          <DialogHeader>
            <DialogTitle>S-34: Riwayat Pengiriman Reminder</DialogTitle>
            <DialogDescription>
              Catatan pesan pengingat yang berhasil didistribusikan ke peserta.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 my-2 text-xs max-h-56 overflow-y-auto">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex justify-between font-medium text-zinc-200">
                <span>Kickoff Reminder: Daily Standup Sync</span>
                <span className="text-[10px] text-zinc-500 font-mono">08:50 WIB</span>
              </div>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Terkirim via Discord ke 6 partisipan.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex justify-between font-medium text-zinc-200">
                <span>Deadline Reminder: Project Alpha Sprint Review</span>
                <span className="text-[10px] text-zinc-500 font-mono">Kemarin, 13:45 WIB</span>
              </div>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Terkirim via Discord &amp; In-App Notification.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReminderHistory(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Wireframe Reference */}
      <div className="pt-2 text-[10px] text-zinc-500 flex items-center justify-between border-t border-zinc-850">
        <span>JunAI • PRD V1.0.0 • Kalender S-29 sampai S-34</span>
        <span className="font-mono">Smart Reminder Sync</span>
      </div>
    </div>
  )
}
