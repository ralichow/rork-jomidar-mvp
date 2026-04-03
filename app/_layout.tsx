import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import colors from "@/constants/colors";
import { useTranslation } from "@/store/languageStore";
import { useAuthStore } from "@/store/authStore";
import { devFlowLog, installTimestampedConsole, useDevFlowMount } from "@/utils/devFlowLog";
import { supabase } from "@/supabase/config";

installTimestampedConsole();

export const unstable_settings = {
  initialRouteName: "auth/login",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useDevFlowMount('RootLayout')

  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      devFlowLog('RootLayout', 'UI Effect -> font load error')
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      devFlowLog('RootLayout', 'UI Effect -> fonts loaded (hide splash)')
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  useDevFlowMount('RootLayoutNav')
  const { t } = useTranslation();
  const { isAuthenticated, setAuthFromSupabase } = useAuthStore();

  useEffect(() => {
    devFlowLog('RootLayoutNav', `UI Effect -> isAuthenticated=${isAuthenticated}`)
  }, [isAuthenticated])

  useEffect(() => {
    let mounted = true;

    const syncInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          devFlowLog('RootLayoutNav', 'UI Effect -> getSession error (treat as signed out)')
        }
        if (!mounted) return;
        setAuthFromSupabase(data.session?.user ?? null);
      } catch (e) {
        if (!mounted) return;
        setAuthFromSupabase(null);
      }
    };

    syncInitialSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthFromSupabase(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe();
    };
  }, [setAuthFromSupabase]);
  
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerShadowVisible: false,
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen 
          name="auth/login" 
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }} 
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="property/[id]" 
          options={{ 
            title: t('property_details'),
            headerBackTitle: t('properties')
          }} 
        />
        <Stack.Screen 
          name="property/add" 
          options={{ 
            title: t('add_property'),
            headerBackTitle: t('properties')
          }} 
        />
        <Stack.Screen 
          name="tenant/[id]" 
          options={{ 
            title: t('tenant_details'),
            headerBackTitle: t('tenants')
          }} 
        />
        <Stack.Screen 
          name="tenant/add" 
          options={{ 
            title: t('add_tenant'),
            headerBackTitle: t('tenants')
          }} 
        />
        <Stack.Screen 
          name="payment/[id]" 
          options={{ 
            title: t('payment_details'),
            headerBackTitle: t('payments')
          }} 
        />
        <Stack.Screen 
          name="payment/add" 
          options={{ 
            title: t('record_payment'),
            headerBackTitle: t('payments')
          }} 
        />
        <Stack.Screen 
          name="document/[id]" 
          options={{ 
            title: t('document'),
            headerBackTitle: t('go_back')
          }} 
        />
        <Stack.Screen 
          name="document/add" 
          options={{ 
            title: t('add_document'),
            headerBackTitle: t('go_back')
          }} 
        />
      </Stack>
    </>
  );
}