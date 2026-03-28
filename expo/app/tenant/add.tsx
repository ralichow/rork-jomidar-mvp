import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Home, Mail, Phone, User, X, ShieldCheck } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import Button from '@/components/UI/Button';

export default function AddTenantScreen() {
  const router = useRouter();
  const { properties, addTenant } = useAppStore();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nidNumber, setNidNumber] = useState('');
  const [photo, setPhoto] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [leaseStart, setLeaseStart] = useState('');
  const [leaseEnd, setLeaseEnd] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get vacant units for the selected property
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const vacantUnits = selectedProperty 
    ? selectedProperty.units.filter(unit => unit.status === 'vacant')
    : [];
  
  const handleSubmit = () => {
    // Validate required fields
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter tenant name');
      return;
    }
    
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }
    
    if (!selectedPropertyId) {
      Alert.alert('Error', 'Please select a property');
      return;
    }
    
    if (!selectedUnitId) {
      Alert.alert('Error', 'Please select a unit');
      return;
    }
    
    if (!leaseStart || !leaseEnd) {
      Alert.alert('Error', 'Please enter lease start and end dates');
      return;
    }
    
    if (!monthlyRent) {
      Alert.alert('Error', 'Please enter monthly rent amount');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addTenant({
        name,
        phone,
        email,
        nidNumber,
        photo: photo || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        propertyId: selectedPropertyId,
        unitId: selectedUnitId,
        leaseStart,
        leaseEnd,
        monthlyRent: parseInt(monthlyRent),
        securityDeposit: securityDeposit ? parseInt(securityDeposit) : 0,
      });
      
      router.replace('/tenants');
    } catch (error) {
      Alert.alert('Error', 'Failed to add tenant');
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
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <User size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter tenant name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.text.tertiary}
            />
            {name ? (
              <TouchableOpacity onPress={() => setName('')}>
                <X size={18} color={colors.text.tertiary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Phone size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={colors.text.tertiary}
            />
            {phone ? (
              <TouchableOpacity onPress={() => setPhone('')}>
                <X size={18} color={colors.text.tertiary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email (Optional)</Text>
          <View style={styles.inputContainer}>
            <Mail size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor={colors.text.tertiary}
            />
            {email ? (
              <TouchableOpacity onPress={() => setEmail('')}>
                <X size={18} color={colors.text.tertiary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>NID Number</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter National ID number"
              value={nidNumber}
              onChangeText={setNidNumber}
              placeholderTextColor={colors.text.tertiary}
            />
            {nidNumber ? (
              <TouchableOpacity onPress={() => setNidNumber('')}>
                <X size={18} color={colors.text.tertiary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Photo URL (Optional)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter photo URL"
              value={photo}
              onChangeText={setPhoto}
              placeholderTextColor={colors.text.tertiary}
            />
            {photo ? (
              <TouchableOpacity onPress={() => setPhoto('')}>
                <X size={18} color={colors.text.tertiary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Property & Lease Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Property</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.propertySelector}
          >
            {properties.map(property => (
              <TouchableOpacity
                key={property.id}
                style={[
                  styles.propertyOption,
                  selectedPropertyId === property.id && styles.selectedPropertyOption
                ]}
                onPress={() => {
                  setSelectedPropertyId(property.id);
                  setSelectedUnitId(''); // Reset unit selection
                }}
              >
                <Text style={[
                  styles.propertyOptionText,
                  selectedPropertyId === property.id && styles.selectedPropertyOptionText
                ]}>
                  {property.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {selectedPropertyId && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Vacant Unit</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.unitSelector}
            >
              {vacantUnits.length > 0 ? (
                vacantUnits.map(unit => (
                  <TouchableOpacity
                    key={unit.id}
                    style={[
                      styles.unitOption,
                      selectedUnitId === unit.id && styles.selectedUnitOption
                    ]}
                    onPress={() => {
                      setSelectedUnitId(unit.id);
                      setMonthlyRent(unit.rent.toString()); // Auto-fill rent
                    }}
                  >
                    <Text style={[
                      styles.unitOptionText,
                      selectedUnitId === unit.id && styles.selectedUnitOptionText
                    ]}>
                      Unit {unit.unitNumber}
                    </Text>
                    <Text style={[
                      styles.unitOptionSubtext,
                      selectedUnitId === unit.id && styles.selectedUnitOptionSubtext
                    ]}>
                      ৳{unit.rent.toLocaleString()}/mo
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noUnitsMessage}>
                  <Text style={styles.noUnitsText}>No vacant units available</Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Lease Start Date</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={leaseStart}
              onChangeText={setLeaseStart}
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Lease End Date</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={leaseEnd}
              onChangeText={setLeaseEnd}
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Monthly Rent (৳)</Text>
          <View style={styles.inputContainer}>
            <Home size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter monthly rent amount"
              value={monthlyRent}
              onChangeText={setMonthlyRent}
              keyboardType="numeric"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Security Deposit (৳)</Text>
          <View style={styles.inputContainer}>
            <ShieldCheck size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter security deposit amount"
              value={securityDeposit}
              onChangeText={setSecurityDeposit}
              keyboardType="numeric"
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
          title="Add Tenant"
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
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
  propertySelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  propertyOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedPropertyOption: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  propertyOptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  selectedPropertyOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  unitSelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  unitOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 100,
  },
  selectedUnitOption: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  unitOptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  selectedUnitOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  unitOptionSubtext: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  selectedUnitOptionSubtext: {
    color: colors.primary,
  },
  noUnitsMessage: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  noUnitsText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
});