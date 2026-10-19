import React, { useState } from 'react'
import { Sidebar, NavTab } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { WireframeNavigator } from '@/components/layout/WireframeNavigator'
import { DashboardScreen } from '@/components/screens/DashboardScreen'
import { MeetingRecorderScreen } from '@/components/screens/MeetingRecorderScreen'
import { DocumentsScreen } from '@/components/screens/DocumentsScreen'
import { HistoryScreen } from '@/components/screens/HistoryScreen'
import { ScheduleScreen } from '@/components/screens/ScheduleScreen'
import { UsersRbacScreen } from '@/components/screens/UsersRbacScreen'
import { FollowUpScreen } from '@/components/screens/FollowUpScreen'
import { SettingsScreen } from '@/components/screens/SettingsScreen'
import { NotificationsScreen } from '@/components/screens/NotificationsScreen'
import { AuthScreens } from '@/components/screens/AuthScreens'
import {
  CommandPalette,
  SvgWireframeModal,
} from '@/components/screens/SystemModals'
import { UserRole } from '@/types'
import { mockNotifications, mockFollowUps } from '@/data/mockData'

export function App() {
  // Navigation & Screen State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard')
  const [currentWireframeId, setCurrentWireframeId] = useState<string>('S-06')
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)

  // Auth & RBAC State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true)
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'reset' | 'verify'>('login')
  const [currentRole, setCurrentRole] = useState<UserRole>('Super Admin')

  // Live Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false)

  // Modals
  const [searchOpen, setSearchOpen] = useState<boolean>(false)
  const [previewSvgScreenId, setPreviewSvgScreenId] = useState<string | null>(null)

  // Notifications and tasks counters
  const unreadNotifsCount = mockNotifications.filter((n) => !n.read).length
  const pendingTasksCount = mockFollowUps.filter((f) => f.status !== 'Done').length

  // Tab Breadcrumbs & Titles
  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Dashboard Ringkasan', breadcrumb: 'Workspace / Dashboard' }
      case 'meetings':
        return { title: 'Meeting Recorder & Audio Processing', breadcrumb: 'Workspace / Meetings' }
      case 'documents':
        return { title: 'Daftar Dokumen & Rangkuman AI', breadcrumb: 'Workspace / Files' }
      case 'history':
        return { title: 'Riwayat Sesi Meeting', breadcrumb: 'Workspace / History' }
      case 'schedule':
        return { title: 'Kalender & Penjadwalan', breadcrumb: 'Workspace / Schedule' }
      case 'followup':
        return { title: 'Tindak Lanjut & Reminder Bot', breadcrumb: 'Workspace / Follow-up' }
      case 'notifications':
        return { title: 'Pusat Notifikasi', breadcrumb: 'Workspace / Notifications' }
      case 'users':
        return { title: 'Manajemen Pengguna & RBAC', breadcrumb: 'Workspace / Users & RBAC' }
      case 'settings':
        return { title: 'Pengaturan Sistem', breadcrumb: 'Workspace / Settings' }
      default:
        return { title: 'JunAI Workspace', breadcrumb: 'Workspace' }
    }
  }

  // Handle Jump from Wireframe Navigator
  const handleSelectWireframeScreen = (screenId: string) => {
    setCurrentWireframeId(screenId)

    // Map screen ID to corresponding tab or view
    if (screenId === 'S-01') {
      setIsAuthenticated(false)
      setAuthMode('login')
    } else if (screenId === 'S-02') {
      setIsAuthenticated(false)
      setAuthMode('register')
    } else if (screenId === 'S-03') {
      setIsAuthenticated(false)
      setAuthMode('forgot')
    } else if (screenId === 'S-04') {
      setIsAuthenticated(false)
      setAuthMode('reset')
    } else if (screenId === 'S-05') {
      setIsAuthenticated(false)
      setAuthMode('verify')
    } else if (screenId === 'S-06' || screenId === 'S-07') {
      setIsAuthenticated(true)
      setActiveTab('dashboard')
    } else if (screenId === 'S-08' || screenId === 'S-46') {
      setIsAuthenticated(true)
      setActiveTab('notifications')
    } else if (screenId === 'S-10') {
      setIsAuthenticated(true)
      setActiveTab('settings')
    } else if (
      ['S-11', 'S-12', 'S-13', 'S-14', 'S-15', 'S-16', 'S-17', 'S-48', 'S-49'].includes(screenId)
    ) {
      setIsAuthenticated(true)
      setActiveTab('meetings')
    } else if (['S-18', 'S-19', 'S-20', 'S-21', 'S-22', 'S-23'].includes(screenId)) {
      setIsAuthenticated(true)
      setActiveTab('documents')
      if (screenId === 'S-19') setSelectedDocId('doc-01')
    } else if (['S-24', 'S-25', 'S-26', 'S-27', 'S-28'].includes(screenId)) {
      setIsAuthenticated(true)
      setActiveTab('history')
    } else if (['S-29', 'S-30', 'S-31', 'S-32', 'S-33', 'S-34'].includes(screenId)) {
      setIsAuthenticated(true)
      setActiveTab('schedule')
    } else if (['S-35', 'S-36', 'S-37', 'S-38', 'S-39', 'S-40', 'S-41'].includes(screenId)) {
      setIsAuthenticated(true)
      setActiveTab('users')
    } else if (['S-42', 'S-43', 'S-44', 'S-45'].includes(screenId)) {
      setIsAuthenticated(true)
      setActiveTab('followup')
    } else if (screenId === 'S-50') {
      setSearchOpen(true)
    }
  }

  // If viewing Auth screens (e.g. logged out or exploring S-01 to S-05)
  if (!isAuthenticated) {
    return (
      <div className="relative">
        <AuthScreens
          initialMode={authMode}
          onLoginSuccess={() => {
            setIsAuthenticated(true)
            setActiveTab('dashboard')
            setCurrentWireframeId('S-06')
          }}
        />

        {/* Wireframe Navigator still accessible so user can return anytime */}
        <WireframeNavigator
          currentScreenId={currentWireframeId}
          onSelectScreen={handleSelectWireframeScreen}
          onOpenSvgViewer={(id) => setPreviewSvgScreenId(id)}
        />

        <SvgWireframeModal
          screenId={previewSvgScreenId}
          onClose={() => setPreviewSvgScreenId(null)}
        />
      </div>
    )
  }

  const { title, breadcrumb } = getHeaderInfo()

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab)
          if (tab === 'dashboard') setCurrentWireframeId('S-06')
          else if (tab === 'meetings') setCurrentWireframeId('S-11')
          else if (tab === 'documents') setCurrentWireframeId('S-18')
          else if (tab === 'history') setCurrentWireframeId('S-24')
          else if (tab === 'schedule') setCurrentWireframeId('S-29')
          else if (tab === 'followup') setCurrentWireframeId('S-42')
          else if (tab === 'notifications') setCurrentWireframeId('S-08')
          else if (tab === 'users') setCurrentWireframeId('S-35')
          else if (tab === 'settings') setCurrentWireframeId('S-10')
        }}
        currentRole={currentRole}
        unreadNotifsCount={unreadNotifsCount}
        pendingTasksCount={pendingTasksCount}
        onLogout={() => {
          setIsAuthenticated(false)
          setAuthMode('login')
          setCurrentWireframeId('S-01')
        }}
        isRecording={isRecording}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        <Topbar
          title={title}
          breadcrumb={breadcrumb}
          currentRole={currentRole}
          onChangeRole={(role) => setCurrentRole(role)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenNotifications={() => {
            setActiveTab('notifications')
            setCurrentWireframeId('S-08')
          }}
          onStartRecorder={() => {
            setActiveTab('meetings')
            setCurrentWireframeId('S-11')
          }}
          unreadCount={unreadNotifsCount}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardScreen
              currentRole={currentRole}
              onStartRecorder={() => {
                setActiveTab('meetings')
                setCurrentWireframeId('S-11')
              }}
              onViewHistory={() => {
                setActiveTab('history')
                setCurrentWireframeId('S-24')
              }}
              onViewDocument={(docId) => {
                setSelectedDocId(docId)
                setActiveTab('documents')
                setCurrentWireframeId('S-19')
              }}
              onViewSchedule={() => {
                setActiveTab('schedule')
                setCurrentWireframeId('S-29')
              }}
            />
          )}

          {activeTab === 'meetings' && (
            <MeetingRecorderScreen
              onRecordingStateChange={(rec) => setIsRecording(rec)}
              onFinishAndOpenDoc={(docId) => {
                setSelectedDocId(docId)
                setActiveTab('documents')
                setCurrentWireframeId('S-19')
              }}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsScreen
              initialDocId={selectedDocId}
              onBackToDashboard={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'history' && (
            <HistoryScreen
              currentRole={currentRole}
              onViewSummaryDoc={(docId) => {
                setSelectedDocId(docId)
                setActiveTab('documents')
                setCurrentWireframeId('S-19')
              }}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleScreen
              currentRole={currentRole}
              onStartRecorder={() => {
                setActiveTab('meetings')
                setCurrentWireframeId('S-11')
              }}
            />
          )}

          {activeTab === 'followup' && <FollowUpScreen />}

          {activeTab === 'notifications' && (
            <NotificationsScreen
              onViewDoc={(docId) => {
                setSelectedDocId(docId)
                setActiveTab('documents')
                setCurrentWireframeId('S-19')
              }}
            />
          )}

          {activeTab === 'users' && <UsersRbacScreen currentRole={currentRole} />}

          {activeTab === 'settings' && <SettingsScreen />}
        </main>
      </div>

      {/* Floating Figma Wireframe Navigator (S-01 to S-50) */}
      <WireframeNavigator
        currentScreenId={currentWireframeId}
        onSelectScreen={handleSelectWireframeScreen}
        onOpenSvgViewer={(id) => setPreviewSvgScreenId(id)}
      />

      {/* Global Search / Command Palette (Cmd+K / S-50) */}
      <CommandPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onNavigate={(tab, id) => {
          if (tab === 'wireframe' && id) {
            handleSelectWireframeScreen(id)
          } else if (tab === 'documents') {
            if (id) setSelectedDocId(id)
            setActiveTab('documents')
          } else if (tab === 'history') {
            setActiveTab('history')
          }
        }}
      />

      {/* SVG Original Wireframe Modal Viewer */}
      <SvgWireframeModal
        screenId={previewSvgScreenId}
        onClose={() => setPreviewSvgScreenId(null)}
      />
    </div>
  )
}

export default App
