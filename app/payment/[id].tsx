import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, CreditCard, Edit2, ExternalLink, Home, Trash2, User } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import Button from '@/components/UI/Button';

export default function PaymentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { payments, tenants, properties, deletePayment } = useAppStore();
  
  const payment = payments.find(p => p.id === id);
  
  if (!payment) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Payment not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          variant="primary"
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }
  
  const tenant = tenants.find(t => t.id === payment.tenantId);
  const property = properties.find(p => p.id === payment.propertyId);
  const unit = property?.units.find(u => u.id === payment.unitId);
  
  const handleDeletePayment = () => {
    Alert.alert(
      "Delete Payment",
      "Are you sure you want to delete this payment record? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deletePayment(id);
            router.replace('/payments');
          }
        }
      ]
    );
  };
  
  const handleEditPayment = () => {
    // Navigate to edit payment screen (not implemented in this example)
    Alert.alert("Edit Payment", "Edit payment functionality would go here");
  };
  
  const handleViewReceipt = () => {
    if (payment.receiptUrl) {
      Linking.openURL(payment.receiptUrl);
    } else {
      Alert.alert("No Receipt", "No receipt available for this payment");
    }
  };
  
  // Format month for display (e.g., "2023-05" to "May 2023")
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  const getStatusColor = (status: string) => {
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
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.paymentType}>
            {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} Payment
          </Text>
          <Text style={styles.paymentAmount}>৳{payment.amount.toLocaleString()}</Text>
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
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditPayment}
          >
            <Edit2 size={18} color={colors.text.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeletePayment}
          >
            <Trash2 size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Calendar size={18} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Payment Period</Text>
              <Text style={styles.infoValue}>{formatMonth(payment.month)}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Calendar size={18} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Payment Date</Text>
              <Text style={styles.infoValue}>
                {new Date(payment.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <User size={18} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Tenant</Text>
              <Text style={styles.infoValue}>{tenant?.name || 'Unknown'}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Home size={18} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Property & Unit</Text>
              <Text style={styles.infoValue}>
                {property?.name || 'Unknown'}, Unit {unit?.unitNumber || 'Unknown'}
              </Text>
            </View>
          </View>
          
          {payment.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{payment.notes}</Text>
            </View>
          )}
        </View>
        
        {payment.receiptUrl && (
          <Button
            title="View Receipt"
            onPress={handleViewReceipt}
            variant="outline"
            icon={<ExternalLink size={16} color={colors.primary} />}
            style={styles.receiptButton}
          />
        )}
        
        {payment.status === 'pending' && (
          <Button
            title="Mark as Paid"
            onPress={() => {
              // This would update the payment status to 'paid'
              Alert.alert("Mark as Paid", "This would update the payment status to 'paid'");
            }}
            variant="primary"
            icon={<CreditCard size={16} color={colors.card} />}
            style={styles.actionButton}
          />
        )}
        
        {payment.status === 'overdue' && (
          <View style={styles.actionButtonsContainer}>
            <Button
              title="Send Reminder"
              onPress={() => {
                // This would send a payment reminder
                Alert.alert("Send Reminder", "This would send a payment reminder to the tenant");
              }}
              variant="outline"
              style={{ flex: 1, marginRight: 8 }}
            />
            
            <Button
              title="Mark as Paid"
              onPress={() => {
                // This would update the payment status to 'paid'
                Alert.alert("Mark as Paid", "This would update the payment status to 'paid'");
              }}
              variant="primary"
              style={{ flex: 1 }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.text.secondary,
  },
  header: {
    backgroundColor: colors.card,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
  },
  paymentType: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  infoContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notesLabel: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  receiptButton: {
    marginBottom: 12,
  },
  actionButton: {
    marginBottom: 24,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
});