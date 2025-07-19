import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface NewApplicationData {
  university_name: string
  program_name: string
  degree_type: string
  application_deadline: string
  status: 'planning' | 'in_progress' | 'submitted' | 'accepted' | 'rejected' | 'waitlisted'
  notes: string
}

interface AddApplicationDialogProps {
  isOpen: boolean
  onClose: () => void
  newApplication: NewApplicationData
  onUpdateApplication: (updates: Partial<NewApplicationData>) => void
  onAddApplication: () => void
}

export const AddApplicationDialog = ({
  isOpen,
  onClose,
  newApplication,
  onUpdateApplication,
  onAddApplication
}: AddApplicationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="university_name">University Name *</Label>
            <Input
              id="university_name"
              value={newApplication.university_name}
              onChange={(e) => onUpdateApplication({ university_name: e.target.value })}
              placeholder="University of Example"
            />
          </div>
          <div>
            <Label htmlFor="program_name">Program Name *</Label>
            <Input
              id="program_name"
              value={newApplication.program_name}
              onChange={(e) => onUpdateApplication({ program_name: e.target.value })}
              placeholder="Master of Computer Science"
            />
          </div>
          <div>
            <Label htmlFor="degree_type">Degree Type</Label>
            <Select 
              value={newApplication.degree_type} 
              onValueChange={(value) => onUpdateApplication({ degree_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select degree type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Master's">Master's</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="application_deadline">Application Deadline *</Label>
            <Input
              id="application_deadline"
              type="date"
              value={newApplication.application_deadline}
              onChange={(e) => onUpdateApplication({ application_deadline: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={newApplication.notes}
              onChange={(e) => onUpdateApplication({ notes: e.target.value })}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>
          <Button onClick={onAddApplication} className="w-full">
            Add Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}