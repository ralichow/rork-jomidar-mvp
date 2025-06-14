import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Globe, Moon, Sun, Info, DollarSign } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useTranslation } from '@/store/languageStore';

export default function SettingsScreen() {
  const { t, language, setLanguage } = useTranslation();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('language')}</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              language === 'en' && styles.selectedOptionButton
            ]}
            onPress={() => setLanguage('en')}
          >
            <Globe size={20} color={language === 'en' ? colors.primary : colors.text.secondary} />
            <Text style={[
              styles.optionText,
              language === 'en' && styles.selectedOptionText
            ]}>
              {t('english')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              language === 'bn' && styles.selectedOptionButton
            ]}
            onPress={() => setLanguage('bn')}
          >
            <Globe size={20} color={language === 'bn' ? colors.primary : colors.text.secondary} />
            <Text style={[
              styles.optionText,
              language === 'bn' && styles.selectedOptionText
            ]}>
              {t('bangla')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('app_settings')}</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Sun size={20} color={colors.text.secondary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{t('theme')}</Text>
            <View style={styles.settingOptions}>
              <TouchableOpacity style={[styles.settingOption, styles.selectedSettingOption]}>
                <Text style={[styles.settingOptionText, styles.selectedSettingOptionText]}>{t('light')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingOption}>
                <Text style={styles.settingOptionText}>{t('dark')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingOption}>
                <Text style={styles.settingOptionText}>{t('system')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <DollarSign size={20} color={colors.text.secondary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{t('currency')}</Text>
            <View style={styles.settingOptions}>
              <TouchableOpacity style={[styles.settingOption, styles.selectedSettingOption]}>
                <Text style={[styles.settingOptionText, styles.selectedSettingOptionText]}>৳ BDT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about')}</Text>
        
        <View style={styles.aboutContainer}>
          <Text style={styles.appName}>{t('app_name')}</Text>
          <Text style={styles.appSubtitle}>{t('app_subtitle')}</Text>
          <Text style={styles.versionText}>{t('version')}: 1.0.0</Text>
          
          <View style={styles.aboutContent}>
            <Text style={styles.aboutText}>
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
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
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
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
  },
  selectedOptionButton: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.background,
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
    color: colors.text.primary,
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
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedSettingOption: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  settingOptionText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  selectedSettingOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  appSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 4,
  },
  versionText: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 8,
  },
  aboutContent: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  aboutText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});