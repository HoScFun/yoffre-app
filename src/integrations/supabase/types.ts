export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          agence: string
          carte_t: string | null
          created_at: string | null
          email: string
          id: string
          nom: string
          offer_id: string
          telephone: string | null
        }
        Insert: {
          agence: string
          carte_t?: string | null
          created_at?: string | null
          email: string
          id?: string
          nom: string
          offer_id: string
          telephone?: string | null
        }
        Update: {
          agence?: string
          carte_t?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nom?: string
          offer_id?: string
          telephone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      clauses: {
        Row: {
          active: boolean | null
          base_legale: string | null
          description: string
          id: number
          obligatoire: boolean | null
          ordre: number | null
          profils: string[] | null
          tier: string | null
          title: string
        }
        Insert: {
          active?: boolean | null
          base_legale?: string | null
          description: string
          id?: number
          obligatoire?: boolean | null
          ordre?: number | null
          profils?: string[] | null
          tier?: string | null
          title: string
        }
        Update: {
          active?: boolean | null
          base_legale?: string | null
          description?: string
          id?: number
          obligatoire?: boolean | null
          ordre?: number | null
          profils?: string[] | null
          tier?: string | null
          title?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          bien_type: string | null
          created_at: string | null
          email: string
          id: string
          localisation: string | null
          montant: number | null
          offer_id: string | null
          offre_envoyee: boolean | null
          source: string | null
          telephone: string | null
        }
        Insert: {
          bien_type?: string | null
          created_at?: string | null
          email: string
          id?: string
          localisation?: string | null
          montant?: number | null
          offer_id?: string | null
          offre_envoyee?: boolean | null
          source?: string | null
          telephone?: string | null
        }
        Update: {
          bien_type?: string | null
          created_at?: string | null
          email?: string
          id?: string
          localisation?: string | null
          montant?: number | null
          offer_id?: string | null
          offre_envoyee?: boolean | null
          source?: string | null
          telephone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_clauses: {
        Row: {
          clause_id: number | null
          created_at: string | null
          id: number
          notes_custom: string | null
          offer_id: string | null
          valeur_duree_pret: number | null
          valeur_montant_pret: number | null
          valeur_taux_max: number | null
        }
        Insert: {
          clause_id?: number | null
          created_at?: string | null
          id?: number
          notes_custom?: string | null
          offer_id?: string | null
          valeur_duree_pret?: number | null
          valeur_montant_pret?: number | null
          valeur_taux_max?: number | null
        }
        Update: {
          clause_id?: number | null
          created_at?: string | null
          id?: number
          notes_custom?: string | null
          offer_id?: string | null
          valeur_duree_pret?: number | null
          valeur_montant_pret?: number | null
          valeur_taux_max?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_clauses_clause_id_fkey"
            columns: ["clause_id"]
            isOneToOne: false
            referencedRelation: "clauses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_clauses_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          acheteur_adresse: string | null
          acheteur_email: string
          acheteur_nom: string
          acheteur_telephone: string | null
          agent_immobilier: boolean | null
          bien_adresse: string
          bien_prix_affiche: number | null
          bien_prix_propose: number
          bien_type: string | null
          created_at: string | null
          delai_validite_jours: number | null
          disclaimer_accepted: boolean | null
          envoyer_au_vendeur: boolean | null
          financement: string | null
          financement_banque: string | null
          id: string
          message_vendeur: string | null
          notaire_email: string | null
          profil_type: string | null
          responded_at: string | null
          sent_at: string | null
          statut: string | null
          user_id: string | null
          vendeur_adresse: string | null
          vendeur_email: string
          vendeur_nom: string
          vendor_token: string
          vendor_token_expires_at: string | null
        }
        Insert: {
          acheteur_adresse?: string | null
          acheteur_email: string
          acheteur_nom: string
          acheteur_telephone?: string | null
          agent_immobilier?: boolean | null
          bien_adresse: string
          bien_prix_affiche?: number | null
          bien_prix_propose: number
          bien_type?: string | null
          created_at?: string | null
          delai_validite_jours?: number | null
          disclaimer_accepted?: boolean | null
          envoyer_au_vendeur?: boolean | null
          financement?: string | null
          financement_banque?: string | null
          id?: string
          message_vendeur?: string | null
          notaire_email?: string | null
          profil_type?: string | null
          responded_at?: string | null
          sent_at?: string | null
          statut?: string | null
          user_id?: string | null
          vendeur_adresse?: string | null
          vendeur_email: string
          vendeur_nom: string
          vendor_token?: string
          vendor_token_expires_at?: string | null
        }
        Update: {
          acheteur_adresse?: string | null
          acheteur_email?: string
          acheteur_nom?: string
          acheteur_telephone?: string | null
          agent_immobilier?: boolean | null
          bien_adresse?: string
          bien_prix_affiche?: number | null
          bien_prix_propose?: number
          bien_type?: string | null
          created_at?: string | null
          delai_validite_jours?: number | null
          disclaimer_accepted?: boolean | null
          envoyer_au_vendeur?: boolean | null
          financement?: string | null
          financement_banque?: string | null
          id?: string
          message_vendeur?: string | null
          notaire_email?: string | null
          profil_type?: string | null
          responded_at?: string | null
          sent_at?: string | null
          statut?: string | null
          user_id?: string | null
          vendeur_adresse?: string | null
          vendeur_email?: string
          vendeur_nom?: string
          vendor_token?: string
          vendor_token_expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_responses: {
        Row: {
          commentaire: string | null
          decision: string | null
          id: number
          ip_address: string | null
          offer_id: string | null
          responded_at: string | null
          vendeur_nom: string | null
        }
        Insert: {
          commentaire?: string | null
          decision?: string | null
          id?: number
          ip_address?: string | null
          offer_id?: string | null
          responded_at?: string | null
          vendeur_nom?: string | null
        }
        Update: {
          commentaire?: string | null
          decision?: string | null
          id?: number
          ip_address?: string | null
          offer_id?: string | null
          responded_at?: string | null
          vendeur_nom?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_responses_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: true
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_offer_by_token: { Args: { _token: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
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
      app_role: ["admin", "user"],
    },
  },
} as const
