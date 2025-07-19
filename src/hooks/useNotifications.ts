import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Date
  actionUrl?: string
}

export const useNotifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (user) {
      // Generate sample notifications for demonstration
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          title: 'Application Deadline Reminder',
          message: 'Stanford University application deadline is in 7 days',
          type: 'warning',
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          actionUrl: '/applications'
        },
        {
          id: '2',
          title: 'New Scholarship Available',
          message: 'MIT Presidential Fellowship is now accepting applications',
          type: 'info',
          read: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          actionUrl: '/universities/mit'
        },
        {
          id: '3',
          title: 'Profile Updated',
          message: 'Your GPA has been successfully updated',
          type: 'success',
          read: true,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          actionUrl: '/profile'
        }
      ]
      setNotifications(sampleNotifications)
    }
  }, [user])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
}