import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (mobile: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, mobile: string, password: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setAuthFromSupabase: (user: { id: string; email?: string; user_metadata?: any } | null) => void;
}

// Mock user database - in a real app, this would be handled by your backend
const mockUsers: Array<{ mobile: string; password: string; user: User }> = [
  {
    mobile: '01700000000',
    password: 'demo123',
    user: {
      id: '1',
      name: 'Demo User',
      mobile: '01700000000',
      email: 'demo@example.com',
      createdAt: new Date().toISOString()
    }
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (mobile: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Validate mobile number format (Bangladesh format)
        const mobileRegex = /^01[3-9]\d{8}$/;
        if (!mobileRegex.test(mobile)) {
          set({ isLoading: false });
          return { success: false, error: 'Please enter a valid mobile number' };
        }
        
        // Check credentials
        const userRecord = mockUsers.find(u => u.mobile === mobile && u.password === password);
        
        if (userRecord) {
          set({ 
            user: userRecord.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return { success: true };
        } else {
          set({ isLoading: false });
          return { success: false, error: 'Invalid mobile number or password' };
        }
      },
      
      signup: async (name: string, mobile: string, password: string, email?: string) => {
        set({ isLoading: true });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Validate inputs
        if (name.trim().length < 2) {
          set({ isLoading: false });
          return { success: false, error: 'Name must be at least 2 characters long' };
        }
        
        const mobileRegex = /^01[3-9]\d{8}$/;
        if (!mobileRegex.test(mobile)) {
          set({ isLoading: false });
          return { success: false, error: 'Please enter a valid mobile number' };
        }
        
        if (password.length < 6) {
          set({ isLoading: false });
          return { success: false, error: 'Password must be at least 6 characters long' };
        }
        
        // Check if user already exists
        const existingUser = mockUsers.find(u => u.mobile === mobile);
        if (existingUser) {
          set({ isLoading: false });
          return { success: false, error: 'An account with this mobile number already exists' };
        }
        
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          name: name.trim(),
          mobile,
          email: email?.trim() || undefined,
          createdAt: new Date().toISOString()
        };
        
        // Add to mock database
        mockUsers.push({
          mobile,
          password,
          user: newUser
        });
        
        set({ 
          user: newUser, 
          isAuthenticated: true, 
          isLoading: false 
        });
        
        return { success: true };
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setAuthFromSupabase: (supabaseUser) => {
        if (!supabaseUser) {
          set({
            user: null,
            isAuthenticated: false,
          });
          return;
        }

        const metadata = supabaseUser.user_metadata || {};
        const nameFromMetadata =
          (typeof metadata.full_name === 'string' && metadata.full_name.trim()) ||
          (typeof metadata.name === 'string' && metadata.name.trim()) ||
          undefined;

        const currentUser = get().user;

        const mappedUser: User = {
          id: supabaseUser.id,
          name: nameFromMetadata || currentUser?.name || supabaseUser.email || 'User',
          mobile: currentUser?.mobile || '',
          email: supabaseUser.email ?? currentUser?.email,
          createdAt: currentUser?.createdAt || new Date().toISOString(),
        };

        set({
          user: mappedUser,
          isAuthenticated: true,
        });
      }
    }),
    {
      name: 'jomidar-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);