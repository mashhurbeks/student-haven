export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          university: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
          username: string | null
          verified: boolean
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          university?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          username?: string | null
          verified?: boolean
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          university?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          username?: string | null
          verified?: boolean
        }
        Relationships: []
      }
      roommate_profiles: {
        Row: {
          additional_notes: string | null
          alcohol: Database["public"]["Enums"]["alcohol_pref"]
          bills_split: string | null
          birth_year: number
          budget_max: number
          budget_min: number
          chores_split: string | null
          city: string
          cleanliness: Database["public"]["Enums"]["cleanliness_level"]
          completion_percent: number
          conflict_style: string | null
          cooks_often: boolean
          created_at: string
          deal_breakers: string[]
          dietary_restrictions: string[]
          districts: string[]
          expected_qualities: string[]
          fasts_ramadan: boolean
          gender: Database["public"]["Enums"]["gender_pref"]
          guests: Database["public"]["Enums"]["guests_pref"]
          had_roommate_before: boolean
          halal_only: boolean
          has_pets: boolean
          hobbies: string[]
          id: string
          interests: string | null
          languages: string[]
          major: string | null
          move_in_date: string | null
          noise_tolerance: Database["public"]["Enums"]["noise_tolerance"]
          overnight_guests_ok: boolean
          personality_type: string | null
          pets_ok: boolean
          prays: boolean
          preferred_contact: string
          preferred_gender: Database["public"]["Enums"]["gender_pref"]
          previous_experience: string | null
          religion: string | null
          religious_practices_at_home: boolean
          shares_food: boolean
          sleep_schedule: Database["public"]["Enums"]["sleep_schedule"]
          sleep_time: string | null
          smoking: Database["public"]["Enums"]["smoking_pref"]
          study_year: number | null
          university: string
          updated_at: string
          user_id: string
          usually_home_days: string[]
          visibility: Database["public"]["Enums"]["visibility_status"]
          wake_time: string | null
          work_or_study_schedule: string | null
        }
        Insert: {
          additional_notes?: string | null
          alcohol?: Database["public"]["Enums"]["alcohol_pref"]
          bills_split?: string | null
          birth_year: number
          budget_max: number
          budget_min: number
          chores_split?: string | null
          city?: string
          cleanliness: Database["public"]["Enums"]["cleanliness_level"]
          completion_percent?: number
          conflict_style?: string | null
          cooks_often?: boolean
          created_at?: string
          deal_breakers?: string[]
          dietary_restrictions?: string[]
          districts?: string[]
          expected_qualities?: string[]
          fasts_ramadan?: boolean
          gender: Database["public"]["Enums"]["gender_pref"]
          guests?: Database["public"]["Enums"]["guests_pref"]
          had_roommate_before?: boolean
          halal_only?: boolean
          has_pets?: boolean
          hobbies?: string[]
          id?: string
          interests?: string | null
          languages?: string[]
          major?: string | null
          move_in_date?: string | null
          noise_tolerance: Database["public"]["Enums"]["noise_tolerance"]
          overnight_guests_ok?: boolean
          personality_type?: string | null
          pets_ok?: boolean
          prays?: boolean
          preferred_contact?: string
          preferred_gender?: Database["public"]["Enums"]["gender_pref"]
          previous_experience?: string | null
          religion?: string | null
          religious_practices_at_home?: boolean
          shares_food?: boolean
          sleep_schedule: Database["public"]["Enums"]["sleep_schedule"]
          sleep_time?: string | null
          smoking?: Database["public"]["Enums"]["smoking_pref"]
          study_year?: number | null
          university: string
          updated_at?: string
          user_id: string
          usually_home_days?: string[]
          visibility?: Database["public"]["Enums"]["visibility_status"]
          wake_time?: string | null
          work_or_study_schedule?: string | null
        }
        Update: {
          additional_notes?: string | null
          alcohol?: Database["public"]["Enums"]["alcohol_pref"]
          bills_split?: string | null
          birth_year?: number
          budget_max?: number
          budget_min?: number
          chores_split?: string | null
          city?: string
          cleanliness?: Database["public"]["Enums"]["cleanliness_level"]
          completion_percent?: number
          conflict_style?: string | null
          cooks_often?: boolean
          created_at?: string
          deal_breakers?: string[]
          dietary_restrictions?: string[]
          districts?: string[]
          expected_qualities?: string[]
          fasts_ramadan?: boolean
          gender?: Database["public"]["Enums"]["gender_pref"]
          guests?: Database["public"]["Enums"]["guests_pref"]
          had_roommate_before?: boolean
          halal_only?: boolean
          has_pets?: boolean
          hobbies?: string[]
          id?: string
          interests?: string | null
          languages?: string[]
          major?: string | null
          move_in_date?: string | null
          noise_tolerance?: Database["public"]["Enums"]["noise_tolerance"]
          overnight_guests_ok?: boolean
          personality_type?: string | null
          pets_ok?: boolean
          prays?: boolean
          preferred_contact?: string
          preferred_gender?: Database["public"]["Enums"]["gender_pref"]
          previous_experience?: string | null
          religion?: string | null
          religious_practices_at_home?: boolean
          shares_food?: boolean
          sleep_schedule?: Database["public"]["Enums"]["sleep_schedule"]
          sleep_time?: string | null
          smoking?: Database["public"]["Enums"]["smoking_pref"]
          study_year?: number | null
          university?: string
          updated_at?: string
          user_id?: string
          usually_home_days?: string[]
          visibility?: Database["public"]["Enums"]["visibility_status"]
          wake_time?: string | null
          work_or_study_schedule?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      alcohol_pref: "no" | "sometimes" | "yes"
      app_role: "student" | "owner" | "broker" | "moderator" | "admin"
      cleanliness_level: "very_clean" | "clean" | "moderate" | "relaxed"
      gender_pref: "male" | "female" | "any"
      guests_pref: "never" | "rarely" | "sometimes" | "often"
      noise_tolerance: "silent" | "quiet" | "moderate" | "lively"
      sleep_schedule: "early_bird" | "night_owl" | "flexible"
      smoking_pref: "no" | "outside_only" | "yes"
      user_type: "student" | "owner" | "broker"
      visibility_status: "public" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alcohol_pref: ["no", "sometimes", "yes"],
      app_role: ["student", "owner", "broker", "moderator", "admin"],
      cleanliness_level: ["very_clean", "clean", "moderate", "relaxed"],
      gender_pref: ["male", "female", "any"],
      guests_pref: ["never", "rarely", "sometimes", "often"],
      noise_tolerance: ["silent", "quiet", "moderate", "lively"],
      sleep_schedule: ["early_bird", "night_owl", "flexible"],
      smoking_pref: ["no", "outside_only", "yes"],
      user_type: ["student", "owner", "broker"],
      visibility_status: ["public", "private"],
    },
  },
} as const
