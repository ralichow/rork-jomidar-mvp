import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import colors from "@/constants/colors";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="property/[id]" 
          options={{ 
            title: "Property Details",
            headerBackTitle: "Properties"
          }} 
        />
        <Stack.Screen 
          name="property/add" 
          options={{ 
            title: "Add Property",
            headerBackTitle: "Properties"
          }} 
        />
        <Stack.Screen 
          name="tenant/[id]" 
          options={{ 
            title: "Tenant Details",
            headerBackTitle: "Tenants"
          }} 
        />
        <Stack.Screen 
          name="tenant/add" 
          options={{ 
            title: "Add Tenant",
            headerBackTitle: "Tenants"
          }} 
        />
        <Stack.Screen 
          name="payment/[id]" 
          options={{ 
            title: "Payment Details",
            headerBackTitle: "Payments"
          }} 
        />
        <Stack.Screen 
          name="payment/add" 
          options={{ 
            title: "Record Payment",
            headerBackTitle: "Payments"
          }} 
        />
        <Stack.Screen 
          name="document/[id]" 
          options={{ 
            title: "Document",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="document/add" 
          options={{ 
            title: "Add Document",
            headerBackTitle: "Back"
          }} 
        />
      </Stack>
    </>
  );
}