import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/store/themeStore';
import { getColors } from '@/constants/colors';

type DashboardCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  width?: number | string;
};

export default function DashboardCard({ title, value, icon, color, width = '48%' }: DashboardCardProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.card,
        shadowColor: isDark ? 'rgba(0, 0, 0, 0.3)' : '#000',
        width,
      }
    ]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color || colors.primary}15` }]}>
          {icon}
        </View>
        <Text style={[styles.title, { color: colors.text.secondary }]}>{title}</Text>
      </View>
      <Text style={[styles.value, { color: colors.text.primary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
});