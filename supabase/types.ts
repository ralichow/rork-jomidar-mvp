export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          user_type: 'landlord' | 'tenant'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          user_type?: 'landlord' | 'tenant'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          user_type?: 'landlord' | 'tenant'
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          landlord_id: string | null
          name: string
          address: string
          city: string | null
          state: string | null
          zip_code: string | null
          property_type: 'apartment' | 'house' | 'condo' | 'commercial'
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          landlord_id?: string | null
          name: string
          address: string
          city?: string | null
          state?: string | null
          zip_code?: string | null
          property_type?: 'apartment' | 'house' | 'condo' | 'commercial'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          landlord_id?: string | null
          name?: string
          address?: string
          city?: string | null
          state?: string | null
          zip_code?: string | null
          property_type?: 'apartment' | 'house' | 'condo' | 'commercial'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      units: {
        Row: {
          id: string
          property_id: string | null
          unit_number: string
          bedrooms: number
          bathrooms: number
          square_feet: number | null
          rent_amount: number
          security_deposit: number
          status: 'available' | 'occupied' | 'maintenance'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          unit_number: string
          bedrooms?: number
          bathrooms?: number
          square_feet?: number | null
          rent_amount: number
          security_deposit?: number
          status?: 'available' | 'occupied' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          unit_number?: string
          bedrooms?: number
          bathrooms?: number
          square_feet?: number | null
          rent_amount?: number
          security_deposit?: number
          status?: 'available' | 'occupied' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
      }
      leases: {
        Row: {
          id: string
          unit_id: string | null
          tenant_id: string | null
          start_date: string
          end_date: string
          monthly_rent: number
          security_deposit: number
          status: 'active' | 'expired' | 'terminated'
          lease_terms: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id?: string | null
          tenant_id?: string | null
          start_date: string
          end_date: string
          monthly_rent: number
          security_deposit?: number
          status?: 'active' | 'expired' | 'terminated'
          lease_terms?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string | null
          tenant_id?: string | null
          start_date?: string
          end_date?: string
          monthly_rent?: number
          security_deposit?: number
          status?: 'active' | 'expired' | 'terminated'
          lease_terms?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          lease_id: string | null
          tenant_id: string | null
          landlord_id: string | null
          amount: number
          payment_date: string | null
          due_date: string
          payment_type: 'rent' | 'security_deposit' | 'late_fee' | 'maintenance' | 'other'
          payment_method: 'cash' | 'check' | 'bank_transfer' | 'card' | 'digital' | null
          status: 'pending' | 'completed' | 'failed' | 'overdue'
          receipt_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lease_id?: string | null
          tenant_id?: string | null
          landlord_id?: string | null
          amount: number
          payment_date?: string | null
          due_date: string
          payment_type?: 'rent' | 'security_deposit' | 'late_fee' | 'maintenance' | 'other'
          payment_method?: 'cash' | 'check' | 'bank_transfer' | 'card' | 'digital' | null
          status?: 'pending' | 'completed' | 'failed' | 'overdue'
          receipt_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lease_id?: string | null
          tenant_id?: string | null
          landlord_id?: string | null
          amount?: number
          payment_date?: string | null
          due_date?: string
          payment_type?: 'rent' | 'security_deposit' | 'late_fee' | 'maintenance' | 'other'
          payment_method?: 'cash' | 'check' | 'bank_transfer' | 'card' | 'digital' | null
          status?: 'pending' | 'completed' | 'failed' | 'overdue'
          receipt_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          property_id: string | null
          unit_id: string | null
          tenant_id: string | null
          landlord_id: string | null
          document_type: 'lease' | 'receipt' | 'maintenance_request' | 'inspection' | 'other'
          title: string
          description: string | null
          file_url: string
          file_size: number | null
          mime_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          unit_id?: string | null
          tenant_id?: string | null
          landlord_id?: string | null
          document_type?: 'lease' | 'receipt' | 'maintenance_request' | 'inspection' | 'other'
          title: string
          description?: string | null
          file_url: string
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          unit_id?: string | null
          tenant_id?: string | null
          landlord_id?: string | null
          document_type?: 'lease' | 'receipt' | 'maintenance_request' | 'inspection' | 'other'
          title?: string
          description?: string | null
          file_url?: string
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: 'landlord' | 'tenant'
      property_type: 'apartment' | 'house' | 'condo' | 'commercial'
      unit_status: 'available' | 'occupied' | 'maintenance'
      lease_status: 'active' | 'expired' | 'terminated'
      payment_type: 'rent' | 'security_deposit' | 'late_fee' | 'maintenance' | 'other'
      payment_method: 'cash' | 'check' | 'bank_transfer' | 'card' | 'digital'
      payment_status: 'pending' | 'completed' | 'failed' | 'overdue'
      document_type: 'lease' | 'receipt' | 'maintenance_request' | 'inspection' | 'other'
    }
  }
}