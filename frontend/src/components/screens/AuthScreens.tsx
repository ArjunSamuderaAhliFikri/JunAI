import React, { useState } from 'react'
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  Command,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

type AuthMode = 'login' | 'register' | 'forgot' | 'reset' | 'verify'

interface AuthScreensProps {
  initialMode?: AuthMode
  onLoginSuccess: () => void
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  initialMode = 'login',
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('alexander@junai.enterprise.id')
  const [password, setPassword] = useState('••••••••••••')
  const [name, setName] = useState('Alexander Prasetyo')
  const [phone, setPhone] = useState('+62 812-3456-7890')
  const [notice, setNotice] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      onLoginSuccess()
    } else if (mode === 'register') {
      setMode('verify')
      setNotice('Akun berhasil didaftarkan dengan role awal Guest. Silakan lakukan verifikasi.')
    } else if (mode === 'forgot') {
      setNotice('Tautan reset password telah dikirimkan ke email Anda.')
      setTimeout(() => setMode('reset'), 1500)
    } else if (mode === 'reset') {
      setNotice('Password berhasil diubah. Silakan masuk kembali.')
      setTimeout(() => setMode('login'), 1500)
    } else if (mode === 'verify') {
      onLoginSuccess()
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4">
      {/* Top Brand */}
      <div className="mb-6 text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono mb-1">
          <Command className="h-3.5 w-3.5 text-zinc-100" />
          <span>JunAI Enterprise</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
          AI Meeting Assistant
        </h1>
        <p className="text-xs text-zinc-500 font-mono">
          Discord • Zoom • Google Meet (PRD V1.0.0)
        </p>
      </div>

      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900/60 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Notice alert */}
        {notice && (
          <div className="m-4 mb-0 p-3 rounded-md bg-zinc-850 border border-zinc-750 text-xs font-medium text-zinc-200 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* S-01: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">S-01: Masuk Akun</CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-zinc-800">Auth</Badge>
              </div>
              <CardDescription>
                Masukkan email atau username dan password Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Email Kerja</label>
                <Input
                  type="email"
                  icon={<Mail className="h-3.5 w-3.5" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-zinc-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 hover:underline"
                  >
                    Lupa password?
                  </button>
                </div>
                <Input
                  type="password"
                  icon={<Lock className="h-3.5 w-3.5" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-xs h-8 gap-1.5 shadow-xs"
              >
                Masuk ke Workspace <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-zinc-850 py-3 text-xs text-zinc-500">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-zinc-300 font-semibold ml-1 hover:underline cursor-pointer"
              >
                S-02 Daftar
              </button>
            </CardFooter>
          </form>
        )}

        {/* S-02: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">S-02: Registrasi Akun</CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-zinc-800">Role: Guest</Badge>
              </div>
              <CardDescription>
                Registrasi mandiri dimulai dari hak akses Guest sesuai PRD.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Nama Lengkap</label>
                <Input
                  icon={<User className="h-3.5 w-3.5" />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Email Kerja</label>
                <Input
                  type="email"
                  icon={<Mail className="h-3.5 w-3.5" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Nomor Telepon</label>
                <Input
                  icon={<Phone className="h-3.5 w-3.5" />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Password</label>
                <Input
                  type="password"
                  icon={<Lock className="h-3.5 w-3.5" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-xs h-8 shadow-xs"
              >
                Daftar Akun Baru
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-zinc-850 py-3 text-xs text-zinc-500">
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-zinc-300 font-semibold ml-1 hover:underline cursor-pointer"
              >
                Masuk
              </button>
            </CardFooter>
          </form>
        )}

        {/* S-03: FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">S-03: Lupa Password</CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-zinc-800">Reset</Badge>
              </div>
              <CardDescription>
                Masukkan email Anda untuk menerima instruksi tautan reset password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Email Terdaftar</label>
                <Input
                  type="email"
                  icon={<Mail className="h-3.5 w-3.5" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-xs h-8 shadow-xs"
              >
                Kirim Tautan Reset Password
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-zinc-850 py-3 text-xs">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-medium cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Login
              </button>
            </CardFooter>
          </form>
        )}

        {/* S-04: RESET PASSWORD */}
        {mode === 'reset' && (
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">S-04: Buat Password Baru</CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-zinc-800">Reset</Badge>
              </div>
              <CardDescription>
                Masukkan kata sandi baru untuk mengamankan akun Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Password Baru</label>
                <Input
                  type="password"
                  icon={<KeyRound className="h-3.5 w-3.5" />}
                  placeholder="Minimal 8 karakter..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Konfirmasi Password Baru</label>
                <Input
                  type="password"
                  icon={<KeyRound className="h-3.5 w-3.5" />}
                  placeholder="Ulangi password baru..."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-xs h-8 shadow-xs"
              >
                Simpan Password &amp; Masuk
              </Button>
            </CardContent>
          </form>
        )}

        {/* S-05: VERIFIKASI AKUN */}
        {mode === 'verify' && (
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">S-05: Verifikasi Akun</CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-zinc-800 text-amber-400">
                  Pending
                </Badge>
              </div>
              <CardDescription>
                Kode OTP verifikasi akun telah dikirimkan ke {email}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Masukkan 6-Digit OTP</label>
                <Input
                  placeholder="9 8 2 1 0 4"
                  className="text-center font-mono tracking-widest text-base font-semibold"
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-xs h-8 shadow-xs"
              >
                Verifikasi &amp; Masuk ke Workspace
              </Button>
            </CardContent>
          </form>
        )}
      </Card>
    </div>
  )
}
