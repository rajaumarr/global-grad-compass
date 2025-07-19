import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export interface Application {
  id: string
  university_id: string
  university_name: string
  program_name: string
  degree_type: string
  status: 'planning' | 'in_progress' | 'submitted' | 'accepted' | 'rejected' | 'waitlisted'
  application_deadline: string
  created_at: string
  updated_at: string
  notes?: string
  documents_submitted?: string[]
  requirements_met?: string[]
}

export function useApplicationTracking() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadApplications()
    } else {
      const saved = localStorage.getItem('applications')
      setApplications(saved ? JSON.parse(saved) : [])
      setLoading(false)
    }
  }, [user])

  const loadApplications = async () => {
    if (!user) return
    
    try {
      const saved = localStorage.getItem(`applications-${user.id}`)
      setApplications(saved ? JSON.parse(saved) : [])
    } catch (error) {
      console.error('Error loading applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveApplications = (apps: Application[]) => {
    const storageKey = user ? `applications-${user.id}` : 'applications'
    localStorage.setItem(storageKey, JSON.stringify(apps))
  }

  const addApplication = async (application: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => {
    const newApp: Application = {
      ...application,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const newApplications = [...applications, newApp]
    setApplications(newApplications)
    saveApplications(newApplications)
    return newApp
  }

  const updateApplication = async (id: string, updates: Partial<Application>) => {
    const newApplications = applications.map(app => 
      app.id === id 
        ? { ...app, ...updates, updated_at: new Date().toISOString() }
        : app
    )
    setApplications(newApplications)
    saveApplications(newApplications)
  }

  const deleteApplication = async (id: string) => {
    const newApplications = applications.filter(app => app.id !== id)
    setApplications(newApplications)
    saveApplications(newApplications)
  }

  const getApplicationsByStatus = (status: Application['status']) => {
    return applications.filter(app => app.status === status)
  }

  const getUpcomingDeadlines = (days: number = 30) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() + days)
    
    return applications.filter(app => {
      const deadline = new Date(app.application_deadline)
      return deadline <= cutoffDate && deadline >= new Date() && app.status !== 'submitted'
    }).sort((a, b) => new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime())
  }

  return {
    applications,
    loading,
    addApplication,
    updateApplication,
    deleteApplication,
    getApplicationsByStatus,
    getUpcomingDeadlines,
    refetch: loadApplications
  }
}