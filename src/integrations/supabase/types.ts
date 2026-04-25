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
      city_event_overrides: {
        Row: {
          blurb: string | null
          cancelled: boolean
          created_at: string
          end_at: string | null
          event_id: string
          id: string
          location: string | null
          note: string | null
          override_date: string
          start_at: string | null
          time_label: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          blurb?: string | null
          cancelled?: boolean
          created_at?: string
          end_at?: string | null
          event_id: string
          id?: string
          location?: string | null
          note?: string | null
          override_date: string
          start_at?: string | null
          time_label?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          blurb?: string | null
          cancelled?: boolean
          created_at?: string
          end_at?: string | null
          event_id?: string
          id?: string
          location?: string | null
          note?: string | null
          override_date?: string
          start_at?: string | null
          time_label?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_event_overrides_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "city_events"
            referencedColumns: ["id"]
          },
        ]
      }
      city_events: {
        Row: {
          active: boolean
          blurb: string | null
          city: Database["public"]["Enums"]["city_tag"]
          created_at: string
          date_label: string | null
          day_label: string | null
          end_at: string | null
          event_date: string | null
          id: string
          kind: string
          location: string | null
          recurrence: string
          recurrence_end: string | null
          sort_order: number
          start_at: string | null
          tag: string | null
          time_label: string | null
          title: string
          updated_at: string
          weekday: number | null
        }
        Insert: {
          active?: boolean
          blurb?: string | null
          city: Database["public"]["Enums"]["city_tag"]
          created_at?: string
          date_label?: string | null
          day_label?: string | null
          end_at?: string | null
          event_date?: string | null
          id?: string
          kind: string
          location?: string | null
          recurrence?: string
          recurrence_end?: string | null
          sort_order?: number
          start_at?: string | null
          tag?: string | null
          time_label?: string | null
          title: string
          updated_at?: string
          weekday?: number | null
        }
        Update: {
          active?: boolean
          blurb?: string | null
          city?: Database["public"]["Enums"]["city_tag"]
          created_at?: string
          date_label?: string | null
          day_label?: string | null
          end_at?: string | null
          event_date?: string | null
          id?: string
          kind?: string
          location?: string | null
          recurrence?: string
          recurrence_end?: string | null
          sort_order?: number
          start_at?: string | null
          tag?: string | null
          time_label?: string | null
          title?: string
          updated_at?: string
          weekday?: number | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          city: string
          created_at: string
          email: string
          handled: boolean
          id: string
          interest: string | null
          message: string
          name: string
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          email: string
          handled?: boolean
          id?: string
          interest?: string | null
          message: string
          name: string
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          email?: string
          handled?: boolean
          id?: string
          interest?: string | null
          message?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      devotionals: {
        Row: {
          author: string | null
          body: string
          created_at: string
          id: string
          published: boolean
          scripture_ref: string | null
          slug: string
          title: string
          updated_at: string
          week_of: string
        }
        Insert: {
          author?: string | null
          body: string
          created_at?: string
          id?: string
          published?: boolean
          scripture_ref?: string | null
          slug: string
          title: string
          updated_at?: string
          week_of: string
        }
        Update: {
          author?: string | null
          body?: string
          created_at?: string
          id?: string
          published?: boolean
          scripture_ref?: string | null
          slug?: string
          title?: string
          updated_at?: string
          week_of?: string
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          city: Database["public"]["Enums"]["city_tag"]
          created_at: string
          id: string
          is_active: boolean
          label: string | null
          public_url: string
          storage_path: string
          updated_at: string
        }
        Insert: {
          city: Database["public"]["Enums"]["city_tag"]
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string | null
          public_url: string
          storage_path: string
          updated_at?: string
        }
        Update: {
          city?: Database["public"]["Enums"]["city_tag"]
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string | null
          public_url?: string
          storage_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          created_at: string
          external_url: string | null
          height: number | null
          id: string
          kind: string
          label: string | null
          mime_type: string | null
          public_url: string
          storage_path: string | null
          thumbnail_url: string | null
          updated_at: string
          width: number | null
        }
        Insert: {
          created_at?: string
          external_url?: string | null
          height?: number | null
          id?: string
          kind?: string
          label?: string | null
          mime_type?: string | null
          public_url: string
          storage_path?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          created_at?: string
          external_url?: string | null
          height?: number | null
          id?: string
          kind?: string
          label?: string | null
          mime_type?: string | null
          public_url?: string
          storage_path?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          width?: number | null
        }
        Relationships: []
      }
      media_slots: {
        Row: {
          asset_id: string | null
          slot_key: string
          updated_at: string
        }
        Insert: {
          asset_id?: string | null
          slot_key: string
          updated_at?: string
        }
        Update: {
          asset_id?: string | null
          slot_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_slots_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          city_tag: Database["public"]["Enums"]["city_tag"] | null
          email: string
          id: string
          source: string | null
          subscribed_at: string
        }
        Insert: {
          city_tag?: Database["public"]["Enums"]["city_tag"] | null
          email: string
          id?: string
          source?: string | null
          subscribed_at?: string
        }
        Update: {
          city_tag?: Database["public"]["Enums"]["city_tag"] | null
          email?: string
          id?: string
          source?: string | null
          subscribed_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          body: string | null
          city_tag: Database["public"]["Enums"]["city_tag"]
          created_at: string
          description: string | null
          featured: boolean
          id: string
          media_url: string | null
          published: boolean
          published_at: string
          scripture_ref: string | null
          slug: string
          speaker_or_author: string | null
          thumbnail_url: string | null
          title: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at: string
        }
        Insert: {
          body?: string | null
          city_tag?: Database["public"]["Enums"]["city_tag"]
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          media_url?: string | null
          published?: boolean
          published_at?: string
          scripture_ref?: string | null
          slug: string
          speaker_or_author?: string | null
          thumbnail_url?: string | null
          title: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
        }
        Update: {
          body?: string | null
          city_tag?: Database["public"]["Enums"]["city_tag"]
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          media_url?: string | null
          published?: boolean
          published_at?: string
          scripture_ref?: string | null
          slug?: string
          speaker_or_author?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
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
      app_role: "admin" | "editor"
      city_tag: "milano" | "bologna" | "napoli" | "sicilia" | "national"
      resource_type: "sermon" | "article" | "video" | "podcast" | "pdf"
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
      app_role: ["admin", "editor"],
      city_tag: ["milano", "bologna", "napoli", "sicilia", "national"],
      resource_type: ["sermon", "article", "video", "podcast", "pdf"],
    },
  },
} as const
