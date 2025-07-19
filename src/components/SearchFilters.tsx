import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  filters?: FilterState
}

export interface FilterState {
  searchQuery: string
  state: string
  degreeType: string
  maxTuition: number
  hasScholarships: boolean
  hasInStateTuition: boolean
  noGRE: boolean
  minGPA: number
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
]

const defaultFilters: FilterState = {
  searchQuery: "",
  state: "",
  degreeType: "",
  maxTuition: 100000,
  hasScholarships: false,
  hasInStateTuition: false,
  noGRE: false,
  minGPA: 0
}

export function SearchFilters({ onFiltersChange, filters = defaultFilters }: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    onFiltersChange(updated)
  }

  const clearFilters = () => {
    onFiltersChange(defaultFilters)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.searchQuery) count++
    if (filters.state) count++
    if (filters.degreeType) count++
    if (filters.maxTuition < 100000) count++
    if (filters.hasScholarships) count++
    if (filters.hasInStateTuition) count++
    if (filters.noGRE) count++
    if (filters.minGPA > 0) count++
    return count
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Universities
          </CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFiltersCount()} active
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4 mr-1" />
              {showAdvanced ? "Hide" : "Advanced"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div>
          <Label htmlFor="search">Search Universities or Programs</Label>
          <Input
            id="search"
            placeholder="e.g., Stanford, Computer Science, Engineering..."
            value={filters.searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* State */}
          <div>
            <Label>State</Label>
            <Select 
              value={filters.state} 
              onValueChange={(value) => updateFilters({ state: value === "any" ? "" : value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Any state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any state</SelectItem>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Degree Type */}
          <div>
            <Label>Degree Type</Label>
            <Select 
              value={filters.degreeType} 
              onValueChange={(value) => updateFilters({ degreeType: value === "any" ? "" : value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Any degree" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any degree</SelectItem>
                <SelectItem value="MS">Master's (MS)</SelectItem>
                <SelectItem value="PhD">Doctorate (PhD)</SelectItem>
                <SelectItem value="MBA">MBA</SelectItem>
                <SelectItem value="MFA">MFA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            {/* Max Tuition */}
            <div>
              <Label htmlFor="tuition">
                Max Tuition: ${filters.maxTuition.toLocaleString()}
              </Label>
              <input
                id="tuition"
                type="range"
                min="10000"
                max="100000"
                step="5000"
                value={filters.maxTuition}
                onChange={(e) => updateFilters({ maxTuition: parseInt(e.target.value) })}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$10k</span>
                <span>$100k+</span>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scholarships"
                  checked={filters.hasScholarships}
                  onCheckedChange={(checked) => updateFilters({ hasScholarships: !!checked })}
                />
                <Label htmlFor="scholarships" className="text-sm">
                  Has scholarships available
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="instate"
                  checked={filters.hasInStateTuition}
                  onCheckedChange={(checked) => updateFilters({ hasInStateTuition: !!checked })}
                />
                <Label htmlFor="instate" className="text-sm">
                  Offers in-state tuition for international students
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="nogre"
                  checked={filters.noGRE}
                  onCheckedChange={(checked) => updateFilters({ noGRE: !!checked })}
                />
                <Label htmlFor="nogre" className="text-sm">
                  No GRE required
                </Label>
              </div>
            </div>

            {/* Min GPA */}
            <div>
              <Label htmlFor="gpa">Minimum GPA: {filters.minGPA || "Any"}</Label>
              <input
                id="gpa"
                type="range"
                min="0"
                max="4"
                step="0.1"
                value={filters.minGPA}
                onChange={(e) => updateFilters({ minGPA: parseFloat(e.target.value) })}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Any</span>
                <span>4.0</span>
              </div>
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {getActiveFiltersCount() > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="w-full"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All Filters
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
