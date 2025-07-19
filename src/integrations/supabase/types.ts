export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          application_deadline: string | null
          application_fee_paid: boolean | null
          application_submitted_date: string | null
          created_at: string
          decision_date: string | null
          decision_type: string | null
          documents_submitted: Json | null
          id: string
          letters_of_rec_sent: boolean | null
          notes: string | null
          personal_statement_submitted: boolean | null
          priority: number | null
          program_id: string | null
          requirements_completed: Json | null
          status: string
          test_scores_sent: boolean | null
          transcript_sent: boolean | null
          university_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_deadline?: string | null
          application_fee_paid?: boolean | null
          application_submitted_date?: string | null
          created_at?: string
          decision_date?: string | null
          decision_type?: string | null
          documents_submitted?: Json | null
          id?: string
          letters_of_rec_sent?: boolean | null
          notes?: string | null
          personal_statement_submitted?: boolean | null
          priority?: number | null
          program_id?: string | null
          requirements_completed?: Json | null
          status?: string
          test_scores_sent?: boolean | null
          transcript_sent?: boolean | null
          university_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_deadline?: string | null
          application_fee_paid?: boolean | null
          application_submitted_date?: string | null
          created_at?: string
          decision_date?: string | null
          decision_type?: string | null
          documents_submitted?: Json | null
          id?: string
          letters_of_rec_sent?: boolean | null
          notes?: string | null
          personal_statement_submitted?: boolean | null
          priority?: number | null
          program_id?: string | null
          requirements_completed?: Json | null
          status?: string
          test_scores_sent?: boolean | null
          transcript_sent?: boolean | null
          university_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      data_sources: {
        Row: {
          automated: boolean | null
          created_at: string
          data_quality_score: number | null
          id: string
          last_updated: string
          notes: string | null
          source_type: string
          source_url: string | null
          university_id: string
          update_frequency: string | null
        }
        Insert: {
          automated?: boolean | null
          created_at?: string
          data_quality_score?: number | null
          id?: string
          last_updated?: string
          notes?: string | null
          source_type: string
          source_url?: string | null
          university_id: string
          update_frequency?: string | null
        }
        Update: {
          automated?: boolean | null
          created_at?: string
          data_quality_score?: number | null
          id?: string
          last_updated?: string
          notes?: string | null
          source_type?: string
          source_url?: string | null
          university_id?: string
          update_frequency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_sources_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          academic_background: string | null
          created_at: string
          display_name: string | null
          gmat: number | null
          gpa: number | null
          gre_quantitative: number | null
          gre_verbal: number | null
          gre_writing: number | null
          id: string
          ielts: number | null
          max_tuition_budget: number | null
          preferred_degree_types: string[] | null
          preferred_states: string[] | null
          target_programs: string[] | null
          toefl: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academic_background?: string | null
          created_at?: string
          display_name?: string | null
          gmat?: number | null
          gpa?: number | null
          gre_quantitative?: number | null
          gre_verbal?: number | null
          gre_writing?: number | null
          id?: string
          ielts?: number | null
          max_tuition_budget?: number | null
          preferred_degree_types?: string[] | null
          preferred_states?: string[] | null
          target_programs?: string[] | null
          toefl?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academic_background?: string | null
          created_at?: string
          display_name?: string | null
          gmat?: number | null
          gpa?: number | null
          gre_quantitative?: number | null
          gre_verbal?: number | null
          gre_writing?: number | null
          id?: string
          ielts?: number | null
          max_tuition_budget?: number | null
          preferred_degree_types?: string[] | null
          preferred_states?: string[] | null
          target_programs?: string[] | null
          toefl?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      program_reviews: {
        Row: {
          created_at: string
          graduation_year: number | null
          helpful_votes: number | null
          id: string
          program_id: string
          rating: number | null
          review_text: string | null
          reviewer_name: string | null
          updated_at: string
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          graduation_year?: number | null
          helpful_votes?: number | null
          id?: string
          program_id: string
          rating?: number | null
          review_text?: string | null
          reviewer_name?: string | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          graduation_year?: number | null
          helpful_votes?: number | null
          id?: string
          program_id?: string
          rating?: number | null
          review_text?: string | null
          reviewer_name?: string | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "program_reviews_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          application_deadline: string | null
          average_class_size: number | null
          average_starting_salary: number | null
          capstone_required: boolean | null
          career_outcomes: Json | null
          created_at: string
          credit_hours: number | null
          cv_resume_required: boolean | null
          degree: string
          department: string
          description: string | null
          duration_months: number | null
          employment_rate: number | null
          faculty_count: number | null
          format: string | null
          id: string
          industry_partnerships: string[] | null
          internship_opportunities: boolean | null
          interview_required: boolean | null
          language_requirements: string[] | null
          letters_of_recommendation_required: number | null
          min_work_experience_years: number | null
          name: string
          portfolio_required: boolean | null
          prerequisites: string[] | null
          requirements_gmat: number | null
          requirements_gpa: number | null
          requirements_gre_quantitative: number | null
          requirements_gre_verbal: number | null
          requirements_gre_writing: number | null
          requirements_ielts: number | null
          requirements_toefl: number | null
          research_opportunities: boolean | null
          specializations: string[] | null
          statement_of_purpose_required: boolean | null
          thesis_required: boolean | null
          university_id: string
          updated_at: string
          work_experience_required: boolean | null
        }
        Insert: {
          application_deadline?: string | null
          average_class_size?: number | null
          average_starting_salary?: number | null
          capstone_required?: boolean | null
          career_outcomes?: Json | null
          created_at?: string
          credit_hours?: number | null
          cv_resume_required?: boolean | null
          degree: string
          department: string
          description?: string | null
          duration_months?: number | null
          employment_rate?: number | null
          faculty_count?: number | null
          format?: string | null
          id?: string
          industry_partnerships?: string[] | null
          internship_opportunities?: boolean | null
          interview_required?: boolean | null
          language_requirements?: string[] | null
          letters_of_recommendation_required?: number | null
          min_work_experience_years?: number | null
          name: string
          portfolio_required?: boolean | null
          prerequisites?: string[] | null
          requirements_gmat?: number | null
          requirements_gpa?: number | null
          requirements_gre_quantitative?: number | null
          requirements_gre_verbal?: number | null
          requirements_gre_writing?: number | null
          requirements_ielts?: number | null
          requirements_toefl?: number | null
          research_opportunities?: boolean | null
          specializations?: string[] | null
          statement_of_purpose_required?: boolean | null
          thesis_required?: boolean | null
          university_id: string
          updated_at?: string
          work_experience_required?: boolean | null
        }
        Update: {
          application_deadline?: string | null
          average_class_size?: number | null
          average_starting_salary?: number | null
          capstone_required?: boolean | null
          career_outcomes?: Json | null
          created_at?: string
          credit_hours?: number | null
          cv_resume_required?: boolean | null
          degree?: string
          department?: string
          description?: string | null
          duration_months?: number | null
          employment_rate?: number | null
          faculty_count?: number | null
          format?: string | null
          id?: string
          industry_partnerships?: string[] | null
          internship_opportunities?: boolean | null
          interview_required?: boolean | null
          language_requirements?: string[] | null
          letters_of_recommendation_required?: number | null
          min_work_experience_years?: number | null
          name?: string
          portfolio_required?: boolean | null
          prerequisites?: string[] | null
          requirements_gmat?: number | null
          requirements_gpa?: number | null
          requirements_gre_quantitative?: number | null
          requirements_gre_verbal?: number | null
          requirements_gre_writing?: number | null
          requirements_ielts?: number | null
          requirements_toefl?: number | null
          research_opportunities?: boolean | null
          specializations?: string[] | null
          statement_of_purpose_required?: boolean | null
          thesis_required?: boolean | null
          university_id?: string
          updated_at?: string
          work_experience_required?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_universities: {
        Row: {
          created_at: string
          id: string
          university_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          university_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          university_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_universities_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      scholarships: {
        Row: {
          amount_type: string
          amount_value: number | null
          application_required: boolean | null
          citizenship_requirements: string[] | null
          contact_email: string | null
          coverage_details: string | null
          created_at: string
          deadline: string | null
          description: string | null
          eligibility: string[] | null
          external_link: string | null
          field_of_study_restrictions: string[] | null
          funding_source: string | null
          gpa_requirement: number | null
          id: string
          name: string
          number_available: number | null
          renewable: boolean
          requires_essay: boolean | null
          requires_interview: boolean | null
          requires_portfolio: boolean | null
          selection_criteria: string[] | null
          university_id: string
          updated_at: string
        }
        Insert: {
          amount_type: string
          amount_value?: number | null
          application_required?: boolean | null
          citizenship_requirements?: string[] | null
          contact_email?: string | null
          coverage_details?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          eligibility?: string[] | null
          external_link?: string | null
          field_of_study_restrictions?: string[] | null
          funding_source?: string | null
          gpa_requirement?: number | null
          id?: string
          name: string
          number_available?: number | null
          renewable?: boolean
          requires_essay?: boolean | null
          requires_interview?: boolean | null
          requires_portfolio?: boolean | null
          selection_criteria?: string[] | null
          university_id: string
          updated_at?: string
        }
        Update: {
          amount_type?: string
          amount_value?: number | null
          application_required?: boolean | null
          citizenship_requirements?: string[] | null
          contact_email?: string | null
          coverage_details?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          eligibility?: string[] | null
          external_link?: string | null
          field_of_study_restrictions?: string[] | null
          funding_source?: string | null
          gpa_requirement?: number | null
          id?: string
          name?: string
          number_available?: number | null
          renewable?: boolean
          requires_essay?: boolean | null
          requires_interview?: boolean | null
          requires_portfolio?: boolean | null
          selection_criteria?: string[] | null
          university_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scholarships_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          acceptance_rate: number | null
          accreditation: string[] | null
          address_line1: string | null
          address_line2: string | null
          application_fee: number | null
          campus_size: string | null
          city: string
          common_app_accepted: boolean | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          faculty_student_ratio: string | null
          founded_year: number | null
          graduation_rate: number | null
          has_in_state_tuition_waiver: boolean
          housing_available: boolean | null
          id: string
          image_url: string | null
          international_programs: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          notable_alumni: string[] | null
          ranking: number | null
          research_areas: string[] | null
          setting: string | null
          state: string
          student_population: number | null
          tuition_in_state: number | null
          tuition_international: number
          tuition_out_of_state: number | null
          type: string | null
          updated_at: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          acceptance_rate?: number | null
          accreditation?: string[] | null
          address_line1?: string | null
          address_line2?: string | null
          application_fee?: number | null
          campus_size?: string | null
          city: string
          common_app_accepted?: boolean | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          faculty_student_ratio?: string | null
          founded_year?: number | null
          graduation_rate?: number | null
          has_in_state_tuition_waiver?: boolean
          housing_available?: boolean | null
          id?: string
          image_url?: string | null
          international_programs?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          notable_alumni?: string[] | null
          ranking?: number | null
          research_areas?: string[] | null
          setting?: string | null
          state: string
          student_population?: number | null
          tuition_in_state?: number | null
          tuition_international: number
          tuition_out_of_state?: number | null
          type?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          acceptance_rate?: number | null
          accreditation?: string[] | null
          address_line1?: string | null
          address_line2?: string | null
          application_fee?: number | null
          campus_size?: string | null
          city?: string
          common_app_accepted?: boolean | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          faculty_student_ratio?: string | null
          founded_year?: number | null
          graduation_rate?: number | null
          has_in_state_tuition_waiver?: boolean
          housing_available?: boolean | null
          id?: string
          image_url?: string | null
          international_programs?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          notable_alumni?: string[] | null
          ranking?: number | null
          research_areas?: string[] | null
          setting?: string | null
          state?: string
          student_population?: number | null
          tuition_in_state?: number | null
          tuition_international?: number
          tuition_out_of_state?: number | null
          type?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      university_rankings: {
        Row: {
          category_ranks: Json | null
          created_at: string
          id: string
          overall_rank: number | null
          ranking_system: string
          university_id: string
          year: number
        }
        Insert: {
          category_ranks?: Json | null
          created_at?: string
          id?: string
          overall_rank?: number | null
          ranking_system: string
          university_id: string
          year: number
        }
        Update: {
          category_ranks?: Json | null
          created_at?: string
          id?: string
          overall_rank?: number | null
          ranking_system?: string
          university_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "university_rankings_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          application_timeline: Json | null
          created_at: string
          housing_required: boolean | null
          id: string
          international_programs_important: boolean | null
          internship_opportunities_important: boolean | null
          max_acceptance_rate: number | null
          max_tuition_budget: number | null
          min_acceptance_rate: number | null
          preferred_class_sizes: string[] | null
          preferred_locations: string[] | null
          preferred_program_formats: string[] | null
          preferred_university_settings: string[] | null
          preferred_university_types: string[] | null
          research_opportunities_important: boolean | null
          scholarship_priority: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_timeline?: Json | null
          created_at?: string
          housing_required?: boolean | null
          id?: string
          international_programs_important?: boolean | null
          internship_opportunities_important?: boolean | null
          max_acceptance_rate?: number | null
          max_tuition_budget?: number | null
          min_acceptance_rate?: number | null
          preferred_class_sizes?: string[] | null
          preferred_locations?: string[] | null
          preferred_program_formats?: string[] | null
          preferred_university_settings?: string[] | null
          preferred_university_types?: string[] | null
          research_opportunities_important?: boolean | null
          scholarship_priority?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          application_timeline?: Json | null
          created_at?: string
          housing_required?: boolean | null
          id?: string
          international_programs_important?: boolean | null
          internship_opportunities_important?: boolean | null
          max_acceptance_rate?: number | null
          max_tuition_budget?: number | null
          min_acceptance_rate?: number | null
          preferred_class_sizes?: string[] | null
          preferred_locations?: string[] | null
          preferred_program_formats?: string[] | null
          preferred_university_settings?: string[] | null
          preferred_university_types?: string[] | null
          research_opportunities_important?: boolean | null
          scholarship_priority?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
