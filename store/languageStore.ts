import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '@/locales/en';
import bn from '@/locales/bn';

type Language = 'en' | 'bn';

interface LanguageState {
  language: Language;
  translations: typeof en;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      translations: en,
      setLanguage: (language: Language) => {
        set({
          language,
          translations: language === 'en' ? en : bn
        });
      }
    }),
    {
      name: 'jomidar-language',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export const useTranslation = () => {
  const { translations, language, setLanguage } = useLanguageStore();
  
  return {
    t: (key: keyof typeof en) => translations[key] || key,
    language,
    setLanguage
  };
};