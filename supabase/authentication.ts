
import { supabase } from './config'
import { getRowCount, supabaseErrTrace, supabaseReqTrace, supabaseResTrace } from './devLogs'

export interface AuthUser {
  id: string
  email: string
  full_name?: string
  user_type: 'landlord' | 'tenant'
}

export const authService = {
  // Sign up with email
  async signUp(email: string, password: string, fullName: string, userType: 'landlord' | 'tenant') {
    supabaseReqTrace('auth', 'signUp', { email, userType, hasFullName: !!fullName })

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      })

      if (error) {
        supabaseErrTrace('auth', 'signUp', error)
        return { data: null, error: error.message }
      }

      supabaseResTrace('auth', 'signUp', {
        userId: data.user?.id,
        email: data.user?.email,
        rows: getRowCount(data),
      })

      // Supabase can return a masked user with no identities when the email is already registered.
      const userIdentities = (data.user as any)?.identities
      if (Array.isArray(userIdentities) && userIdentities.length === 0) {
        const duplicateEmailError = 'An account with this email already exists. Please sign in instead.'
        supabaseErrTrace('auth', 'signUp', duplicateEmailError)
        return { data: null, error: duplicateEmailError }
      }

      return { data, error: null }
    } catch (error: any) {
      supabaseErrTrace('auth', 'signUp', error)
      return { data: null, error: error?.message ?? String(error) }
    }
  },

  // Sign in with email
  async signIn(email: string, password: string) {
    supabaseReqTrace('auth', 'signInWithPassword', { email })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        supabaseErrTrace('auth', 'signInWithPassword', error)
        return { data: null, error: error.message }
      }

      supabaseResTrace('auth', 'signInWithPassword', { userId: data.user?.id, email: data.user?.email })
      return { data, error: null }
    } catch (error: any) {
      supabaseErrTrace('auth', 'signInWithPassword', error)
      return { data: null, error: error?.message ?? String(error) }
    }
  },

  // Sign in with Google
  async signInWithGoogle() {
    supabaseReqTrace('auth', 'signInWithOAuth', { provider: 'google' })

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'your-app://auth/callback',
        },
      })

      if (error) {
        supabaseErrTrace('auth', 'signInWithOAuth', error)
        return { data: null, error: error.message }
      }

      supabaseResTrace('auth', 'signInWithOAuth', { url: data?.url, provider: 'google' })
      return { data, error: null }
    } catch (error: any) {
      supabaseErrTrace('auth', 'signInWithOAuth', error)
      return { data: null, error: error?.message ?? String(error) }
    }
  },

  // Sign in with Facebook
  async signInWithFacebook() {
    supabaseReqTrace('auth', 'signInWithOAuth', { provider: 'facebook' })

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: 'your-app://auth/callback',
        },
      })

      if (error) {
        supabaseErrTrace('auth', 'signInWithOAuth', error)
        return { data: null, error: error.message }
      }

      supabaseResTrace('auth', 'signInWithOAuth', { url: data?.url, provider: 'facebook' })
      return { data, error: null }
    } catch (error: any) {
      supabaseErrTrace('auth', 'signInWithOAuth', error)
      return { data: null, error: error?.message ?? String(error) }
    }
  },

  // Sign out
  async signOut() {
    supabaseReqTrace('auth', 'signOut', '-')

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        supabaseErrTrace('auth', 'signOut', error)
        return { error: error.message }
      }

      supabaseResTrace('auth', 'signOut', { ok: true })
      return { error: null }
    } catch (error: any) {
      supabaseErrTrace('auth', 'signOut', error)
      return { error: error?.message ?? String(error) }
    }
  },

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    supabaseReqTrace('auth', 'getUser', '-')

    try {
      const { data, error } = await supabase.auth.getUser()
      const user = data?.user

      if (error) {
        supabaseErrTrace('auth', 'getUser', error)
        return null
      }

      if (!user) {
        supabaseResTrace('auth', 'getUser', { hasUser: false })
        return null
      }

      supabaseResTrace('auth', 'getUser', { hasUser: true, userId: user.id })

      supabaseReqTrace('profiles', 'select_single', { id: user.id })
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        supabaseErrTrace('profiles', 'select_single', profileError)
        return null
      }

      if (!profile) return null

      supabaseResTrace('profiles', 'select_single', { id: profile.id, userType: profile.user_type })

      return {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        user_type: profile.user_type,
      }
    } catch (error: any) {
      supabaseErrTrace('auth', 'getCurrentUser', error)
      return null
    }
  },
}