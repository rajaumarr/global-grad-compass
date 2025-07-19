import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { BouncingLoader } from "@/components/ui/bouncing-loader"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { AccessRestricted } from "@/components/data-management/AccessRestricted"
import { Header } from "@/components/Header"
import { Search, Building2, Edit, Trash2, Plus } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface University {
  id: string
  name: string
  city: string
  state: string
  type: string
  ranking?: number
  tuition_international: number
  website?: string
  created_at: string
}

const UniversityManagement = () => {
  const { loading: authLoading, isAdmin, user } = useAdminAuth()
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchUniversities = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('universities')
        .select(`
          id,
          name,
          city,
          state,
          type,
          ranking,
          tuition_international,
          website,
          created_at
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setUniversities(data || [])
    } catch (error) {
      console.error('Error fetching universities:', error)
      toast({
        title: "Error",
        description: "Failed to fetch universities",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUniversity = async (universityId: string) => {
    try {
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', universityId)

      if (error) throw error

      toast({
        title: "Success",
        description: "University deleted successfully"
      })

      // Refresh universities list
      fetchUniversities()
    } catch (error) {
      console.error('Error deleting university:', error)
      toast({
        title: "Error",
        description: "Failed to delete university",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchUniversities()
    }
  }, [isAdmin])

  if (authLoading || !user) {
    return <BouncingLoader message="Checking permissions..." size="sm" className="py-20" />
  }

  if (!isAdmin) {
    return <AccessRestricted />
  }

  const filteredUniversities = universities.filter(university =>
    university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    university.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    university.state.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">University Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              {universities.length} Universities
            </Badge>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add University
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Universities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name, city, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Universities Database</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <BouncingLoader message="Loading universities..." size="sm" className="py-8" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Ranking</TableHead>
                    <TableHead>Int'l Tuition</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUniversities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No universities found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUniversities.map((university) => (
                      <TableRow key={university.id}>
                        <TableCell className="font-medium max-w-xs">
                          <div>
                            <div className="font-semibold">{university.name}</div>
                            {university.website && (
                              <a
                                href={university.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                Website
                              </a>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {university.city}, {university.state}
                        </TableCell>
                        <TableCell>
                          <Badge variant={university.type === 'public' ? 'secondary' : 'outline'}>
                            {university.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {university.ranking ? `#${university.ranking}` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          ${university.tuition_international?.toLocaleString() || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {new Date(university.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="h-8"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete University</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{university.name}"? This action cannot be undone.
                                    All associated programs and scholarships will also be deleted.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUniversity(university.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete University
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}

export default UniversityManagement