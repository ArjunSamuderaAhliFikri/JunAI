import React, { useState, useEffect } from 'react'
import {
  Radio,
  Square,
  Pause,
  Play,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  FileText,
  RotateCcw,
  Sliders,
  Users,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/avatar-progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import type { MeetingPlatform } from '@/types'

interface MeetingRecorderScreenProps {
  onFinishAndOpenDoc: (docId: string) => void
  onRecordingStateChange?: (isRecording: boolean) => void
}

type RecorderStep =
  | 'choose_platform' // S-11
  | 'setup_recorder'   // S-12
  | 'recording_active' // S-13
  | 'audio_processing' // S-15
  | 'transcription'    // S-16
  | 'generate_ai'      // S-17

export const MeetingRecorderScreen: React.FC<MeetingRecorderScreenProps> = ({
  onFinishAndOpenDoc,
  onRecordingStateChange,
}) => {
  const [currentStep, setCurrentStep] = useState<RecorderStep>('choose_platform')
  const [selectedPlatform, setSelectedPlatform] = useState<MeetingPlatform>('Discord')
  const [meetingTitle, setMeetingTitle] = useState('Sprint Architecture Review & Roadmap')
  const [voiceChannel, setVoiceChannel] = useState('#engineering-voice')

  // Recording timer
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showStopConfirm, setShowStopConfirm] = useState(false) // S-14

  // Audio Processing states
  const [processingProgress, setProcessingProgress] = useState(0)
  const [aiGenProgress, setAiGenProgress] = useState(0)

  // Waveform bars simulation
  const [waveHeights, setWaveHeights] = useState<number[]>([15, 30, 45, 20, 60, 80, 40, 25, 55, 90, 70, 30, 45, 60, 20])

  useEffect(() => {
    let timer: any
    if (currentStep === 'recording_active' && !isPaused) {
      onRecordingStateChange?.(true)
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1)
        setWaveHeights(Array.from({ length: 24 }, () => Math.floor(Math.random() * 75) + 15))
      }, 500)
    } else {
      onRecordingStateChange?.(false)
    }
    return () => clearInterval(timer)
  }, [currentStep, isPaused, onRecordingStateChange])

  useEffect(() => {
    if (currentStep === 'audio_processing') {
      setProcessingProgress(20)
      const t1 = setTimeout(() => setProcessingProgress(50), 600)
      const t2 = setTimeout(() => setProcessingProgress(85), 1200)
      const t3 = setTimeout(() => {
        setProcessingProgress(100)
        setCurrentStep('transcription')
      }, 1800)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep === 'generate_ai') {
      setAiGenProgress(25)
      const t1 = setTimeout(() => setAiGenProgress(60), 700)
      const t2 = setTimeout(() => setAiGenProgress(90), 1400)
      const t3 = setTimeout(() => setAiGenProgress(100), 2000)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    }
  }, [currentStep])

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStopRecording = () => {
    setShowStopConfirm(false)
    setCurrentStep('audio_processing')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Stepper Progress Header */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
        <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 px-1 mb-2">
          <span>Platform (S-11)</span>
          <span>Setup (S-12)</span>
          <span>Live Recording (S-13)</span>
          <span>Audio PCM (S-15)</span>
          <span>Transkripsi (S-16)</span>
          <span>Gemini AI (S-17)</span>
        </div>
        <Progress
          value={
            currentStep === 'choose_platform'
              ? 16
              : currentStep === 'setup_recorder'
              ? 33
              : currentStep === 'recording_active'
              ? 50
              : currentStep === 'audio_processing'
              ? 66
              : currentStep === 'transcription'
              ? 83
              : 100
          }
          className="h-1 bg-zinc-850"
          indicatorClassName="bg-zinc-100"
        />
      </div>

      {/* S-11: PILIH PLATFORM MEETING */}
      {currentStep === 'choose_platform' && (
        <Card className="animate-in fade-in duration-150">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>S-11: Pilih Platform Meeting</CardTitle>
                <CardDescription>
                  Pilih platform meeting yang akan direkam dan diringkas oleh JunAI Bot.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-indigo-800 text-indigo-300">
                PRD Rekomendasi: Discord
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Discord Option */}
              <div
                onClick={() => setSelectedPlatform('Discord')}
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                  selectedPlatform === 'Discord'
                    ? 'border-zinc-500 bg-zinc-900 shadow-xs'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-7 w-7 rounded bg-zinc-850 text-indigo-300 flex items-center justify-center font-bold text-xs border border-zinc-750">
                    D
                  </div>
                  {selectedPlatform === 'Discord' && (
                    <CheckCircle2 className="h-4 w-4 text-zinc-100" />
                  )}
                </div>
                <h4 className="font-semibold text-zinc-100 text-sm">Discord</h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Latency audio terendah dengan stream multi-PCM independen per speaker.
                </p>
                <span className="mt-2 inline-block text-[10px] font-mono text-zinc-400">
                  ★ Rekomendasi Utama
                </span>
              </div>

              {/* Zoom Option */}
              <div
                onClick={() => setSelectedPlatform('Zoom')}
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                  selectedPlatform === 'Zoom'
                    ? 'border-zinc-500 bg-zinc-900 shadow-xs'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-7 w-7 rounded bg-zinc-850 text-blue-300 flex items-center justify-center font-bold text-xs border border-zinc-750">
                    Z
                  </div>
                  {selectedPlatform === 'Zoom' && (
                    <CheckCircle2 className="h-4 w-4 text-zinc-100" />
                  )}
                </div>
                <h4 className="font-semibold text-zinc-100 text-sm">Zoom</h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Integrasi via Zoom Meeting SDK &amp; Cloud Webhook untuk perekaman cloud.
                </p>
              </div>

              {/* Google Meet Option */}
              <div
                onClick={() => setSelectedPlatform('Google Meet')}
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                  selectedPlatform === 'Google Meet'
                    ? 'border-zinc-500 bg-zinc-900 shadow-xs'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-7 w-7 rounded bg-zinc-850 text-emerald-300 flex items-center justify-center font-bold text-xs border border-zinc-750">
                    G
                  </div>
                  {selectedPlatform === 'Google Meet' && (
                    <CheckCircle2 className="h-4 w-4 text-zinc-100" />
                  )}
                </div>
                <h4 className="font-semibold text-zinc-100 text-sm">Google Meet</h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Sinkronisasi Google Calendar &amp; bot perekam meeting browser headless.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-850">
              <Button
                onClick={() => setCurrentStep('setup_recorder')}
                className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-xs px-4"
              >
                Lanjutkan Setup Recorder <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* S-12: MULAI RECORDER SETUP */}
      {currentStep === 'setup_recorder' && (
        <Card className="animate-in fade-in duration-150">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>S-12: Konfigurasi &amp; Mulai Recorder</CardTitle>
                <CardDescription>
                  Siapkan detail meeting dan periksa konektivitas audio bot {selectedPlatform}.
                </CardDescription>
              </div>
              <Badge variant="outline">{selectedPlatform}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  Judul Sesi Meeting
                </label>
                <Input
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="Contoh: Sprint Planning Alpha"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  Target Voice Channel / Room
                </label>
                <Input
                  value={voiceChannel}
                  onChange={(e) => setVoiceChannel(e.target.value)}
                  placeholder="#room-name"
                />
              </div>
            </div>

            {/* Audio Check */}
            <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-200">
                    Audio Device &amp; Bot Standby
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Bot Ready
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Bot JunAI akan mendengarkan setiap kanal audio peserta secara paralel. Sesuai PRD, file audio PCM mentah akan disimpan sementara sebelum digabung menjadi format WAV stereo.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-850">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('choose_platform')}
              >
                Kembali
              </Button>
              <Button
                onClick={() => {
                  setSecondsElapsed(0)
                  setCurrentStep('recording_active')
                }}
                className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-xs px-4 gap-1.5 shadow-xs"
              >
                <Radio className="h-3.5 w-3.5 text-red-600" />
                Mulai Rekam Sekarang
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* S-13: RECORDER AKTIF */}
      {currentStep === 'recording_active' && (
        <Card className="border-zinc-800 bg-zinc-950 shadow-md animate-in fade-in duration-150">
          <CardHeader className="border-b border-zinc-850">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <CardTitle className="text-sm">
                    S-13: Recorder Aktif — {selectedPlatform}
                  </CardTitle>
                </div>
                <CardDescription className="mt-0.5 font-mono">
                  {meetingTitle} • {voiceChannel}
                </CardDescription>
              </div>

              {/* Large Timer in Font-Mono */}
              <div className="flex items-center gap-2.5">
                <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-lg font-semibold px-3 py-1 rounded tracking-wider">
                  {formatTimer(secondsElapsed)}
                </div>
                <Badge variant={isPaused ? 'warning' : 'destructive'} className="text-[10px] font-mono">
                  {isPaused ? 'PAUSED' : 'REC'}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 pt-5">
            {/* Live Audio Waveform Visualizer */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-5 text-zinc-100 text-center">
              <div className="text-[10px] text-zinc-500 font-mono tracking-wider mb-4 uppercase">
                Multi-Channel Audio Buffer (48,000 Hz / 16-bit WAV)
              </div>

              {/* Monochrome / Emerald Waveform */}
              <div className="flex items-center justify-center gap-1.5 h-20 px-2">
                {waveHeights.map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-zinc-300 transition-all duration-300"
                    style={{
                      height: isPaused ? '6px' : `${h}%`,
                      opacity: isPaused ? 0.2 : 0.85,
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 mt-4 text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3 w-3 text-zinc-400" />
                  <span>5 Partisipan Berbicara</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sliders className="h-3 w-3 text-emerald-400" />
                  <span>Noise Suppression Aktif</span>
                </div>
              </div>
            </div>

            {/* Speaking Participants Live Tracker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { name: 'Dimas Wicaksono', role: 'Admin / PM', active: true },
                { name: 'Siti Nurhaliza', role: 'Lead Eng', active: true },
                { name: 'Budi Santoso', role: 'Designer', active: false },
                { name: 'Reza Rahardian', role: 'Guest', active: false },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-md border text-xs transition-colors ${
                    p.active
                      ? 'border-zinc-700 bg-zinc-900'
                      : 'border-zinc-850 bg-zinc-950/60 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-200">{p.name}</span>
                    {p.active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{p.role}</span>
                </div>
              ))}
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-850 gap-2">
              <Button
                variant="outline"
                onClick={() => setIsPaused(!isPaused)}
                className="gap-1.5 text-xs h-8"
              >
                {isPaused ? (
                  <>
                    <Play className="h-3 w-3 text-emerald-400" /> Lanjutkan
                  </>
                ) : (
                  <>
                    <Pause className="h-3 w-3 text-amber-400" /> Jeda
                  </>
                )}
              </Button>

              {/* S-14 Trigger */}
              <Button
                onClick={() => setShowStopConfirm(true)}
                className="bg-red-950/80 hover:bg-red-900/90 text-red-200 border border-red-800/60 gap-1.5 font-medium text-xs h-8"
              >
                <Square className="h-3 w-3 fill-current" />
                Akhiri Rekaman &amp; Proses AI
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* S-14: KONFIRMASI AKHIRI REKAMAN MODAL */}
      <Dialog open={showStopConfirm} onOpenChange={setShowStopConfirm}>
        <DialogContent onClose={() => setShowStopConfirm(false)}>
          <DialogHeader>
            <DialogTitle>S-14: Konfirmasi Akhiri Rekaman?</DialogTitle>
            <DialogDescription>
              Sesi rekaman meeting akan dihentikan dan sistem akan segera memproses penggabungan audio multi-channel PCM ke satu file WAV stereo sebelum diringkas oleh Gemini AI.
            </DialogDescription>
          </DialogHeader>

          <div className="my-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-1">
            <div className="font-medium flex items-center gap-1.5 text-zinc-100">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              Durasi Rekaman: {formatTimer(secondsElapsed)}
            </div>
            <p className="text-zinc-400 text-[11px]">
              Setelah dikonfirmasi, audio processing tidak dapat dibatalkan.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStopConfirm(false)}
            >
              Lanjutkan Rekaman
            </Button>
            <Button
              onClick={handleStopRecording}
              className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium"
            >
              Hentikan &amp; Mulai Processing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* S-15: AUDIO PROCESSING PIPELINE */}
      {currentStep === 'audio_processing' && (
        <Card className="animate-in fade-in duration-150">
          <CardHeader>
            <CardTitle>S-15: Audio Processing</CardTitle>
            <CardDescription>
              Menggabungkan multiple file stream .pcm dari tiap partisipan menjadi satu file .wav berkualitas tinggi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-zinc-300">
                <span>Menggabungkan 5 file stream .pcm → output.wav</span>
                <span className="font-mono text-zinc-400">{processingProgress}%</span>
              </div>
              <Progress value={processingProgress} className="h-1 bg-zinc-850" indicatorClassName="bg-zinc-100" />
            </div>

            <div className="space-y-2 text-xs text-zinc-400 bg-zinc-900/60 p-3.5 rounded-lg border border-zinc-800 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>[PCM_READER] 5 streams parsed: buffer synchronized.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>[AUDIO_MERGER] Merging PCM buffers into 48kHz 16-bit WAV stereo.</span>
              </div>
              <div className="flex items-center gap-2">
                {processingProgress === 100 ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5 text-zinc-400 animate-spin" />
                )}
                <span>[WAV_FINALIZER] Normalizing loudness &amp; voice clarity EQ...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* S-16: TRANSKRIPSI HASIL AUDIO */}
      {currentStep === 'transcription' && (
        <Card className="animate-in fade-in duration-150">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>S-16: Transkripsi &amp; Hasil Audio</CardTitle>
                <CardDescription>
                  File audio .wav berhasil digabung. Transkripsi multi-speaker otomatis telah selesai dipetakan.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-emerald-800 text-emerald-400 font-mono">
                Audio Ready (WAV)
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2.5 max-h-52 overflow-y-auto">
              <div className="text-xs space-y-0.5">
                <div className="font-medium text-zinc-200 flex items-center justify-between">
                  <span>Dimas Wicaksono (PM)</span>
                  <span className="text-[10px] text-zinc-500 font-mono">00:00:15</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Baik rekan-rekan, kita mulai pembahasan arsitektur frontend JunAI menggunakan Shadcn UI...
                </p>
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-medium text-zinc-200 flex items-center justify-between">
                  <span>Siti Nurhaliza (Lead Eng)</span>
                  <span className="text-[10px] text-zinc-500 font-mono">00:01:05</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Untuk pipeline audio sudah diverifikasi, output WAV stereo bebas distorsi...
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setCurrentStep('generate_ai')}
                className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-xs gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate Rangkuman AI Gemini (S-17)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* S-17: GENERATE RANGKUMAN AI */}
      {currentStep === 'generate_ai' && (
        <Card className="animate-in fade-in duration-150">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-zinc-400" />
                  S-17: Generate Rangkuman AI (Gemini Flash)
                </CardTitle>
                <CardDescription>
                  Gemini merangkum hasil meeting: poin inti, keputusan utama, dan daftar action items.
                </CardDescription>
              </div>
              {aiGenProgress === 100 && (
                <Badge variant="outline" className="border-emerald-800 text-emerald-400">
                  Selesai
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-zinc-300">
                <span>
                  {aiGenProgress < 100
                    ? 'Gemini sedang menganalisis transkrip dan mengekstrak keputusan...'
                    : 'Rangkuman cerdas berhasil dibuat! Siap diekspor ke PDF dan TXT.'}
                </span>
                <span className="font-mono text-zinc-400">{aiGenProgress}%</span>
              </div>
              <Progress value={aiGenProgress} className="h-1 bg-zinc-850" indicatorClassName="bg-zinc-100" />
            </div>

            {aiGenProgress === 100 && (
              <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Dokumen Siap: &quot;Project Alpha Summary &amp; Architecture Decisions&quot;
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Rangkuman mencakup: Executive Summary, 4 Key Decisions, 4 Action Items dengan penanggung jawab dan tenggat waktu.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => onFinishAndOpenDoc('doc-01')}
                    className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-medium gap-1.5"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Buka Detail Rangkuman (S-19)
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Wireframe Reference */}
      <div className="pt-2 text-[10px] text-zinc-500 flex items-center justify-between border-t border-zinc-850">
        <span>JunAI • PRD V1.0.0 • Alur Recorder S-11 sampai S-17</span>
        <span className="font-mono">PCM to WAV • Gemini Summarizer</span>
      </div>
    </div>
  )
}
