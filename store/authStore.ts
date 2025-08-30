import { create } from 'zustand';
import { supabase } from '@/utils/supabase';

type AuthState = {
  user: any;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  signUp: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) console.error(error);
    set({ user: data.user, loading: false });
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error(error);
    set({ user: data.user, loading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    set({ user });
  },
}));
