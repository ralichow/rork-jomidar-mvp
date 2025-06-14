import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSchemeName } from 'react-native';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeType;
  colorScheme: ColorSchemeName;
  setTheme: (theme: ThemeType) => void;
  setSystemColorScheme: (colorScheme: ColorSchemeName) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      colorScheme: 'light',
      setTheme: (theme: ThemeType) => {
        set({ theme });
      },
      setSystemColorScheme: (colorScheme: ColorSchemeName) => {
        set({ colorScheme });
      }
    }),
    {
      name: 'jomidar-theme',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export const useTheme = () => {
  const { theme, colorScheme, setTheme } = useThemeStore();
  
  // Determine the actual color scheme based on theme setting
  const actualColorScheme: ColorSchemeName = 
    theme === 'system' ? colorScheme : theme;
  
  return {
    theme,
    colorScheme: actualColorScheme,
    setTheme,
    isDark: actualColorScheme === 'dark'
  };
};