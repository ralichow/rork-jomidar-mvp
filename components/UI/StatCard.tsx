import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { useTheme } from '@/store/themeStore';
import { getColors } from '@/constants/colors';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number; // Percentage change
  trendLabel?: string;
  color?: string;
  isCurrency?: boolean;
  isPercentage?: boolean;
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  color,
  isCurrency = false,
  isPercentage = false
}: StatCardProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
  // Use the provided color or default to primary
  const cardColor = color || colors.primary;
  
  const formattedValue = isCurrency 
    ? `৳${typeof value === 'number' ? value.toLocaleString() : value}`
    : isPercentage
      ? `${value}%`
      : value;

  const isTrendPositive = trend && trend > 0;
  const trendColor = isTrendPositive ? colors.success : colors.danger;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.secondary }]}>{title}</Text>
        <View style={[styles.iconContainer, { backgroundColor: `${cardColor}20` }]}>
          {icon}
        </View>
      </View>
      
      <Text style={[styles.value, { color: colors.text.primary }]}>{formattedValue}</Text>
      
      {trend !== undefined && (
        <View style={styles.trendContainer}>
          {isTrendPositive ? (
            <ArrowUpRight size={16} color={trendColor} />
          ) : (
            <ArrowDownRight size={16} color={trendColor} />
          )}
          <Text style={[styles.trendValue, { color: trendColor }]}>
            {Math.abs(trend)}%
          </Text>
          {trendLabel && <Text style={[styles.trendLabel, { color: colors.text.tertiary }]}>{trendLabel}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flex: 1, // Use flex instead of fixed width to ensure proper layout
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendValue: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  trendLabel: {
    fontSize: 14,
    marginLeft: 4,
  }
});