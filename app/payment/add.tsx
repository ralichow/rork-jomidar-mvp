import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, CreditCard, DollarSign, FileText, User, X, AlertCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import Button from '@/components/UI/Button';

export default function AddPaymentScreen() {
  const router = useRouter();
  const { tenants, properties, addPayment } = useAppStore();
  
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Today's date
  const [type, setType] = useState<'rent' | 'utility' | 'maintenance' | 'deposit'>('rent');
  const [status, setStatus] = useState<'paid' | 'pending' | 'overdue' | 'underpaid'>('paid');
  const [month, setMonth] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`
  ); // Current month
  const [notes, setNotes] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [expectedAmount, setExpectedAmount] = useState<number | null>(null);
  const [remainingAmount, setRemainingAmount] = useState<number | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get tenant details
  const selectedTenant = tenants.find(t => t.id === selectedTenantId);
  const property = selectedTenant 
    ? properties.find(p => p.id === selectedTenant.propertyId) 
    : null;
  const unit = selectedTenant && property
    ? property.units.find(u => u.id === selectedTenant.unitId)
    : null;
  
  // Update expected amount when tenant or payment type changes
  useEffect(() => {
    if (selectedTenant && type === 'rent') {
      setExpectedAmount(selectedTenant.monthlyRent);
      setAmount(selectedTenant.monthlyRent.toString());
    } else {
      setExpectedAmount(null);
    }
  }, [selectedTenant, type]);
  
  // Calculate remaining amount and update status when amount changes
  useEffect(() => {
    if (expectedAmount && amount) {
      const amountValue = Number(amount);
      if (amountValue < expectedAmount) {
        setStatus('underpaid');
        setRemainingAmount(expectedAmount - amountValue);
      } else {
        setStatus('paid');
        setRemainingAmount(null);
      }
    }
  }, [amount, expectedAmount]);
  
  const handleSubmit = () => {
    // Validate required fields
    if (!selectedTenantId) {
      Alert.alert('Error', 'Please select a tenant');
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (!date) {
      Alert.alert('Error', 'Please enter a payment date');
      return;
    }
    
    if (!month) {
      Alert.alert('Error', 'Please enter a payment month');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addPayment({
        tenantId: selectedTenantId,
        unitId: selectedTenant!.unitId,
        propertyId: selectedTenant!.propertyId,
        amount: Number(amount),
        date,
        type,
        status,
        month,
        notes,
        receiptUrl: receiptUrl || undefined,
        expectedAmount: expectedAmount || undefined,
        remainingAmount: remainingAmount || undefined
      });
      
      router.replace('/payments');
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Tenant</Text>
          <ScrollView 
            style={styles.tenantSelector}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {tenants.map(tenant => (
              <TouchableOpacity
                key={tenant.id}
                style={[
                  styles.tenantOption,
                  selectedTenantId === tenant.id && styles.selectedTenantOption
                ]}
                onPress={() => {
                  setSelectedTenantId(tenant.id);
                  // Auto-fill amount with tenant's rent if payment type is rent
                  if (type === 'rent') {
                    setAmount(tenant.monthlyRent.toString());
                    setExpectedAmount(tenant.monthlyRent);
                  }
                }}
              >
                <Text style={[
                  styles.tenantOptionText,
                  selectedTenantId === tenant.id && styles.selectedTenantOptionText
                ]}>
                  {tenant.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {selectedTenant && (
            <View style={styles.selectedTenantInfo}>
              <Text style={styles.selectedTenantProperty}>
                {property?.name}, Unit {unit?.unitNumber}
              </Text>
              <Text style={styles.selectedTenantRent}>
                Monthly Rent: ৳{selectedTenant.monthlyRent.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Payment Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeOption,
                type === 'rent' && styles.selectedTypeOption
              ]}
              onPress={() => {
                setType('rent');
                // Auto-fill amount with tenant's rent if tenant is selected
                if (selectedTenant) {
                  setAmount(selectedTenant.monthlyRent.toString());
                  setExpectedAmount(selectedTenant.monthlyRent);
                }
              }}
            >
              <Text style={[
                styles.typeOptionText,
                type === 'rent' && styles.selectedTypeOptionText
              ]}>
                Rent
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeOption,
                type === 'utility' && styles.selectedTypeOption
              ]}
              onPress={() => {
                setType('utility');
                setExpectedAmount(null);
              }}
            >
              <Text style={[
                styles.typeOptionText,
                type === 'utility' && styles.selectedTypeOptionText
              ]}>
                Utility
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeOption,
                type === 'maintenance' && styles.selectedTypeOption
              ]}
              onPress={() => {
                setType('maintenance');
                setExpectedAmount(null);
              }}
            >
              <Text style={[
                styles.typeOptionText,
                type === 'maintenance' && styles.selectedTypeOptionText
              ]}>
                Maintenance
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeOption,
                type === 'deposit' && styles.selectedTypeOption
              ]}
              onPress={() => {
                setType('deposit');
                // Auto-fill amount with tenant's security deposit if tenant is selected
                if (selectedTenant) {
                  setAmount(selectedTenant.securityDeposit.toString());
                  setExpectedAmount(selectedTenant.securityDeposit);
                }
              }}
            >
              <Text style={[
                styles.typeOptionText,
                type === 'deposit' && styles.selectedTypeOptionText
              ]}>
                Deposit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount (৳)</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter payment amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          
          {expectedAmount !== null && Number(amount) < expectedAmount && (
            <View style={styles.warningContainer}>
              <AlertCircle size={16} color={colors.accent} />
              <Text style={styles.warningText}>
                This amount is less than the expected ৳{expectedAmount.toLocaleString()}. 
                Remaining: ৳{(expectedAmount - Number(amount)).toLocaleString()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Payment Status</Text>
          <View style={styles.statusSelector}>
            <TouchableOpacity
              style={[
                styles.statusOption,
                status === 'paid' && styles.selectedStatusOption,
                status === 'paid' && { backgroundColor: `${colors.success}20` }
              ]}
              onPress={() => {
                if (expectedAmount && Number(amount) < expectedAmount) {
                  Alert.alert(
                    "Warning", 
                    "The amount is less than expected. Are you sure you want to mark it as fully paid?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Yes", onPress: () => setStatus('paid') }
                    ]
                  );
                } else {
                  setStatus('paid');
                }
              }}
            >
              <Text style={[
                styles.statusOptionText,
                status === 'paid' && styles.selectedStatusOptionText,
                status === 'paid' && { color: colors.success }
              ]}>
                Paid
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusOption,
                status === 'pending' && styles.selectedStatusOption,
                status === 'pending' && { backgroundColor: `${colors.warning}20` }
              ]}
              onPress={() => setStatus('pending')}
            >
              <Text style={[
                styles.statusOptionText,
                status === 'pending' && styles.selectedStatusOptionText,
                status === 'pending' && { color: colors.warning }
              ]}>
                Pending
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusOption,
                status === 'overdue' && styles.selectedStatusOption,
                status === 'overdue' && { backgroundColor: `${colors.danger}20` }
              ]}
              onPress={() => setStatus('overdue')}
            >
              <Text style={[
                styles.statusOptionText,
                status === 'overdue' && styles.selectedStatusOptionText,
                status === 'overdue' && { color: colors.danger }
              ]}>
                Overdue
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusOption,
                status === 'underpaid' && styles.selectedStatusOption,
                status === 'underpaid' && { backgroundColor: `${colors.accent}20` }
              ]}
              onPress={() => {
                if (expectedAmount) {
                  setStatus('underpaid');
                } else {
                  Alert.alert("Error", "Underpaid status can only be used when there is an expected amount.");
                }
              }}
            >
              <Text style={[
                styles.statusOptionText,
                status === 'underpaid' && styles.selectedStatusOptionText,
                status === 'underpaid' && { color: colors.accent }
              ]}>
                Underpaid
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Payment Date</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Payment Month</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM"
              value={month}
              onChangeText={setMonth}
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          <Text style={styles.helperText}>
            Format: YYYY-MM (e.g., 2023-06 for June 2023)
          </Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <View style={[styles.inputContainer, { height: 80, alignItems: 'flex-start', paddingVertical: 8 }]}>
            <TextInput
              style={[styles.input, { height: '100%', textAlignVertical: 'top' }]}
              placeholder="Enter any additional notes"
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor={colors.text.tertiary}
              multiline
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Receipt URL (Optional)</Text>
          <View style={styles.inputContainer}>
            <FileText size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter receipt URL"
              value={receiptUrl}
              onChangeText={setReceiptUrl}
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title="Record Payment"
          onPress={handleSubmit}
          variant="primary"
          loading={isSubmitting}
          style={{ flex: 2 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  tenantSelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tenantOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTenantOption: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  tenantOptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  selectedTenantOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  selectedTenantInfo: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  selectedTenantProperty: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  selectedTenantRent: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  selectedTypeOption: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  typeOptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  selectedTypeOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  statusSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedStatusOption: {
    borderColor: 'transparent',
  },
  statusOptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  selectedStatusOptionText: {
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.text.primary,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: `${colors.accent}10`,
    padding: 8,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 12,
    color: colors.accent,
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
});