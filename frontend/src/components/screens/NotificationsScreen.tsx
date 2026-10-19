import React, { useState } from 'react'
import {
  Radio,
  FileCheck,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { mockNotifications } from '@/data/mockData'
import type { NotificationItem } from '@/types'

interface NotificationsScreenProps {
  onViewDoc?: (docId: string) => void
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onViewDoc,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications)
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null)

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-20">
      {/* S-08: NOTIFIKASI */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>S-08: Notifikasi &amp; Peringatan</CardTitle>
              <CardDescription>
                Pemberitahuan meeting reminder, meeting started, dan meeting ended.
              </CardDescription>
            </div>
            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Tandai Semua Dibaca
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markAsRead(n.id)
                setSelectedNotif(n)
              }}
              className={`p-3.5 rounded-lg border transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                n.read
                  ? 'bg-zinc-950/60 border-zinc-850'
                  : 'bg-zinc-900 border-zinc-700 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1.5 rounded-md bg-zinc-800 text-zinc-300">
                  {n.type === 'Meeting Started' && <Radio className="h-3.5 w-3.5 text-red-400" />}
                  {n.type === 'Meeting Ended' && <FileCheck className="h-3.5 w-3.5 text-emerald-400" />}
                  {n.type === 'Meeting Reminder' && <Clock className="h-3.5 w-3.5 text-zinc-300" />}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-medium text-zinc-200">{n.title}</h4>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-100" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed max-w-lg">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {n.timestamp}
                  </span>
                </div>
              </div>

              <Badge variant="outline" className="text-[10px] shrink-0 font-mono border-zinc-800">
                {n.type}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* S-46: DETAIL NOTIFIKASI MODAL */}
      <Dialog open={!!selectedNotif} onOpenChange={(open) => !open && setSelectedNotif(null)}>
        <DialogContent onClose={() => setSelectedNotif(null)}>
          {selectedNotif && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[10px]">{selectedNotif.type}</Badge>
                  <span className="text-xs text-zinc-500 font-mono">{selectedNotif.timestamp}</span>
                </div>
                <DialogTitle className="text-sm mt-2">{selectedNotif.title}</DialogTitle>
                <DialogDescription>Informasi notifikasi sistem</DialogDescription>
              </DialogHeader>

              <div className="my-2 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                {selectedNotif.message}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedNotif(null)}>
                  Tutup
                </Button>
                {selectedNotif.meetingId && (
                  <Button
                    onClick={() => {
                      setSelectedNotif(null)
                      onViewDoc?.('doc-01')
                    }}
                    className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-xs gap-1.5"
                  >
                    Buka Dokumen Rapat <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
