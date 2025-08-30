import { create } from 'zustand';
import { supabase } from '@/utils/supabase';
import { Property, Tenant, Document } from '@/types';

type AppState = {
  properties: Property[];
  tenants: Tenant[];
  documents: Document[];
  fetchProperties: () => Promise<void>;
  fetchTenants: () => Promise<void>;
  fetchDocuments: () => Promise<void>;
};

export const useAppStore = create<AppState>((set) => ({
  properties: [],
  tenants: [],
  documents: [],

  fetchProperties: async () => {
    const { data, error } = await supabase.from('properties').select('*');
    if (error) console.error(error);
    else set({ properties: data });
  },

  fetchTenants: async () => {
    const { data, error } = await supabase.from('tenants').select('*');
    if (error) console.error(error);
    else set({ tenants: data });
  },

  fetchDocuments: async () => {
    const { data, error } = await supabase.from('documents').select('*');
    if (error) console.error(error);
    else set({ documents: data });
  },
}));
