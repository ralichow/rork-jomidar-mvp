import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, CreditCard, Home, User } from 'lucide-react-native';
import { Payment } from '@/types';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/store/languageStore';
import { useTheme } from '@/store/themeStore';
import { getColors } from '@/constants/colors';

type PaymentCardProps = {
  payment: Payment;
};

export default function PaymentCard({ payment }: PaymentCardProps) {
  const router = useRouter();
  const { properties, tenants } = useAppStore();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
  const tenant = tenants.find(t => t.id === payment.tenantId);
  const property = properties.find(p => p.id === tenant?.propertyId);
  const unit = property?.units.find(u => u.id === tenant?.unitId);
  
  const handlePress = () => {
    router.push(`/payment/${payment.id}`);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return colors.paid;
      case 'pending':
        return colors.pending;
      case 'overdue':
        return colors.overdue;
      case 'underpaid':
        return colors.warning;
      default:
        return colors.text.secondary;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return t('paid');
      case 'pending':
        return t('pending');
      case 'overdue':
        return t('overdue');
      case 'underpaid':
        return t('underpaid');
      default:
        return status;
    }
  };
  
  const statusColor = getStatusColor(payment.status);
  
  return (
    <TouchableOpacity 
      style={[styles.container, { 
        backgroundColor: colors.card,
        shadowColor: isDark ? 'rgba(0, 0, 0, 0.3)' : '#000',
      }]} 
      onPress={handlePress}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.paymentId, { color: colors.text.tertiary }]}>#{payment.id.substring(0, 8)}</Text>
          <Text style={[styles.paymentDate, { color: colors.text.primary }]}>
            {new Date(payment.date).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20`, borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{getStatusText(payment.status)}</Text>
        </View>
      </View>
      
      <View style={[styles.amountContainer, { borderBottomColor: colors.border }]}>
        <View style={styles.amountRow}>
          <Text style={[styles.amountLabel, { color: colors.text.secondary }]}>{t('amount')}</Text>
          <Text style={[styles.amount, { color: colors.text.primary }]}>৳{payment.amount.toLocaleString()}</Text>
        </View>
        
        {payment.status === 'underpaid' && tenant && (
          <View style={styles.amountRow}>
            <Text style={[styles.amountLabel, { color: colors.text.secondary }]}>{t('remaining')}</Text>
            <Text style={[styles.remainingAmount, { color: colors.warning }]}>
              ৳{(tenant.monthlyRent - payment.amount).toLocaleString()}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <User size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>{tenant?.name}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Home size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            {property?.name}, {t('unit')} {unit?.unitNumber}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Calendar size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            {t('payment_month')}: {new Date(payment.month + "-01").toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <CreditCard size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            {t('payment_type')}: {t(payment.type)}
          </Text>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  paymentId: {
    fontSize: 12,
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  amountContainer: {
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  amountLabel: {
    fontSize: 14,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
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