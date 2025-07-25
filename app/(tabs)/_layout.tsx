import React, { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { Home, Building, Users, CreditCard, FileText, Settings } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useTranslation } from '@/store/languageStore';
import { useAuthStore } from '@/store/authStore';

export default function TabLayout() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerShadowVisible: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('dashboard'),
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
          headerShown: false, // Hide the header for the home tab
        }}
      />
      <Tabs.Screen
        name="properties"
        options={{
          title: t('properties'),
          tabBarIcon: ({ color }) => <Building size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tenants"
        options={{
          title: t('tenants'),
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: t('payments'),
          tabBarIcon: ({ color }) => <CreditCard size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: t('documents'),
          tabBarIcon: ({ color }) => <FileText size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}