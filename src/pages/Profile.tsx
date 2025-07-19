import { useState, useEffect } from "react"
import { BouncingLoader } from "@/components/ui/bouncing-loader"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { User, GraduationCap, Target, DollarSign, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
]

const DEGREE_TYPES = ["Master's", "PhD", "Professional"]

const Profile = () => {
  const { user, profile, updateProfile, loading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    display_name: "",
    academic_background: "",
    gpa: "",
    gre_verbal: "",
    gre_quantitative: "",
    gre_writing: "",
    gmat: "",
    toefl: "",
    ielts: "",
    preferred_states: [] as string[],
    preferred_degree_types: [] as string[],
    max_tuition_budget: "",
    target_programs: [] as string[]
  })

  const [newState, setNewState] = useState("")
  const [newDegreeType, setNewDegreeType] = useState("")
  const [newProgram, setNewProgram] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth")
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        academic_background: profile.academic_background || "",
        gpa: profile.gpa?.toString() || "",
        gre_verbal: profile.gre_verbal?.toString() || "",
        gre_quantitative: profile.gre_quantitative?.toString() || "",
        gre_writing: profile.gre_writing?.toString() || "",
        gmat: profile.gmat?.toString() || "",
        toefl: profile.toefl?.toString() || "",
        ielts: profile.ielts?.toString() || "",
        preferred_states: profile.preferred_states || [],
        preferred_degree_types: profile.preferred_degree_types || [],
        max_tuition_budget: profile.max_tuition_budget?.toString() || "",
        target_programs: profile.target_programs || []
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    const updates = {
      display_name: formData.display_name,
      academic_background: formData.academic_background,
      gpa: formData.gpa ? parseFloat(formData.gpa) : null,
      gre_verbal: formData.gre_verbal ? parseInt(formData.gre_verbal) : null,
      gre_quantitative: formData.gre_quantitative ? parseInt(formData.gre_quantitative) : null,
      gre_writing: formData.gre_writing ? parseFloat(formData.gre_writing) : null,
      gmat: formData.gmat ? parseInt(formData.gmat) : null,
      toefl: formData.toefl ? parseInt(formData.toefl) : null,
      ielts: formData.ielts ? parseFloat(formData.ielts) : null,
      preferred_states: formData.preferred_states,
      preferred_degree_types: formData.preferred_degree_types,
      max_tuition_budget: formData.max_tuition_budget ? parseInt(formData.max_tuition_budget) : null,
      target_programs: formData.target_programs
    }

    const { error } = await updateProfile(updates)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully!"
      })
    }

    setIsUpdating(false)
  }

  const addState = () => {
    if (newState && !formData.preferred_states.includes(newState)) {
      setFormData(prev => ({
        ...prev,
        preferred_states: [...prev.preferred_states, newState]
      }))
      setNewState("")
    }
  }

  const removeState = (state: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_states: prev.preferred_states.filter(s => s !== state)
    }))
  }

  const addDegreeType = () => {
    if (newDegreeType && !formData.preferred_degree_types.includes(newDegreeType)) {
      setFormData(prev => ({
        ...prev,
        preferred_degree_types: [...prev.preferred_degree_types, newDegreeType]
      }))
      setNewDegreeType("")
    }
  }

  const removeDegreeType = (degreeType: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_degree_types: prev.preferred_degree_types.filter(d => d !== degreeType)
    }))
  }

  const addProgram = () => {
    if (newProgram && !formData.target_programs.includes(newProgram)) {
      setFormData(prev => ({
        ...prev,
        target_programs: [...prev.target_programs, newProgram]
      }))
      setNewProgram("")
    }
  }

  const removeProgram = (program: string) => {
    setFormData(prev => ({
      ...prev,
      target_programs: prev.target_programs.filter(p => p !== program)
    }))
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <BouncingLoader message="Loading your profile..." className="py-32" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your academic profile and preferences for personalized recommendations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      value={formData.display_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="academic_background">Academic Background</Label>
                  <Textarea
                    id="academic_background"
                    value={formData.academic_background}
                    onChange={(e) => setFormData(prev => ({ ...prev, academic_background: e.target.value }))}
                    placeholder="Describe your educational background, field of study, etc."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Academic Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Academic Scores</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="gpa">GPA (4.0 scale)</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={formData.gpa}
                      onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                      placeholder="3.50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gmat">GMAT Score</Label>
                    <Input
                      id="gmat"
                      type="number"
                      min="200"
                      max="800"
                      value={formData.gmat}
                      onChange={(e) => setFormData(prev => ({ ...prev, gmat: e.target.value }))}
                      placeholder="650"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>GRE Scores</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="gre_verbal" className="text-sm text-muted-foreground">Verbal</Label>
                      <Input
                        id="gre_verbal"
                        type="number"
                        min="130"
                        max="170"
                        value={formData.gre_verbal}
                        onChange={(e) => setFormData(prev => ({ ...prev, gre_verbal: e.target.value }))}
                        placeholder="160"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gre_quantitative" className="text-sm text-muted-foreground">Quantitative</Label>
                      <Input
                        id="gre_quantitative"
                        type="number"
                        min="130"
                        max="170"
                        value={formData.gre_quantitative}
                        onChange={(e) => setFormData(prev => ({ ...prev, gre_quantitative: e.target.value }))}
                        placeholder="165"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gre_writing" className="text-sm text-muted-foreground">Writing</Label>
                      <Input
                        id="gre_writing"
                        type="number"
                        step="0.5"
                        min="0"
                        max="6"
                        value={formData.gre_writing}
                        onChange={(e) => setFormData(prev => ({ ...prev, gre_writing: e.target.value }))}
                        placeholder="4.5"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="toefl">TOEFL Score</Label>
                    <Input
                      id="toefl"
                      type="number"
                      min="0"
                      max="120"
                      value={formData.toefl}
                      onChange={(e) => setFormData(prev => ({ ...prev, toefl: e.target.value }))}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ielts">IELTS Score</Label>
                    <Input
                      id="ielts"
                      type="number"
                      step="0.5"
                      min="0"
                      max="9"
                      value={formData.ielts}
                      onChange={(e) => setFormData(prev => ({ ...prev, ielts: e.target.value }))}
                      placeholder="7.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preferred States */}
                <div>
                  <Label>Preferred States</Label>
                  <div className="flex space-x-2 mt-2">
                    <Select value={newState} onValueChange={setNewState}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.filter(state => !formData.preferred_states.includes(state)).map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addState} disabled={!newState}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.preferred_states.map(state => (
                      <Badge key={state} variant="secondary" className="cursor-pointer" onClick={() => removeState(state)}>
                        <MapPin className="h-3 w-3 mr-1" />
                        {state} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Preferred Degree Types */}
                <div>
                  <Label>Preferred Degree Types</Label>
                  <div className="flex space-x-2 mt-2">
                    <Select value={newDegreeType} onValueChange={setNewDegreeType}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select degree type" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEGREE_TYPES.filter(type => !formData.preferred_degree_types.includes(type)).map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addDegreeType} disabled={!newDegreeType}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.preferred_degree_types.map(type => (
                      <Badge key={type} variant="secondary" className="cursor-pointer" onClick={() => removeDegreeType(type)}>
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {type} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Target Programs */}
                <div>
                  <Label>Target Programs/Fields</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      value={newProgram}
                      onChange={(e) => setNewProgram(e.target.value)}
                      placeholder="e.g., Computer Science, MBA, etc."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProgram())}
                    />
                    <Button type="button" onClick={addProgram} disabled={!newProgram}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.target_programs.map(program => (
                      <Badge key={program} variant="secondary" className="cursor-pointer" onClick={() => removeProgram(program)}>
                        <Target className="h-3 w-3 mr-1" />
                        {program} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <Label htmlFor="max_tuition_budget">Maximum Tuition Budget (USD)</Label>
                  <div className="relative mt-2">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="max_tuition_budget"
                      type="number"
                      min="0"
                      value={formData.max_tuition_budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_tuition_budget: e.target.value }))}
                      placeholder="50000"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating} size="lg">
                {isUpdating ? "Updating..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile