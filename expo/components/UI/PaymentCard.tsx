import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, CreditCard, Download, HomeIcon, Receipt } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Payment } from '@/types';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/store/languageStore';
import { generateAndSharePaymentReceipt } from '@/utils/reportUtils';

type PaymentCardProps = {
  payment: Payment;
};

export default function PaymentCard({ payment }: PaymentCardProps) {
  const router = useRouter();
  const tenants = useAppStore((state) => state.tenants);
  const properties = useAppStore((state) => state.properties);
  const { t } = useTranslation();
  
  const tenant = tenants.find(t => t.id === payment.tenantId);
  const property = properties.find(p => p.id === payment.propertyId);
  const unit = property?.units.find(u => u.id === payment.unitId);
  
  const handlePress = () => {
    router.push(`/payment/${payment.id}`);
  };
  
  const handleDownloadReceipt = async (e: any) => {
    e.stopPropagation(); // Prevent navigation to payment details
    
    try {
      await generateAndSharePaymentReceipt(payment, tenant, property, unit);
    } catch (error) {
      Alert.alert("Error", "Failed to generate receipt. Please try again.");
    }
  };
  
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'overdue':
        return colors.danger;
      case 'underpaid':
        return colors.accent;
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
  
  // Get translated payment type
  const getTranslatedType = (type: Payment['type']) => {
    switch (type) {
      case 'rent':
        return t('rent');
      case 'utility':
        return t('utility');
      case 'maintenance':
        return t('maintenance');
      case 'deposit':
        return t('deposit');
      default:
        return type;
    }
  };
  
  // Get translated payment status
  const getTranslatedStatus = (status: Payment['status']) => {
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
  
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          {payment.type === 'rent' && <HomeIcon size={16} color={colors.primary} />}
          {payment.type === 'utility' && <CreditCard size={16} color={colors.primary} />}
          {payment.type === 'maintenance' && <CreditCard size={16} color={colors.primary} />}
          {payment.type === 'deposit' && <CreditCard size={16} color={colors.primary} />}
          <Text style={styles.type}>
            {getTranslatedType(payment.type)}
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
            {getTranslatedStatus(payment.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>{t('amount')}</Text>
        <Text style={styles.amount}>৳{payment.amount.toLocaleString()}</Text>
        
        {payment.status === 'underpaid' && payment.remainingAmount && (
          <Text style={styles.remainingAmount}>
            {t('remaining')}: ৳{payment.remainingAmount.toLocaleString()}
          </Text>
        )}
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
        <View style={styles.footerRight}>
          <Text style={styles.propertyInfo}>
            {property?.name}, {t('unit')} {unit?.unitNumber}
          </Text>
          
          {payment.status === 'paid' && (
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={handleDownloadReceipt}
            >
              <Download size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
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
  remainingAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.accent,
    marginTop: 4,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tenantName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyInfo: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  downloadButton: {
    marginLeft: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});