import React, { useState } from 'react'
import {
  Sliders,
  Bell,
  Cpu,
  Radio,
  Save,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const SettingsScreen: React.FC = () => {
  const [defaultPlatform, setDefaultPlatform] = useState('Discord')
  const [modelTemp, setModelTemp] = useState('0.4')
  const [discordWebhook, setDiscordWebhook] = useState('https://discord.com/api/webhooks/12345/abcde-staging')
  const [autoMergePcm, setAutoMergePcm] = useState(true)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-20">
      {savedSuccess && (
        <div className="p-3 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Pengaturan JunAI Workspace berhasil diperbarui.</span>
          </div>
          <button onClick={() => setSavedSuccess(false)} className="text-zinc-500 hover:text-zinc-300">
            Tutup
          </button>
        </div>
      )}

      {/* S-10: PENGATURAN UMUM & AUDIO */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-zinc-400" />
            <CardTitle>S-10: Pengaturan Sistem &amp; AI</CardTitle>
          </div>
          <CardDescription>
            Konfigurasi platform rapat default, webhook bot, dan parameter model Gemini.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Default Platform Setting */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Platform Meeting Default
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {['Discord', 'Zoom', 'Google Meet'].map((p) => (
                <button
                  key={p}
                  onClick={() => setDefaultPlatform(p)}
                  className={`p-2.5 rounded-md border text-xs font-medium transition-colors cursor-pointer text-center ${
                    defaultPlatform === p
                      ? 'border-zinc-500 bg-zinc-900 text-zinc-100 shadow-xs'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {p} {p === 'Discord' && '(Rekomendasi)'}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Pipeline Preferences */}
          <div className="space-y-2 pt-3 border-t border-zinc-850">
            <h4 className="text-xs font-medium text-zinc-300 flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-zinc-400" />
              Pipeline Audio Processing (.PCM ke .WAV)
            </h4>
            <div className="flex items-center justify-between p-3 rounded-md bg-zinc-900/60 border border-zinc-800 text-xs">
              <div>
                <span className="font-medium text-zinc-200">
                  Otomatis gabung stream PCM ke satu WAV stereo setelah rekaman berakhir
                </span>
                <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
                  Menjaga sinkronisasi audio clock setiap pembicara (16-bit 48kHz).
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoMergePcm}
                onChange={(e) => setAutoMergePcm(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-zinc-100 cursor-pointer"
              />
            </div>
          </div>

          {/* AI Model Parameters */}
          <div className="space-y-3 pt-3 border-t border-zinc-850">
            <h4 className="text-xs font-medium text-zinc-300 flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-zinc-400" />
              Model AI Summarizer (Gemini Flash)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-400">Model Engine</label>
                <Input value="Gemini 1.5 Flash (Google DeepMind)" readOnly className="bg-zinc-900/40 text-zinc-400 font-mono text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-zinc-400">Temperature</label>
                <Input
                  value={modelTemp}
                  onChange={(e) => setModelTemp(e.target.value)}
                  placeholder="0.2 - 0.7"
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          {/* Webhook Settings */}
          <div className="space-y-2 pt-3 border-t border-zinc-850">
            <h4 className="text-xs font-medium text-zinc-300 flex items-center gap-2">
              <Bell className="h-3.5 w-3.5 text-zinc-400" />
              Discord Webhook Reminder
            </h4>
            <div className="space-y-1 text-xs">
              <label className="font-medium text-zinc-400">Webhook URL</label>
              <Input
                value={discordWebhook}
                onChange={(e) => setDiscordWebhook(e.target.value)}
                className="font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-850 flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-xs gap-1.5 shadow-xs"
            >
              <Save className="h-3.5 w-3.5" /> Simpan Pengaturan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
