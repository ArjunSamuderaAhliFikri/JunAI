import React from "react";
import {
  Calendar,
  FileText,
  Users,
  Video,
  ArrowUpRight,
  Clock,
  Radio,
  FileCheck,
  TrendingUp,
  Activity,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { mockMeetings, mockSchedules } from "@/data/mockData";
import type { UserRole } from "@/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DashboardScreenProps {
  onStartRecorder: () => void;
  onViewHistory: () => void;
  onViewDocument: (docId: string) => void;
  onViewSchedule: () => void;
  currentRole: UserRole;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onStartRecorder,
  onViewHistory,
  onViewDocument,
  onViewSchedule,
  currentRole,
}) => {
  const [activeTab, setActiveTab] = React.useState<"overview" | "activity">(
    "overview",
  );

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-16">
      {/* Clean Executive Welcome Bar (No AI Slop gradients) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              PRD V1.0.0
            </span>
            <span className="text-xs text-zinc-500">
              • Hak Akses: {currentRole}
            </span>
          </div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-100">
            JunAI Workspace
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Ringkasan meeting, dokumen kecerdasan buatan, jadwal kegiatan, dan
            kontributor terintegrasi langsung untuk Discord, Zoom, dan Google
            Meet.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={onStartRecorder}
            className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-xs h-8 px-3.5 shadow-xs"
          >
            <Radio className="h-3.5 w-3.5 text-red-600" />
            Mulai Recorder
          </Button>
          <Button
            onClick={onViewHistory}
            variant="outline"
            className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 text-xs h-8"
          >
            Lihat Riwayat
          </Button>
        </div>
      </div>

      {/* Tabs: S-06 (Overview) & S-07 (Aktivitas) */}
      <div className="flex items-center gap-1 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === "overview"
              ? "bg-zinc-900 text-zinc-100 font-semibold border border-zinc-800"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
          }`}
        >
          S-06 Dashboard Overview
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "activity"
              ? "bg-zinc-900 text-zinc-100 font-semibold border border-zinc-800"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          S-07 Dashboard Aktivitas Real-time
        </button>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* 4 Metric Cards matching wireframe S-06 in Shadcn style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Total Meeting
                </CardTitle>
                <div className="p-1.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                  <Video className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tracking-tight text-zinc-100">
                  24
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                  <span className="text-zinc-300 font-medium flex items-center text-[11px]">
                    <TrendingUp className="h-3 w-3 mr-0.5 text-emerald-400" />{" "}
                    +12%
                  </span>
                  <span>periode ini</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Dokumen AI
                </CardTitle>
                <div className="p-1.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                  <FileText className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tracking-tight text-zinc-100">
                  18
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                  <Badge
                    variant="outline"
                    className="text-[10px] h-4 py-0 px-1 border-zinc-800 text-zinc-400"
                  >
                    PDF &amp; TXT
                  </Badge>
                  <span>Gemini Flash</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Jadwal Mendatang
                </CardTitle>
                <div className="p-1.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                  <Calendar className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tracking-tight text-zinc-100">
                  4
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                  <Clock className="h-3 w-3 text-zinc-400" />
                  <span>Pengingat aktif</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Kontributor
                </CardTitle>
                <div className="p-1.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                  <Users className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tracking-tight text-zinc-100">
                  12
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                  <span>Partisipan terdaftar</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2 Main Panels matching Wireframe S-06 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left: Jadwal Mendatang */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Jadwal Mendatang</CardTitle>
                  <CardDescription>
                    Daftar rencana meeting dan sinkronisasi bot
                  </CardDescription>
                </div>
                <Button
                  onClick={onViewSchedule}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-zinc-400 hover:text-zinc-100 gap-1"
                >
                  Lihat Kalender <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul Kegiatan</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSchedules.slice(0, 3).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium text-xs text-zinc-200">
                            {item.title}
                          </div>
                          <span className="text-[11px] text-zinc-500">
                            {item.activityType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.platform === "Discord"
                                ? "discord"
                                : item.platform === "Zoom"
                                  ? "zoom"
                                  : "gmeet"
                            }
                            className="text-[10px]"
                          >
                            {item.platform}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-zinc-400 font-mono">
                          {new Date(item.dateTime).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          WIB
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={onStartRecorder}
                            size="sm"
                            variant="secondary"
                            className="text-[11px] h-7 px-2.5"
                          >
                            Siapkan
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Right: Meeting Terbaru & Dokumen AI */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Meeting Terbaru</CardTitle>
                  <CardDescription>
                    Hasil meeting terakhir &amp; rangkuman Gemini
                  </CardDescription>
                </div>
                <Button
                  onClick={onViewHistory}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-zinc-400 hover:text-zinc-100 gap-1"
                >
                  Semua Riwayat <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meeting</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Durasi</TableHead>
                      <TableHead className="text-right">Dokumen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMeetings.slice(0, 3).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium text-xs text-zinc-200 truncate max-w-[200px]">
                            {item.title}
                          </div>
                          <span className="text-[11px] text-zinc-500">
                            {item.date} • {item.organizer}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono border-zinc-800 text-zinc-400"
                          >
                            {item.summaryDocId === "doc-02"
                              ? "TXT"
                              : "PDF & TXT"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-zinc-400 font-mono">
                          {item.durationMinutes} mnt
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => {
                              if (item.summaryDocId)
                                onViewDocument(item.summaryDocId);
                            }}
                            size="sm"
                            variant="secondary"
                            className="text-[11px] h-7 px-2.5 text-zinc-200 font-medium"
                          >
                            Buka
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        /* S-07 Dashboard Aktivitas View */
        <Card>
          <CardHeader>
            <CardTitle>Timeline Aktivitas Sistem Real-Time</CardTitle>
            <CardDescription>
              Catatan pemrosesan rekaman audio, penggabungan PCM ke WAV, dan
              transkrip AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
              <div className="relative flex items-start gap-3">
                <div className="absolute -left-6 mt-1 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-200">
                      Gemini Rangkuman Berhasil Dibuat
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      10m ago
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Dokumen &quot;Project Alpha Summary &amp; Architecture
                    Decisions&quot; siap diunduh dalam format PDF dan TXT.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <div className="absolute -left-6 mt-1 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sky-400">
                  <FileCheck className="w-3 h-3" />
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-200">
                      Audio Processing Berhasil
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      25m ago
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    8 stream audio .pcm selesai digabungkan menjadi file stereo
                    .wav 16-bit 48kHz tanpa latency drift.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <div className="absolute -left-6 mt-1 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400">
                  <Radio className="w-3 h-3" />
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-200">
                      Sesi Rekaman Discord Selesai
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      40m ago
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Meeting #core-architecture dengan 8 partisipan selesai
                    direkam secara otomatis oleh JunAI Bot.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wireframe Reference Tag */}
      <div className="pt-2 text-[10px] text-zinc-500 flex items-center justify-between border-t border-zinc-850">
        <span>JunAI • PRD V1.0.0 • Wireframe S-06 &amp; S-07</span>
        <span className="font-mono">Shadcn Dark Theme (bg-zinc-950)</span>
      </div>
    </div>
  );
};
