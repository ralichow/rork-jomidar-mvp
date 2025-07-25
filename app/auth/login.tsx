import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { authService } from '@/supabase/authentication'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [fullName, setFullName] = useState('')
  const [userType, setUserType] = useState<'landlord' | 'tenant'>('landlord')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)
    
    try {
      if (isSignUp) {
        if (!fullName) {
          Alert.alert('Error', 'Please enter your full name')
          return
        }
        
        const { data, error } = await authService.signUp(email, password, fullName, userType)
        
        if (error) {
          Alert.alert('Sign Up Error', error)
        } else {
          Alert.alert('Success', 'Account created successfully! Please check your email to verify your account.')
        }
      } else {
        const { data, error } = await authService.signIn(email, password)
        
        if (error) {
          Alert.alert('Sign In Error', error)
        } else {
          router.replace('/(tabs)')
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error } = await authService.signInWithGoogle()
    
    if (error) {
      Alert.alert('Google Sign In Error', error)
    }
    setLoading(false)
  }

  const handleFacebookSignIn = async () => {
    setLoading(true)
    const { error } = await authService.signInWithFacebook()
    
    if (error) {
      Alert.alert('Facebook Sign In Error', error)
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignUp ? 'Create Account' : 'Welcome Back'}
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
        style={[styles.button, styles.facebookButton]}
        onPress={handleFacebookSignIn}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsSignUp(!isSignUp)}
      >
        <Text style={styles.switchButtonText}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
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
  facebookButton: {
    backgroundColor: '#3b5998',
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
})