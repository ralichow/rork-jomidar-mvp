import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Globe, Moon, Sun, Info, DollarSign } from 'lucide-react-native';
import { useTranslation } from '@/store/languageStore';
import { useTheme } from '@/store/themeStore';
import { getColors } from '@/constants/colors';

export default function SettingsScreen() {
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme, isDark } = useTheme();
  const systemColorScheme = useColorScheme();
  const colors = getColors(isDark);
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{t('language')}</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              { 
                backgroundColor: colors.background,
                borderColor: language === 'en' ? colors.primary : colors.border
              },
              language === 'en' && { backgroundColor: `${colors.primary}20` }
            ]}
            onPress={() => setLanguage('en')}
          >
            <Globe size={20} color={language === 'en' ? colors.primary : colors.text.secondary} />
            <Text style={[
              styles.optionText,
              { color: colors.text.secondary },
              language === 'en' && { color: colors.primary, fontWeight: '600' }
            ]}>
              {t('english')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              { 
                backgroundColor: colors.background,
                borderColor: language === 'bn' ? colors.primary : colors.border
              },
              language === 'bn' && { backgroundColor: `${colors.primary}20` }
            ]}
            onPress={() => setLanguage('bn')}
          >
            <Globe size={20} color={language === 'bn' ? colors.primary : colors.text.secondary} />
            <Text style={[
              styles.optionText,
              { color: colors.text.secondary },
              language === 'bn' && { color: colors.primary, fontWeight: '600' }
            ]}>
              {t('bangla')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{t('app_settings')}</Text>
        
        <View style={styles.settingItem}>
          <View style={[styles.settingIconContainer, { backgroundColor: colors.background }]}>
            {theme === 'dark' ? (
              <Moon size={20} color={colors.text.secondary} />
            ) : (
              <Sun size={20} color={colors.text.secondary} />
            )}
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>{t('theme')}</Text>
            <View style={styles.settingOptions}>
              <TouchableOpacity 
                style={[
                  styles.settingOption, 
                  { 
                    backgroundColor: colors.background,
                    borderColor: theme === 'light' ? colors.primary : colors.border
                  },
                  theme === 'light' && { backgroundColor: `${colors.primary}20` }
                ]}
                onPress={() => setTheme('light')}
              >
                <Text style={[
                  styles.settingOptionText, 
                  { color: colors.text.secondary },
                  theme === 'light' && { color: colors.primary, fontWeight: '600' }
                ]}>
                  {t('light')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.settingOption, 
                  { 
                    backgroundColor: colors.background,
                    borderColor: theme === 'dark' ? colors.primary : colors.border
                  },
                  theme === 'dark' && { backgroundColor: `${colors.primary}20` }
                ]}
                onPress={() => setTheme('dark')}
              >
                <Text style={[
                  styles.settingOptionText, 
                  { color: colors.text.secondary },
                  theme === 'dark' && { color: colors.primary, fontWeight: '600' }
                ]}>
                  {t('dark')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.settingOption, 
                  { 
                    backgroundColor: colors.background,
                    borderColor: theme === 'system' ? colors.primary : colors.border
                  },
                  theme === 'system' && { backgroundColor: `${colors.primary}20` }
                ]}
                onPress={() => setTheme('system')}
              >
                <Text style={[
                  styles.settingOptionText, 
                  { color: colors.text.secondary },
                  theme === 'system' && { color: colors.primary, fontWeight: '600' }
                ]}>
                  {t('system')} {theme === 'system' && `(${systemColorScheme})`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.settingItem}>
          <View style={[styles.settingIconContainer, { backgroundColor: colors.background }]}>
            <DollarSign size={20} color={colors.text.secondary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>{t('currency')}</Text>
            <View style={styles.settingOptions}>
              <TouchableOpacity style={[
                styles.settingOption, 
                { 
                  backgroundColor: `${colors.primary}20`,
                  borderColor: colors.primary
                }
              ]}>
                <Text style={[
                  styles.settingOptionText, 
                  { color: colors.primary, fontWeight: '600' }
                ]}>
                  ৳ BDT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{t('about')}</Text>
        
        <View style={styles.aboutContainer}>
          <Text style={[styles.appName, { color: colors.text.primary }]}>{t('app_name')}</Text>
          <Text style={[styles.appSubtitle, { color: colors.text.secondary }]}>{t('app_subtitle')}</Text>
          <Text style={[styles.versionText, { color: colors.text.tertiary }]}>{t('version')}: 1.0.0</Text>
          
          <View style={styles.aboutContent}>
            <Text style={[styles.aboutText, { color: colors.text.secondary }]}>
              Jomidar is a comprehensive property management app designed for landlords in Bangladesh to manage their properties, tenants, payments, and documents efficiently.
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
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  settingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  settingOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  settingOptionText: {
    fontSize: 14,
  },
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
  },
  appSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  versionText: {
    fontSize: 14,
    marginTop: 8,
  },
  aboutContent: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  aboutText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});