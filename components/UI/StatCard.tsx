import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import colors from '@/constants/colors';

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
  color = colors.primary,
  isCurrency = false,
  isPercentage = false
}: StatCardProps) {
  const formattedValue = isCurrency 
    ? `৳${typeof value === 'number' ? value.toLocaleString() : value}`
    : isPercentage
      ? `${value}%`
      : value;

  const isTrendPositive = trend && trend > 0;
  const trendColor = isTrendPositive ? colors.success : colors.danger;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          {icon}
        </View>
      </View>
      
      <Text style={styles.value}>{formattedValue}</Text>
      
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
          {trendLabel && <Text style={styles.trendLabel}>{trendLabel}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    minWidth: '47%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: colors.text.secondary,
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
    color: colors.text.primary,
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
    color: colors.text.tertiary,
    marginLeft: 4,
  }
});