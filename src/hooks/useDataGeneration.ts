import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface DatabaseStats {
  universities: number
  programs: number
  scholarships: number
}

export const useDataGeneration = (dbStats: DatabaseStats, refetchStats: () => Promise<void>) => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateSampleData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('university-data-processor', {
        body: { 
          action: 'generate_sample_data'
        }
      })

      if (error) throw error

      // Refresh database stats
      await refetchStats()

      toast({
        title: "Universities Added Successfully!",
        description: `Sample universities have been added to the database. Total: ${dbStats.universities + 2} universities`,
        duration: 5000
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const generateComprehensiveData = async () => {
    setLoading(true)
    try {
      const currentCount = dbStats.universities
      
      const { data, error } = await supabase.functions.invoke('data-import-tool', {
        body: { 
          action: 'generate_comprehensive_data',
          options: { count: 100 }
        }
      })

      if (error) throw error

      // Refresh database stats
      await refetchStats()

      toast({
        title: "Universities Added Successfully!",
        description: `Added 100 new universities! Database now contains ${currentCount + 100} universities with programs and scholarships`,
        duration: 5000
      })
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to generate comprehensive data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    generateSampleData,
    generateComprehensiveData
  }
}