import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, CreditCard, Receipt, HomeIcon } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Payment } from '@/types';
import { useAppStore } from '@/store/appStore';

type PaymentCardProps = {
  payment: Payment;
};

export default function PaymentCard({ payment }: PaymentCardProps) {
  const router = useRouter();
  const tenants = useAppStore((state) => state.tenants);
  const properties = useAppStore((state) => state.properties);
  
  const tenant = tenants.find(t => t.id === payment.tenantId);
  const property = properties.find(p => p.id === payment.propertyId);
  const unit = property?.units.find(u => u.id === payment.unitId);
  
  const handlePress = () => {
    router.push(`/payment/${payment.id}`);
  };
  
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'overdue':
        return colors.danger;
      default:
        return colors.text.secondary;
    }
  };
  
  const getPaymentTypeIcon = (type: Payment['type']) => {
    switch (type) {
      case 'rent':
        return <HomeIcon size={16} color={colors.primary} />;
      case 'utility':
        return <CreditCard size={16} color={colors.primary} />;
      case 'maintenance':
        return <CreditCard size={16} color={colors.primary} />;
      case 'deposit':
        return <CreditCard size={16} color={colors.primary} />;
      default:
        return <CreditCard size={16} color={colors.primary} />;
    }
  };
  
  // Format month for display (e.g., "2023-05" to "May 2023")
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          {payment.type === 'rent' && <HomeIcon size={16} color={colors.primary} />}
          {payment.type === 'utility' && <CreditCard size={16} color={colors.primary} />}
          {payment.type === 'maintenance' && <CreditCard size={16} color={colors.primary} />}
          {payment.type === 'deposit' && <CreditCard size={16} color={colors.primary} />}
          <Text style={styles.type}>
            {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
          </Text>
        </View>
        
        <View style={[
          styles.statusBadge, 
          { backgroundColor: `${getStatusColor(payment.status)}20` }
        ]}>
          <Text style={[
            styles.statusText, 
            { color: getStatusColor(payment.status) }
          ]}>
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount</Text>
        <Text style={styles.amount}>৳{payment.amount.toLocaleString()}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Calendar size={16} color={colors.text.tertiary} />
          <Text style={styles.infoText}>
            {formatMonth(payment.month)}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Receipt size={16} color={colors.text.tertiary} />
          <Text style={styles.infoText}>
            {new Date(payment.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.tenantName}>{tenant?.name}</Text>
        <Text style={styles.propertyInfo}>
          {property?.name}, Unit {unit?.unitNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
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
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  amountContainer: {
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  tenantName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  propertyInfo: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});