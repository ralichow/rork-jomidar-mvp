import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/store/themeStore';
import { getColors } from '@/constants/colors';

type DashboardCardProps = {
  title: string;
  count: number;
  icon: React.ReactNode;
  onPress: () => void;
  color?: string;
};

export default function DashboardCard({
  title,
  count,
  icon,
  onPress,
  color
}: DashboardCardProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
  // Use the provided color or default to primary
  const cardColor = color || colors.primary;
  
  return (
    <TouchableOpacity 
      style={[styles.container, { 
        backgroundColor: colors.card, 
        borderLeftColor: cardColor,
        shadowColor: isDark ? 'rgba(0, 0, 0, 0.3)' : '#000',
      }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${cardColor}15` }]}>
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.secondary }]}>{title}</Text>
        <Text style={[styles.count, { color: cardColor }]}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  count: {
    fontSize: 24,
    fontWeight: '700',
  }
});