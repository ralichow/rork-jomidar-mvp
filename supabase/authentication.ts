
import { supabase } from './config'
import { getRowCount, supabaseErrTrace, supabaseReqTrace, supabaseResTrace } from './devLogs'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'

export interface AuthUser {
  id: string
  email: string
  full_name?: string
  user_type: 'landlord' | 'tenant'
}

function extractTokensFromUrl(url: string): { access_token?: string; refresh_token?: string } {
  // Supabase appends tokens as hash fragment: #access_token=...&refresh_token=...
  const hashIndex = url.indexOf('#')
  if (hashIndex === -1) return {}
  const fragment = url.substring(hashIndex + 1)
  const params = new URLSearchParams(fragment)
  return {
    access_token: params.get('access_token') ?? undefined,
    refresh_token: params.get('refresh_token') ?? undefined,
  }
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
      const redirectTo = Linking.createURL('auth/callback')

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      })

      if (error) {
        supabaseErrTrace('auth', 'signInWithOAuth', error)
        return { data: null, error: error.message }
      }

      if (!data?.url) {
        return { data: null, error: 'No OAuth URL returned' }
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)

      if (result.type !== 'success') {
        return { data: null, error: result.type === 'cancel' ? 'Sign in cancelled' : 'Sign in failed' }
      }

      const { access_token, refresh_token } = extractTokensFromUrl(result.url)

      if (!access_token || !refresh_token) {
        return { data: null, error: 'No tokens received from Google sign in' }
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })

      if (sessionError) {
        supabaseErrTrace('auth', 'setSession', sessionError)
        return { data: null, error: sessionError.message }
      }

      supabaseResTrace('auth', 'signInWithOAuth', { provider: 'google', userId: sessionData.user?.id })
      return { data: sessionData, error: null }
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

  // Send OTP to phone number
  async signInWithPhone(phone: string) {
    supabaseReqTrace('auth', 'signInWithOtp', { phone })

    try {
      // Validate E.164 format
      const e164Regex = /^\+[1-9]\d{7,14}$/
      if (!e164Regex.test(phone)) {
        return { data: null, error: 'Please enter a valid phone number in international format (e.g. +8801XXXXXXXXX)' }
      }

      const { data, error } = await supabase.auth.signInWithOtp({ phone })

      if (error) {
        supabaseErrTrace('auth', 'signInWithOtp', error)
        return { data: null, error: error.message }
      }

      supabaseResTrace('auth', 'signInWithOtp', { phone, messageId: data?.messageId })
      return { data, error: null }
    } catch (error: any) {
      supabaseErrTrace('auth', 'signInWithOtp', error)
      return { data: null, error: error?.message ?? String(error) }
    }
  },

  // Verify phone OTP
  async verifyPhoneOtp(phone: string, token: string) {
    supabaseReqTrace('auth', 'verifyOtp', { phone, tokenLength: token.length })

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      })

      if (error) {
        supabaseErrTrace('auth', 'verifyOtp', error)

        // Map common Supabase error messages to user-friendly ones
        const msg = error.message.toLowerCase()
        if (msg.includes('expired') || msg.includes('otp has expired')) {
          return { data: null, error: 'OTP has expired. Please request a new one.' }
        }
        if (msg.includes('invalid') || msg.includes('token')) {
          return { data: null, error: 'Invalid OTP. Please check and try again.' }
        }
        return { data: null, error: error.message }
      }

      supabaseResTrace('auth', 'verifyOtp', { userId: data.user?.id, phone: data.user?.phone })
      return { data, error: null }
    } catch (error: any) {
      supabaseErrTrace('auth', 'verifyOtp', error)
      return { data: null, error: error?.message ?? String(error) }
    }
  },
}