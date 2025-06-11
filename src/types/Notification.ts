export interface Notification {
  id: string
  title: string
  message: string
  type: "recipe" | "achievement" | "tip" | "update" | "reminder"
  timestamp: string
  read: boolean
  icon: string
  actionUrl?: string
  data?: any
}

export type NotificationType = "recipe" | "achievement" | "tip" | "update" | "reminder"
