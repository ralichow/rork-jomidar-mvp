import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { authService } from '@/supabase/authentication'
import { devFlowLog, useDevFlowMount } from '@/utils/devFlowLog'

type AuthMode = 'signIn' | 'signUp' | 'phone'
type PhoneStep = 'input' | 'otp'

const BD_PHONE_REGEX = /^01[3-9]\d{8}$/

// Test phone number and OTP configured in Supabase dashboard (Authentication → Phone → Test OTPs).
// These are only used to pre-fill inputs in __DEV__ builds — no SMS is sent for test numbers.
// const DEV_TEST_PHONE = '01700000000'
const DEV_TEST_PHONE = '01685174347'
const DEV_TEST_OTP = '111111'

function formatToE164(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '')
  if (digits.startsWith('880')) return `+${digits}`
  if (digits.startsWith('0')) return `+880${digits.substring(1)}`
  return `+880${digits}`
}

export default function LoginScreen() {
  useDevFlowMount('LoginScreen')

  // Shared state
  const [authMode, setAuthMode] = useState<AuthMode>('signIn')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Email auth state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [userType, setUserType] = useState<'landlord' | 'tenant'>('landlord')

  // Phone auth state — pre-fill with test values in dev mode
  const [phone, setPhone] = useState(__DEV__ ? DEV_TEST_PHONE : '')
  const [otpCode, setOtpCode] = useState('')
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('input')
  const [resendCooldown, setResendCooldown] = useState(0)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) {
      if (cooldownRef.current) {
        clearInterval(cooldownRef.current)
        cooldownRef.current = null
      }
      return
    }
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current)
          cooldownRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current)
    }
  }, [resendCooldown > 0])

  const startCooldown = useCallback(() => setResendCooldown(60), [])

  // ---------- Email Auth ----------
  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)
    devFlowLog('LoginScreen', `UI Trigger -> ${authMode === 'signUp' ? 'signUp' : 'signIn'} (email=${email})`)

    try {
      if (authMode === 'signUp') {
        if (!fullName) {
          Alert.alert('Error', 'Please enter your full name')
          return
        }

        const { data, error } = await authService.signUp(email, password, fullName, userType)

        if (error) {
          Alert.alert('Sign Up Error', error)
          devFlowLog('LoginScreen', 'State Updated -> SignUp failed (alert shown)')
        } else {
          Alert.alert('Success', 'Account created successfully! Please check your email to verify your account.')
          devFlowLog('LoginScreen', 'State Updated -> SignUp success (alert shown)')
        }
      } else {
        const { data, error } = await authService.signIn(email, password)

        if (error) {
          Alert.alert('Sign In Error', error)
          devFlowLog('LoginScreen', 'State Updated -> SignIn failed (alert shown)')
        } else {
          router.replace('/(tabs)')
          devFlowLog('LoginScreen', 'State Updated -> Navigated to /(tabs)')
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred')
      devFlowLog('LoginScreen', 'State Updated -> Unexpected error (alert shown)')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    devFlowLog('LoginScreen', 'UI Trigger -> signInWithGoogle')
    try {
      const { data, error } = await authService.signInWithGoogle()

      if (error) {
        if (error !== 'Sign in cancelled') {
          Alert.alert('Google Sign In Error', error)
        }
        devFlowLog('LoginScreen', `State Updated -> Google sign-in failed: ${error}`)
      } else {
        devFlowLog('LoginScreen', 'State Updated -> Google sign-in success')
        router.replace('/(tabs)')
      }
    } catch (e) {
      Alert.alert('Error', 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // ---------- Phone Auth ----------
  const handleSendOtp = async () => {
    const rawPhone = phone.trim()
    if (!BD_PHONE_REGEX.test(rawPhone)) {
      Alert.alert('Error', 'Please enter a valid Bangladesh phone number (e.g. 01XXXXXXXXX)')
      return
    }

    const e164Phone = formatToE164(rawPhone)
    setLoading(true)
    devFlowLog('LoginScreen', `UI Trigger -> signInWithPhone (phone=${e164Phone})`)

    try {
      const { data, error } = await authService.signInWithPhone(e164Phone)

      if (error) {
        Alert.alert('Error', error)
        devFlowLog('LoginScreen', `State Updated -> OTP send failed: ${error}`)
      } else {
        setPhoneStep('otp')
        setOtpCode(__DEV__ ? DEV_TEST_OTP : '')
        startCooldown()
        Alert.alert('OTP Sent', `A verification code has been sent to ${e164Phone}`)
        devFlowLog('LoginScreen', 'State Updated -> OTP sent, moved to otp step')
      }
    } catch (e) {
      Alert.alert('Error', 'An unexpected error occurred')
      devFlowLog('LoginScreen', 'State Updated -> OTP send unexpected error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    const trimmedOtp = otpCode.trim()
    if (trimmedOtp.length !== 6 || !/^\d{6}$/.test(trimmedOtp)) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP')
      return
    }

    const e164Phone = formatToE164(phone.trim())
    setLoading(true)
    devFlowLog('LoginScreen', `UI Trigger -> verifyPhoneOtp (phone=${e164Phone})`)

    try {
      const { data, error } = await authService.verifyPhoneOtp(e164Phone, trimmedOtp)

      if (error) {
        Alert.alert('Verification Error', error)
        devFlowLog('LoginScreen', `State Updated -> OTP verify failed: ${error}`)
      } else {
        devFlowLog('LoginScreen', 'State Updated -> Phone auth success, navigating to /(tabs)')
        router.replace('/(tabs)')
      }
    } catch (e) {
      Alert.alert('Error', 'An unexpected error occurred')
      devFlowLog('LoginScreen', 'State Updated -> OTP verify unexpected error')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    await handleSendOtp()
  }

  // ---------- Mode Switching ----------
  const switchToPhone = () => {
    setAuthMode('phone')
    setPhoneStep('input')
    setPhone(__DEV__ ? DEV_TEST_PHONE : '')
    setOtpCode('')
    setResendCooldown(0)
  }

  const switchToEmail = (mode: 'signIn' | 'signUp') => {
    setAuthMode(mode)
    setPhoneStep('input')
    setPhone('')
    setOtpCode('')
    setResendCooldown(0)
  }

  // ---------- Render ----------
  const isSignUp = authMode === 'signUp'
  const isPhone = authMode === 'phone'

  return (
    <View style={styles.container}>
      {/* Phone Auth Mode */}
      {isPhone ? (
        <>
          <Text style={styles.title}>
            {phoneStep === 'input' ? 'Phone Login' : 'Verify OTP'}
          </Text>

          {phoneStep === 'input' ? (
            <>
              {__DEV__ && (
                <View style={styles.devBanner}>
                  <Text style={styles.devBannerText}>
                    DEV MODE — Test: {DEV_TEST_PHONE} / OTP: {DEV_TEST_OTP}
                  </Text>
                </View>
              )}

              <TextInput
                style={styles.input}
                placeholder="01XXXXXXXXX"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
                maxLength={11}
              />
              <Text style={styles.hintText}>
                Bangladesh number without +880 (e.g. 01XXXXXXXXX)
              </Text>

              <TouchableOpacity
                style={[styles.button, styles.phoneButton]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.otpSentText}>
                OTP sent to {formatToE164(phone.trim())}
              </Text>

              {__DEV__ && (
                <View style={styles.devBanner}>
                  <Text style={styles.devBannerText}>
                    DEV MODE — Test OTP pre-filled: {DEV_TEST_OTP}
                  </Text>
                </View>
              )}

              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit OTP"
                value={otpCode}
                onChangeText={setOtpCode}
                keyboardType="number-pad"
                autoCapitalize="none"
                maxLength={6}
              />

              <TouchableOpacity
                style={[styles.button, styles.phoneButton]}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Text>
              </TouchableOpacity>

              <View style={styles.resendRow}>
                {resendCooldown > 0 ? (
                  <Text style={styles.resendCooldownText}>
                    Resend OTP in {resendCooldown}s
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  setPhoneStep('input')
                  setOtpCode('')
                }}
              >
                <Text style={styles.switchButtonText}>← Back</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.divider}>
            <Text style={styles.dividerText}>OR</Text>
          </View>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => switchToEmail('signIn')}
          >
            <Text style={styles.switchButtonText}>Use Email instead</Text>
          </TouchableOpacity>
        </>
      ) : (
        /* Email Auth Mode (Sign In / Sign Up) */
        <>
          <Text style={styles.title}>
            {isSignUp ? 'Create Account' : 'Log In'}
          </Text>

          {isSignUp && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />

              <View style={styles.userTypeContainer}>
                <TouchableOpacity
                  style={[styles.userTypeButton, userType === 'landlord' && styles.userTypeActive]}
                  onPress={() => setUserType('landlord')}
                >
                  <Text style={[styles.userTypeText, userType === 'landlord' && styles.userTypeActiveText]}>
                    Landlord
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.userTypeButton, userType === 'tenant' && styles.userTypeActive]}
                  onPress={() => setUserType('tenant')}
                >
                  <Text style={[styles.userTypeText, userType === 'tenant' && styles.userTypeActiveText]}>
                    Tenant
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleEmailAuth}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Text>
          </TouchableOpacity>

          {!isSignUp && (
            <>
              <View style={styles.divider}>
                <Text style={styles.dividerText}>OR</Text>
              </View>

              <TouchableOpacity
                style={[styles.button, styles.googleButton]}
                onPress={handleGoogleSignIn}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.phoneButton]}
                onPress={switchToPhone}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Continue with Phone</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setAuthMode(isSignUp ? 'signIn' : 'signUp')}
          >
            <Text style={styles.switchButtonText}>
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  hintText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 15,
    marginTop: -10,
    paddingHorizontal: 4,
  },
  otpSentText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 20,
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  userTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  userTypeActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  userTypeText: {
    fontSize: 16,
    color: '#666',
  },
  userTypeActiveText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#db4437',
  },
  phoneButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerText: {
    color: '#666',
    fontSize: 14,
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  resendText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '500',
  },
  resendCooldownText: {
    color: '#9CA3AF',
    fontSize: 15,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  devBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
    alignItems: 'center',
  },
  devBannerText: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '600',
  },
})