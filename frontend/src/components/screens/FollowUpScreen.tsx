import React, { useState } from 'react'
import {
  CheckSquare,
  Send,
  Clock,
  User as UserIcon,
  CheckCircle2,
  Bot,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { mockFollowUps, mockChatMessages } from '@/data/mockData'
import type { FollowUpTask, ChatReminderMessage } from '@/types'

export const FollowUpScreen: React.FC = () => {
  const [tasks, setTasks] = useState<FollowUpTask[]>(mockFollowUps)
  const [selectedTask, setSelectedTask] = useState<FollowUpTask | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatReminderMessage[]>(mockChatMessages)
  const [inputMessage, setInputMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'tasks' | 'chat'>('tasks')

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, done: !st.done } : st
          )
          const allDone = updatedSubtasks.every((st) => st.done)
          const newStatus = allDone ? 'Done' : 'In Progress'
          return { ...t, subtasks: updatedSubtasks, status: newStatus }
        }
        return t
      })
    )

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => {
        if (!prev) return null
        const updatedSubtasks = prev.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, done: !st.done } : st
        )
        const allDone = updatedSubtasks.every((st) => st.done)
        return { ...prev, subtasks: updatedSubtasks, status: allDone ? 'Done' : 'In Progress' }
      })
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMsg: ChatReminderMessage = {
      id: `msg-${Date.now()}`,
      sender: 'User',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }

    setChatMessages((prev) => [...prev, userMsg])
    const promptText = inputMessage
    setInputMessage('')

    setTimeout(() => {
      const botReply: ChatReminderMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'JunAI Bot',
        text: `Terima kasih! Reminder terkait "${promptText}" telah disinkronkan ke server Discord & kalender JunAI. Notifikasi otomatis akan dikirim 15 menit sebelum waktu target.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isActionable: true,
        actionText: 'Lihat di Jadwal',
      }
      setChatMessages((prev) => [...prev, botReply])
    }, 800)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-20">
      {/* Tab Switcher: S-42 vs S-44 */}
      <div className="flex items-center gap-1 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'tasks'
              ? 'bg-zinc-900 text-zinc-100 font-semibold border border-zinc-800'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
          }`}
        >
          <CheckSquare className="h-3.5 w-3.5" />
          S-42 Daftar Follow-up &amp; Tindak Lanjut
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'chat'
              ? 'bg-zinc-900 text-zinc-100 font-semibold border border-zinc-800'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
          }`}
        >
          <Bot className="h-3.5 w-3.5" />
          S-44 &amp; S-45 Chat Reminder Bot
        </button>
      </div>

      {activeTab === 'tasks' ? (
        /* S-42: DAFTAR FOLLOW-UP */
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(['To Do', 'In Progress', 'Done'] as const).map((colStatus) => {
              const colTasks = tasks.filter((t) => t.status === colStatus)
              return (
                <div key={colStatus} className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-850">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                      {colStatus}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono border-zinc-800">
                      {colTasks.length}
                    </Badge>
                  </div>

                  <div className="space-y-2.5">
                    {colTasks.map((task) => (
                      <Card
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="p-3.5 hover:border-zinc-700 transition-colors cursor-pointer shadow-xs space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              task.priority === 'High'
                                ? 'destructive'
                                : task.priority === 'Medium'
                                ? 'warning'
                                : 'secondary'
                            }
                            className="text-[9px] px-1.5 py-0"
                          >
                            {task.priority}
                          </Badge>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {task.subtasks.filter((st) => st.done).length}/{task.subtasks.length} Subtasks
                          </span>
                        </div>

                        <h4 className="text-xs font-medium text-zinc-200 group-hover:text-zinc-50 transition-colors leading-snug">
                          {task.title}
                        </h4>

                        <p className="text-[11px] text-zinc-500 truncate font-mono">
                          Meeting: {task.meetingTitle}
                        </p>

                        <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                          <span className="flex items-center gap-1">
                            <UserIcon className="h-3 w-3" /> {task.assignee}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {task.dueDate}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* S-44 & S-45: CHAT REMINDER BOT VIEW */
        <Card className="max-w-2xl mx-auto shadow-md animate-in fade-in duration-150">
          <CardHeader className="border-b border-zinc-850 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center justify-center font-bold">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-xs">JunAI Discord Reminder Assistant</CardTitle>
                  <CardDescription>
                    Pesan dan instruksi pengingat meeting interaktif
                  </CardDescription>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Bot Online
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-3">
            {/* Chat Messages Log */}
            <div className="h-80 overflow-y-auto space-y-2.5 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
              {chatMessages.map((msg) => {
                const isBot = msg.sender === 'JunAI Bot'
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${isBot ? '' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`h-6 w-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        isBot
                          ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                          : 'bg-zinc-200 text-zinc-950 font-semibold'
                      }`}
                    >
                      {isBot ? 'J' : 'U'}
                    </div>
                    <div
                      className={`max-w-md p-2.5 rounded-lg text-xs space-y-1 ${
                        isBot
                          ? 'bg-zinc-900 text-zinc-200 border border-zinc-800'
                          : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] text-zinc-500 font-mono">
                        <span className="font-semibold text-zinc-400">{msg.sender}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed text-[11px] text-zinc-300">{msg.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Tulis pesan atau instruksi reminder... (misal: 'Ingatkan saya meeting sprint besok')"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage()
                }}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 shrink-0 font-medium h-8 px-3"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* S-43: DETAIL FOLLOW-UP MODAL */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent onClose={() => setSelectedTask(null)}>
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono">{selectedTask.status}</Badge>
                  <span className="text-xs text-zinc-500 font-mono">Tenggat: {selectedTask.dueDate}</span>
                </div>
                <DialogTitle className="text-sm mt-2">{selectedTask.title}</DialogTitle>
                <DialogDescription className="font-mono">
                  Meeting: {selectedTask.meetingTitle} • PIC: {selectedTask.assignee}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2.5 my-2 text-xs">
                <h5 className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px] font-mono">
                  Subtask Checklist
                </h5>
                <div className="space-y-1.5">
                  {selectedTask.subtasks.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => handleToggleSubtask(selectedTask.id, st.id)}
                      className="flex items-center gap-2 p-2 rounded-md border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 cursor-pointer"
                    >
                      <div
                        className={`h-3.5 w-3.5 rounded flex items-center justify-center border transition-colors ${
                          st.done
                            ? 'bg-zinc-200 border-zinc-200 text-zinc-950'
                            : 'border-zinc-700 bg-zinc-900'
                        }`}
                      >
                        {st.done && <CheckCircle2 className="h-3 w-3" />}
                      </div>
                      <span className={st.done ? 'line-through text-zinc-500 text-[11px]' : 'text-zinc-300 text-[11px]'}>
                        {st.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedTask(null)}>
                  Tutup
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Wireframe Reference */}
      <div className="pt-2 text-[10px] text-zinc-500 flex items-center justify-between border-t border-zinc-850">
        <span>JunAI • PRD V1.0.0 • Follow-up S-42 sampai S-46</span>
        <span className="font-mono">Discord Reminder Bot Integration</span>
      </div>
    </div>
  )
}
