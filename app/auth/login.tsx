import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Phone, Lock, User, Mail } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: ''
  });
  
  const { login, signup, isLoading } = useAuthStore();
  
  const handleSubmit = async () => {
    if (isSignUp) {
      const result = await signup(formData.name, formData.mobile, formData.password, formData.email);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Sign Up Failed', result.error);
      }
    } else {
      const result = await login(formData.mobile, formData.password);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', result.error);
      }
    }
  };
  
  const formatMobileNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 11 digits
    const limited = cleaned.slice(0, 11);
    
    // Format as 01XXX-XXXXXX
    if (limited.length <= 5) {
      return limited;
    } else {
      return `${limited.slice(0, 5)}-${limited.slice(5)}`;
    }
  };
  
  const handleMobileChange = (text: string) => {
    const formatted = formatMobileNumber(text);
    const cleaned = formatted.replace('-', '');
    setFormData({ ...formData, mobile: cleaned });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.logoContainer}
            >
              <Text style={styles.logoText}>J</Text>
            </LinearGradient>
            <Text style={styles.appName}>Jomidar</Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </Text>
          </View>
          
          {/* Form */}
          <View style={styles.form}>
            {isSignUp && (
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <User size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor={colors.text.tertiary}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Phone size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number (01XXX-XXXXXX)"
                  placeholderTextColor={colors.text.tertiary}
                  value={formatMobileNumber(formData.mobile)}
                  onChangeText={handleMobileChange}
                  keyboardType="phone-pad"
                  maxLength={12} // 01XXX-XXXXXX format
                />
              </View>
            </View>
            
            {isSignUp && (
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email (Optional)"
                    placeholderTextColor={colors.text.tertiary}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.text.tertiary}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colors.text.tertiary} />
                  ) : (
                    <Eye size={20} color={colors.text.tertiary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.submitGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.submitText}>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            
            {/* Toggle Sign Up/Login */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </Text>
              <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.toggleLink}>
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Demo Credentials */}
            {!isSignUp && (
              <View style={styles.demoContainer}>
                <Text style={styles.demoTitle}>Demo Credentials:</Text>
                <Text style={styles.demoText}>Mobile: 01700000000</Text>
                <Text style={styles.demoText}>Password: demo123</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  submitButton: {
    marginTop: 12,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  toggleText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginRight: 4,
  },
  toggleLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  demoContainer: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 2,
  },
});