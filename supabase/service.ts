import { supabase } from './config'
import { Database } from './types'
import { getRowCount, supabaseErrTrace, supabaseReqTrace, supabaseResTrace } from './devLogs'

type Property = Database['public']['Tables']['properties']['Row']
type Unit = Database['public']['Tables']['units']['Row']
type Payment = Database['public']['Tables']['payments']['Row']
type Lease = Database['public']['Tables']['leases']['Row']

export const databaseService = {
  // Properties
  async getProperties(landlordId: string) {
    supabaseReqTrace('properties', 'select', { landlord_id: landlordId, order: 'created_at desc' })

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false })

      if (error) {
        supabaseErrTrace('properties', 'select', error)
        return { data, error }
      }

      supabaseResTrace('properties', 'select', { rows: getRowCount(data), landlord_id: landlordId })
      return { data, error }
    } catch (error: any) {
      supabaseErrTrace('properties', 'select', error)
      return { data: null, error }
    }
  },

  async createProperty(property: Database['public']['Tables']['properties']['Insert']) {
    supabaseReqTrace('properties', 'insert', {
      landlord_id: property.landlord_id ?? null,
      name: property.name,
      property_type: property.property_type ?? null,
    })

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single()

      if (error) {
        supabaseErrTrace('properties', 'insert', error)
        return { data, error }
      }

      supabaseResTrace('properties', 'insert', {
        id: (data as any)?.id,
        rows: getRowCount(data),
      })
      return { data, error }
    } catch (error: any) {
      supabaseErrTrace('properties', 'insert', error)
      return { data: null, error }
    }
  },

  async updateProperty(id: string, updates: Database['public']['Tables']['properties']['Update']) {
    supabaseReqTrace('properties', 'update', { id, fields: Object.keys(updates ?? {}) })

    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        supabaseErrTrace('properties', 'update', error)
        return { data, error }
      }

      supabaseResTrace('properties', 'update', { id: (data as any)?.id, rows: getRowCount(data) })
      return { data, error }
    } catch (error: any) {
      supabaseErrTrace('properties', 'update', error)
      return { data: null, error }
    }
  },

  async deleteProperty(id: string) {
    supabaseReqTrace('properties', 'delete', { id })

    try {
      const { error } = await supabase.from('properties').delete().eq('id', id)

      if (error) {
        supabaseErrTrace('properties', 'delete', error)
        return { error }
      }

      supabaseResTrace('properties', 'delete', { id, ok: true })
      return { error }
    } catch (error: any) {
      supabaseErrTrace('properties', 'delete', error)
      return { error }
    }
  },

  // Units
  async getUnits(propertyId: string) {
    supabaseReqTrace('units', 'select', { property_id: propertyId, order: 'unit_number' })

    try {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('property_id', propertyId)
        .order('unit_number')

      if (error) {
        supabaseErrTrace('units', 'select', error)
        return { data, error }
      }

      supabaseResTrace('units', 'select', { rows: getRowCount(data), property_id: propertyId })
      return { data, error }
    } catch (error: any) {
      supabaseErrTrace('units', 'select', error)
      return { data: null, error }
    }
  },

  async createUnit(unit: Database['public']['Tables']['units']['Insert']) {
    supabaseReqTrace('units', 'insert', {
      property_id: unit.property_id ?? null,
      unit_number: unit.unit_number,
      status: unit.status ?? null,
    })

    try {
      const { data, error } = await supabase
        .from('units')
        .insert(unit)
        .select()
        .single()

      if (error) {
        supabaseErrTrace('units', 'insert', error)
        return { data, error }
      }

      supabaseResTrace('units', 'insert', { id: (data as any)?.id, rows: getRowCount(data) })
      return { data, error }
    } catch (error: any) {
      supabaseErrTrace('units', 'insert', error)
      return { data: null, error }
    }
  },

  // Payments
  async getPayments(landlordId: string) {
    supabaseReqTrace('payments', 'select', { landlord_id: landlordId, order: 'due_date desc' })

    try {
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

      if (error) {
        supabaseErrTrace('payments', 'select', error)
        return { data, error }
      }

      supabaseResTrace('payments', 'select', { rows: getRowCount(data), landlord_id: landlordId })
      return { data, error }
    } catch (error: any) {
      supabaseErrTrace('payments', 'select', error)
      return { data: null, error }
    }
  },

  async createPayment(payment: Database['public']['Tables']['payments']['Insert']) {
    supabaseReqTrace('payments', 'insert', {
      tenant_id: payment.tenant_id ?? null,
      lease_id: payment.lease_id ?? null,
      landlord_id: payment.landlord_id ?? null,
      amount: payment.amount,
      status: payment.status ?? null,
      payment_type: payment.payment_type ?? null,
    })

    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single()

      if (error) {
        supabaseErrTrace('payments', 'insert', error)
        return { data, error }
      }

      supabaseResTrace('payments', 'insert', { id: (data as any)?.id, rows: getRowCount(data) })
      return { data, error }
    } catch (error: any) {
      supabaseErrTrace('payments', 'insert', error)
      return { data: null, error }
    }
  },

  async updatePaymentStatus(id: string, status: 'pending' | 'completed' | 'failed' | 'overdue') {
    supabaseReqTrace('payments', 'update_status', { id, status })

    try {
      const { data, error } = await supabase
        .from('payments')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        supabaseErrTrace('payments', 'update_status', error)
        return { data, error }
      }

      supabaseResTrace('payments', 'update_status', { id: (data as any)?.id, rows: getRowCount(data) })
      return { data, error }
    } catch (error: any) {
      supabaseErrTrace('payments', 'update_status', error)
      return { data: null, error }
    }
  },

  // Tenants
  async getTenants(landlordId: string) {
    supabaseReqTrace('leases', 'select_active_tenants', { landlord_id: landlordId, status: 'active' })

    try {
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

      if (error) {
        supabaseErrTrace('leases', 'select_active_tenants', error)
        return { data, error }
      }

      supabaseResTrace('leases', 'select_active_tenants', { rows: getRowCount(data), landlord_id: landlordId })
      return { data, error }
    } catch (error: any) {
      supabaseErrTrace('leases', 'select_active_tenants', error)
      return { data: null, error }
    }
  },

  // Documents
  async uploadDocument(file: any, path: string) {
    supabaseReqTrace('documents', 'storage_upload', {
      path,
      fileUri: file?.uri,
      fileName: file?.name ?? file?.fileName,
      fileSize: file?.size ?? null,
    })

    try {
      const { data, error } = await supabase.storage.from('documents').upload(path, file)

      if (error) {
        supabaseErrTrace('documents', 'storage_upload', error)
        return { data, error }
      }

      supabaseResTrace('documents', 'storage_upload', { path, ok: true })
      return { data, error }
    } catch (error: any) {
      supabaseErrTrace('documents', 'storage_upload', error)
      return { data: null, error }
    }
  },

  async getDocuments(landlordId: string) {
    supabaseReqTrace('documents', 'select', { landlord_id: landlordId, order: 'created_at desc' })

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false })

      if (error) {
        supabaseErrTrace('documents', 'select', error)
        return { data, error }
      }

      supabaseResTrace('documents', 'select', { rows: getRowCount(data), landlord_id: landlordId })
      return { data, error }
    } catch (error: any) {
      supabaseErrTrace('documents', 'select', error)
      return { data: null, error }
    }
  },
}