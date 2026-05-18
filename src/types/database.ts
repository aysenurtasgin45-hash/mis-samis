export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          role: 'citizen' | 'municipality_staff' | 'field_officer_vet' | 'adoption_officer' | 'ministry_official' | 'system_admin';
          auth_level: number;
          municipality_id: string | null;
          facility_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          role?: Database['public']['Tables']['profiles']['Row']['role'];
          auth_level?: number;
          municipality_id?: string | null;
          facility_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      citizens: {
        Row: {
          user_id: string;
          tc_kimlik_no: string;
          address: string | null;
          housing_type: 'Apartment' | 'House' | 'House_with_Garden' | null;
          has_garden: boolean;
          prev_ownership_exp: number;
          responsible_training: boolean;
          financial_status: string | null;
        };
        Insert: Database['public']['Tables']['citizens']['Row'];
        Update: Partial<Database['public']['Tables']['citizens']['Insert']>;
      };
      municipalities: {
        Row: {
          mun_id: string;
          name: string;
          city: string;
          district: string | null;
          total_capacity: number | null;
          contact_email: string | null;
          is_active: boolean;
        };
        Insert: Partial<Database['public']['Tables']['municipalities']['Row']> & Pick<Database['public']['Tables']['municipalities']['Row'], 'name' | 'city'>;
        Update: Partial<Database['public']['Tables']['municipalities']['Insert']>;
      };
      facilities: {
        Row: {
          facility_id: string;
          municipality_id: string;
          name: string;
          facility_type: 'Shelter' | 'Rehab' | 'VetClinic';
          capacity: number;
          current_occupancy: number;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          alert_threshold: number | null;
          is_active: boolean;
        };
        Insert: Partial<Database['public']['Tables']['facilities']['Row']> & Pick<Database['public']['Tables']['facilities']['Row'], 'municipality_id' | 'name' | 'facility_type' | 'capacity'>;
        Update: Partial<Database['public']['Tables']['facilities']['Insert']>;
      };
      animals: {
        Row: {
          animal_id: string;
          microchip_id: string;
          name: string | null;
          species: 'Dog' | 'Cat' | 'Other';
          breed: string | null;
          age_estimate: number | null;
          sex: 'M' | 'F';
          sterilization_status: boolean;
          color_markings: string | null;
          status: 'Active' | 'In_Shelter' | 'Adopted' | 'Deceased' | 'Released';
          photo_url: string | null;
          entry_date: string;
          municipality_id: string;
          current_facility_id: string | null;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['animals']['Row']> & Pick<Database['public']['Tables']['animals']['Row'], 'microchip_id' | 'species' | 'sex' | 'municipality_id'>;
        Update: Partial<Database['public']['Tables']['animals']['Insert']>;
      };
      complaints: {
        Row: {
          complaint_id: string;
          incident_type: 'Bite' | 'Aggressive' | 'Sick_Injured' | 'Nuisance' | 'Lost' | 'Found' | 'Other';
          description: string;
          location_lat: number | null;
          location_lng: number | null;
          location_address: string | null;
          animal_id: string | null;
          submitted_by: string | null;
          responsible_mun_id: string | null;
          assigned_to: string | null;
          status: 'Open' | 'Assigned' | 'In_Progress' | 'Resolved' | 'Closed';
          submitted_at: string;
          resolved_at: string | null;
          resolution_notes: string | null;
        };
        Insert: Partial<Database['public']['Tables']['complaints']['Row']> & Pick<Database['public']['Tables']['complaints']['Row'], 'incident_type' | 'description'>;
        Update: Partial<Database['public']['Tables']['complaints']['Insert']>;
      };
      adoptions: {
        Row: {
          adoption_id: string;
          animal_id: string;
          adopter_id: string;
          adoption_officer_id: string | null;
          application_date: string;
          approval_date: string | null;
          status: 'Pending' | 'Approved' | 'Rejected' | 'Returned' | 'Completed';
          match_score: number | null;
          checkin_count: number;
          last_checkin_date: string | null;
          checkin_notes: string | null;
          rejection_reason: string | null;
        };
        Insert: Partial<Database['public']['Tables']['adoptions']['Row']> & Pick<Database['public']['Tables']['adoptions']['Row'], 'animal_id' | 'adopter_id'>;
        Update: Partial<Database['public']['Tables']['adoptions']['Insert']>;
      };
      operations: {
        Row: {
          operation_id: string;
          animal_id: string;
          operation_type: 'Catch' | 'CNVR' | 'Treatment' | 'Relocation' | 'Release' | 'Euthanasia';
          operation_date: string;
          location_lat: number | null;
          location_lng: number | null;
          result: string | null;
          notes: string | null;
          responsible_mun_id: string | null;
          staff_user_id: string | null;
        };
        Insert: Partial<Database['public']['Tables']['operations']['Row']> & Pick<Database['public']['Tables']['operations']['Row'], 'animal_id' | 'operation_type'>;
        Update: Partial<Database['public']['Tables']['operations']['Insert']>;
      };
    };
    Views: {
      animal_directory: {
        Row: Database['public']['Tables']['animals']['Row'] & {
          city: string | null;
          district: string | null;
          facility_name: string | null;
        };
      };
      analytics_monthly_registrations: {
        Row: { month: string; count: number };
      };
      analytics_status_distribution: {
        Row: { name: string; value: number; color: string };
      };
      analytics_kpis: {
        Row: { key: string; title: string; value: string; trend: string; is_up: boolean };
      };
      municipality_performance: {
        Row: { name: string; city: string; count: number; progress: number };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
