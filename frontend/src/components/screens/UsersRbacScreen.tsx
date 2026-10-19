import React, { useState } from 'react'
import {
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  KeyRound,
  Trash2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { mockUsers } from '@/data/mockData'
import type { User, UserRole, AccountStatus } from '@/types'

interface UsersRbacScreenProps {
  currentRole: UserRole
}

export const UsersRbacScreen: React.FC<UsersRbacScreenProps> = ({ currentRole }) => {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState('')

  // Modals (S-37, S-39, S-41)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false)
  const [targetUserForRole, setTargetUserForRole] = useState<User | null>(null)
  const [newSelectedRole, setNewSelectedRole] = useState<UserRole>('Employee')
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false)
  const [accessDeniedReason, setAccessDeniedReason] = useState('')

  // New User Form State
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newRole, setNewRole] = useState<UserRole>('Guest')

  const visibleUsers = users.filter((u) => {
    if (currentRole === 'Employee' && u.role === 'Super Admin') {
      return false
    }
    if (currentRole === 'Super Guest' && u.role === 'Guest') {
      return false
    }
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const canAddUser = currentRole === 'Super Admin' || currentRole === 'Admin / Project Manager'
  const canChangeRoles = currentRole === 'Super Admin'
  const canDeleteUser = currentRole === 'Super Admin'

  const handleOpenAddUser = () => {
    if (!canAddUser) {
      setAccessDeniedReason('Hanya Super Admin atau Admin / Project Manager yang dapat menambahkan pengguna baru ke sistem.')
      setShowAccessDeniedModal(true)
      return
    }
    setShowAddUserModal(true)
  }

  const handleOpenChangeRole = (user: User) => {
    if (!canChangeRoles) {
      setAccessDeniedReason('Sesuai PRD V1.0, hanya Super Admin yang memiliki otoritas untuk mengubah role pengguna lain.')
      setShowAccessDeniedModal(true)
      return
    }
    setTargetUserForRole(user)
    setNewSelectedRole(user.role)
    setShowChangeRoleModal(true)
  }

  const handleDeleteUser = (userId: string) => {
    if (!canDeleteUser) {
      setAccessDeniedReason('Hanya Super Admin yang diizinkan untuk menghapus akun pengguna.')
      setShowAccessDeniedModal(true)
      return
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  const handleSaveNewUser = () => {
    if (!newName.trim() || !newEmail.trim()) return

    const newUserObj: User = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone || '+62 812-0000-0000',
      role: newRole,
      status: 'Active',
      isVerified: true,
      joinedDate: 'Hari Ini',
      department: 'General Staff',
    }

    setUsers([newUserObj, ...users])
    setShowAddUserModal(false)
    setNewName('')
    setNewEmail('')
    setNewPhone('')
  }

  const handleConfirmChangeRole = () => {
    if (!targetUserForRole) return
    setUsers((prev) =>
      prev.map((u) =>
        u.id === targetUserForRole.id ? { ...u, role: newSelectedRole } : u
      )
    )
    setShowChangeRoleModal(false)
    setTargetUserForRole(null)
  }

  const toggleAccountStatus = (userId: string) => {
    if (currentRole !== 'Super Admin' && currentRole !== 'Admin / Project Manager') {
      setAccessDeniedReason('Hanya Super Admin atau Admin yang berhak mengubah status akun pengguna.')
      setShowAccessDeniedModal(true)
      return
    }
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus: AccountStatus =
            u.status === 'Active' ? 'Suspended' : 'Active'
          return { ...u, status: nextStatus }
        }
        return u
      })
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-20">
      {/* RBAC Banner indicator */}
      <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-zinc-300" />
          <span className="text-zinc-300">
            Mode Otorisasi: <strong className="text-zinc-100">{currentRole}</strong>
          </span>
        </div>
        <div className="text-zinc-500 font-mono text-[11px]">
          {currentRole === 'Employee' && (
            <span>PRD: Akun Super Admin disembunyikan dari Employee</span>
          )}
          {currentRole === 'Guest' && (
            <span>PRD: Read-only access</span>
          )}
          {currentRole === 'Super Admin' && (
            <span>Full RBAC Control</span>
          )}
        </div>
      </div>

      {/* S-35: DAFTAR PENGGUNA */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle>S-35: Manajemen Pengguna &amp; RBAC</CardTitle>
              <CardDescription>
                Daftar anggota tim, role hierarki, dan status verifikasi akun.
              </CardDescription>
            </div>

            <Button
              onClick={handleOpenAddUser}
              size="sm"
              className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-medium gap-1.5 shadow-xs"
            >
              <UserPlus className="h-3.5 w-3.5" /> S-37 Tambah Pengguna
            </Button>
          </div>

          <div className="pt-2">
            <Input
              icon={<Search className="h-3.5 w-3.5" />}
              placeholder="Cari pengguna berdasarkan nama, email, atau divisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pengguna</TableHead>
                <TableHead>Role Hak Akses</TableHead>
                <TableHead>Status (S-40)</TableHead>
                <TableHead>Verifikasi (S-05)</TableHead>
                <TableHead className="text-right">Aksi RBAC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="font-medium text-xs text-zinc-200">
                      {u.name}
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {u.email} • {u.department || 'Staff'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono border-zinc-800 text-zinc-300">
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleAccountStatus(u.id)}
                      className="cursor-pointer"
                      title="Klik untuk ubah status (Super Admin / Admin)"
                    >
                      <Badge
                        variant={
                          u.status === 'Active'
                            ? 'success'
                            : u.status === 'Suspended'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-[10px] font-mono"
                      >
                        {u.status === 'Active' && <CheckCircle2 className="h-2.5 w-2.5 mr-1" />}
                        {u.status === 'Suspended' && <XCircle className="h-2.5 w-2.5 mr-1" />}
                        {u.status}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell>
                    {u.isVerified ? (
                      <span className="text-emerald-400 text-xs flex items-center gap-1 font-mono">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-amber-400 text-xs flex items-center gap-1 font-mono">
                        <AlertCircle className="h-3 w-3" /> Pending
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        onClick={() => handleOpenChangeRole(u)}
                        size="sm"
                        variant="secondary"
                        className="text-[10px] h-6 px-2 font-medium"
                        title="S-39 Ubah Role"
                      >
                        <KeyRound className="h-3 w-3 mr-1" /> Ubah Role
                      </Button>
                      {canDeleteUser && u.role !== 'Super Admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-900"
                          title="Hapus Akun (Super Admin)"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* S-37: TAMBAH PENGGUNA MODAL */}
      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent onClose={() => setShowAddUserModal(false)}>
          <DialogHeader>
            <DialogTitle>S-37: Tambah Pengguna Baru</DialogTitle>
            <DialogDescription>
              Undang anggota atau partner ke JunAI Workspace sesuai batasan kewenangan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-zinc-300">Nama Lengkap</label>
              <Input
                placeholder="Contoh: Dimas Pratama"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-zinc-300">Email Kerja</label>
              <Input
                placeholder="email@perusahaan.com"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-zinc-300">Nomor Telepon</label>
              <Input
                placeholder="+62 812-xxxx-xxxx"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-zinc-300">Role Awal</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full h-8 rounded-md border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="Guest">Guest (Default Register)</option>
                <option value="Super Guest">Super Guest (30-day Trial)</option>
                <option value="Employee">Employee</option>
                {currentRole === 'Super Admin' && (
                  <option value="Admin / Project Manager">Admin / Project Manager</option>
                )}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserModal(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSaveNewUser}
              className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium"
            >
              Unduh / Tambah Pengguna
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* S-39: UBAH ROLE MODAL */}
      <Dialog open={showChangeRoleModal} onOpenChange={setShowChangeRoleModal}>
        <DialogContent onClose={() => setShowChangeRoleModal(false)}>
          <DialogHeader>
            <DialogTitle>S-39: Ubah Role &amp; Otorisasi Pengguna</DialogTitle>
            <DialogDescription>
              Ubah hak akses {targetUserForRole?.name} sesuai matriks RBAC JunAI.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2 text-xs">
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-300">
              <span className="font-medium text-zinc-200">
                Pengguna: {targetUserForRole?.name} ({targetUserForRole?.email})
              </span>
              <p className="text-zinc-500 mt-0.5 font-mono text-[11px]">Role saat ini: {targetUserForRole?.role}</p>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-zinc-300">Pilih Role Baru</label>
              <select
                value={newSelectedRole}
                onChange={(e) => setNewSelectedRole(e.target.value as UserRole)}
                className="w-full h-8 rounded-md border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Admin / Project Manager">Admin / Project Manager</option>
                <option value="Employee">Employee</option>
                <option value="Guest">Guest</option>
                <option value="Super Guest">Super Guest</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangeRoleModal(false)}>
              Batal
            </Button>
            <Button
              onClick={handleConfirmChangeRole}
              className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium"
            >
              Simpan Perubahan Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* S-41: AKSES DITOLAK / RBAC MODAL (403 Simulation) */}
      <Dialog open={showAccessDeniedModal} onOpenChange={setShowAccessDeniedModal}>
        <DialogContent onClose={() => setShowAccessDeniedModal(false)}>
          <div className="p-2 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-950/60 text-red-400 border border-red-800/60 flex items-center justify-center mx-auto">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">
              S-41: Akses Ditolak / RBAC
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
              {accessDeniedReason || 'Anda tidak memiliki hak otorisasi yang cukup untuk mengeksekusi tindakan ini.'}
            </p>
            <div className="pt-2">
              <Button
                onClick={() => setShowAccessDeniedModal(false)}
                className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-medium px-4"
              >
                Mengerti
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Wireframe Reference */}
      <div className="pt-2 text-[10px] text-zinc-500 flex items-center justify-between border-t border-zinc-850">
        <span>JunAI • PRD V1.0.0 • Pengguna &amp; RBAC S-35 sampai S-41</span>
        <span className="font-mono">Role Isolation Protected</span>
      </div>
    </div>
  )
}
