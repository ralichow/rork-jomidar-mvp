import { supabase } from './config'
import { Database } from './types'

type Property = Database['public']['Tables']['properties']['Row']
type Unit = Database['public']['Tables']['units']['Row']
type Payment = Database['public']['Tables']['payments']['Row']
type Lease = Database['public']['Tables']['leases']['Row']

export const databaseService = {
  // Properties
  async getProperties(landlordId: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  async createProperty(property: Database['public']['Tables']['properties']['Insert']) {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single()

    return { data, error }
  },

  async updateProperty(id: string, updates: Database['public']['Tables']['properties']['Update']) {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  },

  async deleteProperty(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    return { error }
  },

  // Units
  async getUnits(propertyId: string) {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('property_id', propertyId)
      .order('unit_number')

    return { data, error }
  },

  async createUnit(unit: Database['public']['Tables']['units']['Insert']) {
    const { data, error } = await supabase
      .from('units')
      .insert(unit)
      .select()
      .single()

    return { data, error }
  },

  // Payments
  async getPayments(landlordId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        leases (
          units (
            unit_number,
            properties (name)
          )
        ),
        profiles!payments_tenant_id_fkey (full_name)
      `)
      .eq('landlord_id', landlordId)
      .order('due_date', { ascending: false })

    return { data, error }
  },

  async createPayment(payment: Database['public']['Tables']['payments']['Insert']) {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single()

    return { data, error }
  },

  async updatePaymentStatus(id: string, status: 'pending' | 'completed' | 'failed' | 'overdue') {
    const { data, error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  },

  // Tenants
  async getTenants(landlordId: string) {
    const { data, error } = await supabase
      .from('leases')
      .select(`
        tenant_id,
        profiles!leases_tenant_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        units (
          unit_number,
          properties!units_property_id_fkey (
            name,
            address
          )
        )
      `)
      .eq('status', 'active')
      .in('units.properties.landlord_id', [landlordId])

    return { data, error }
  },

  // Documents
  async uploadDocument(file: any, path: string) {
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(path, file)

    return { data, error }
  },

  async getDocuments(landlordId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false })

    return { data, error }
  },
}