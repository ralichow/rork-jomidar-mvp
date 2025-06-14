import React from "react";
import { Tabs } from "expo-router";
import { Home, Building, Users, CreditCard, FileText, Settings } from "lucide-react-native";
import { useTranslation } from "@/store/languageStore";
import { useTheme } from "@/store/themeStore";
import { getColors } from "@/constants/colors";

export default function TabLayout() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
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