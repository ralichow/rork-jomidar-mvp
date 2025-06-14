import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Globe, Moon, Sun, Info } from 'lucide-react-native';
import { useTranslation } from '@/store/languageStore';
import { useTheme, useThemeStore, ThemeType } from '@/store/themeStore';
import { getColors } from '@/constants/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const { theme, isDark, setTheme } = useTheme();
  const colors = getColors(isDark);
  
  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };
  
  const handleLanguageChange = (lang: 'en' | 'bn') => {
    setLanguage(lang);
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          {t('app_settings')}
        </Text>
        
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Globe size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                {t('language')}
              </Text>
            </View>
            
            <View style={styles.languageOptions}>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'en' && { backgroundColor: `${colors.primary}20` }
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text
                  style={[
                    styles.languageText,
                    { color: language === 'en' ? colors.primary : colors.text.secondary }
                  ]}
                >
                  {t('english')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'bn' && { backgroundColor: `${colors.primary}20` }
                ]}
                onPress={() => handleLanguageChange('bn')}
              >
                <Text
                  style={[
                    styles.languageText,
                    { color: language === 'bn' ? colors.primary : colors.text.secondary }
                  ]}
                >
                  {t('bangla')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              {isDark ? (
                <Moon size={20} color={colors.primary} />
              ) : (
                <Sun size={20} color={colors.primary} />
              )}
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                {t('theme')}
              </Text>
            </View>
            
            <View style={styles.themeOptions}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  theme === 'light' && { backgroundColor: `${colors.primary}20` }
                ]}
                onPress={() => handleThemeChange('light')}
              >
                <Text
                  style={[
                    styles.themeText,
                    { color: theme === 'light' ? colors.primary : colors.text.secondary }
                  ]}
                >
                  {t('light')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  theme === 'dark' && { backgroundColor: `${colors.primary}20` }
                ]}
                onPress={() => handleThemeChange('dark')}
              >
                <Text
                  style={[
                    styles.themeText,
                    { color: theme === 'dark' ? colors.primary : colors.text.secondary }
                  ]}
                >
                  {t('dark')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  theme === 'system' && { backgroundColor: `${colors.primary}20` }
                ]}
                onPress={() => handleThemeChange('system')}
              >
                <Text
                  style={[
                    styles.themeText,
                    { color: theme === 'system' ? colors.primary : colors.text.secondary }
                  ]}
                >
                  {t('system')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          {t('about')}
        </Text>
        
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Info size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                {t('version')}
              </Text>
            </View>
            
            <Text style={[styles.versionText, { color: colors.text.secondary }]}>
              1.0.0
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
  settingItem: {
    paddingVertical: 12,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  themeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  versionText: {
    fontSize: 14,
  },
});