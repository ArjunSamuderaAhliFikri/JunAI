export type UserRole =
  | 'Super Admin'
  | 'Admin / Project Manager'
  | 'Employee'
  | 'Guest'
  | 'Super Guest'

export type MeetingPlatform = 'Discord' | 'Zoom' | 'Google Meet'

export type ReminderType = 'Kickoff' | 'Deadline' | 'Follow_Up' | 'Custom'

export type NotificationType = 'Meeting Reminder' | 'Meeting Started' | 'Meeting Ended'

export type AccountStatus = 'Active' | 'Inactive' | 'Suspended'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  status: AccountStatus
  isVerified: boolean
  avatar?: string
  joinedDate: string
  department?: string
}

export interface MeetingItem {
  id: string
  title: string
  platform: MeetingPlatform
  date: string
  time: string
  durationMinutes: number
  participantsCount: number
  organizer: string
  status: 'Completed' | 'Processing' | 'Scheduled' | 'Recording'
  summaryDocId?: string
  audioDuration?: string
  pcmFilesCount?: number
  contributors: {
    name: string
    role: string
    talkPercentage: number
  }[]
}

export interface DocumentItem {
  id: string
  title: string
  meetingId: string
  author: string
  createdAt: string
  format: 'PDF' | 'TXT' | 'BOTH'
  fileSize: string
  summary: string
  keyDecisions: string[]
  actionItems: {
    task: string
    assignee: string
    deadline: string
    priority: 'High' | 'Medium' | 'Low'
    status: 'Pending' | 'Completed'
  }[]
  transcription: {
    speaker: string
    timestamp: string
    text: string
  }[]
}

export interface ScheduleItem {
  id: string
  title: string
  platform: MeetingPlatform
  dateTime: string
  activityType: 'Kickoff' | 'Weekly Sync' | 'Sprint Review' | 'Client Discussion' | 'Follow-up'
  participants: string[]
  reminderOffset: string
  reminderType: ReminderType
  status: 'Upcoming' | 'Passed' | 'Cancelled'
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: NotificationType
  timestamp: string
  read: boolean
  meetingId?: string
}

export interface FollowUpTask {
  id: string
  title: string
  assignee: string
  dueDate: string
  meetingTitle: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'To Do' | 'In Progress' | 'Done'
  subtasks: { id: string; text: string; done: boolean }[]
}

export interface ChatReminderMessage {
  id: string
  sender: 'JunAI Bot' | 'User'
  text: string
  timestamp: string
  isActionable?: boolean
  actionText?: string
}
