import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, FileText, Home, User } from 'lucide-react-native';
import { Document } from '@/types';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/store/languageStore';
import { useTheme } from '@/store/themeStore';
import { getColors } from '@/constants/colors';

type DocumentCardProps = {
  document: Document;
};

export default function DocumentCard({ document }: DocumentCardProps) {
  const router = useRouter();
  const { properties, tenants } = useAppStore();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
  const tenant = document.tenantId ? tenants.find(t => t.id === document.tenantId) : null;
  const property = document.propertyId ? properties.find(p => p.id === document.propertyId) : null;
  
  const handlePress = () => {
    router.push(`/document/${document.id}`);
  };
  
  const getDocumentTypeIcon = () => {
    switch (document.type) {
      case 'lease':
        return <FileText size={24} color={colors.primary} />;
      case 'receipt':
        return <FileText size={24} color={colors.success} />;
      case 'notice':
        return <FileText size={24} color={colors.warning} />;
      case 'maintenance':
        return <FileText size={24} color={colors.accent} />;
      default:
        return <FileText size={24} color={colors.text.secondary} />;
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { 
        backgroundColor: colors.card,
        shadowColor: isDark ? 'rgba(0, 0, 0, 0.3)' : '#000',
      }]} 
      onPress={handlePress}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
          {getDocumentTypeIcon()}
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.title, { color: colors.text.primary }]}>{document.title}</Text>
          <Text style={[styles.type, { color: colors.text.secondary }]}>
            {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={[styles.infoContainer, { borderTopColor: colors.border }]}>
        <View style={styles.infoItem}>
          <Calendar size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            {new Date(document.date).toLocaleDateString()}
          </Text>
        </View>
        
        {property && (
          <View style={styles.infoItem}>
            <Home size={16} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text.secondary }]}>
              {property.name}
            </Text>
          </View>
        )}
        
        {tenant && (
          <View style={styles.infoItem}>
            <User size={16} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text.secondary }]}>
              {tenant.name}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
  },
  infoContainer: {
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
  },
});