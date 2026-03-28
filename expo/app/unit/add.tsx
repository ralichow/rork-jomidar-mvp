import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { Home, DollarSign, Bed, Bath, Square } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import Button from '@/components/UI/Button';

export default function AddUnitScreen() {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
  const { addUnit, properties } = useAppStore();
  
  const property = properties.find(p => p.id === propertyId);
  
  const [formData, setFormData] = useState({
    unitNumber: '',
    floor: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    rent: '',
    status: 'vacant' as 'vacant' | 'occupied'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.unitNumber.trim()) {
      newErrors.unitNumber = 'Unit number is required';
    }
    
    if (!formData.floor.trim()) {
      newErrors.floor = 'Floor is required';
    }
    
    if (!formData.size.trim()) {
      newErrors.size = 'Size is required';
    } else if (isNaN(Number(formData.size)) || Number(formData.size) <= 0) {
      newErrors.size = 'Size must be a valid positive number';
    }
    
    if (!formData.bedrooms.trim()) {
      newErrors.bedrooms = 'Number of bedrooms is required';
    } else if (isNaN(Number(formData.bedrooms)) || Number(formData.bedrooms) < 0) {
      newErrors.bedrooms = 'Bedrooms must be a valid number';
    }
    
    if (!formData.bathrooms.trim()) {
      newErrors.bathrooms = 'Number of bathrooms is required';
    } else if (isNaN(Number(formData.bathrooms)) || Number(formData.bathrooms) < 0) {
      newErrors.bathrooms = 'Bathrooms must be a valid number';
    }
    
    if (!formData.rent.trim()) {
      newErrors.rent = 'Rent amount is required';
    } else if (isNaN(Number(formData.rent)) || Number(formData.rent) <= 0) {
      newErrors.rent = 'Rent must be a valid positive number';
    }
    
    // Check if unit number already exists
    if (property && formData.unitNumber.trim()) {
      const existingUnit = property.units.find(
        unit => unit.unitNumber.toLowerCase() === formData.unitNumber.trim().toLowerCase()
      );
      if (existingUnit) {
        newErrors.unitNumber = 'Unit number already exists in this property';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again.');
      return;
    }
    
    if (!propertyId) {
      Alert.alert('Error', 'Property ID is missing.');
      return;
    }
    
    try {
      addUnit(propertyId, {
        unitNumber: formData.unitNumber.trim(),
        floor: formData.floor.trim(),
        size: formData.size.trim(),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        rent: Number(formData.rent),
        status: formData.status
      });
      
      Alert.alert(
        'Success',
        'Unit added successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add unit. Please try again.');
    }
  };
  
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  if (!property) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Property not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          variant="primary"
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Add Unit',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.propertyName}>{property.name}</Text>
          <Text style={styles.propertyAddress}>{property.address}</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Unit Number *</Text>
            <View style={[styles.inputContainer, errors.unitNumber && styles.inputError]}>
              <Home size={20} color={colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.unitNumber}
                onChangeText={(value) => updateFormData('unitNumber', value)}
                placeholder="e.g., 3A, 201, etc."
                placeholderTextColor={colors.text.tertiary}
              />
            </View>
            {errors.unitNumber && <Text style={styles.errorText}>{errors.unitNumber}</Text>}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Floor *</Text>
            <View style={[styles.inputContainer, errors.floor && styles.inputError]}>
              <TextInput
                style={[styles.input, { paddingLeft: 16 }]}
                value={formData.floor}
                onChangeText={(value) => updateFormData('floor', value)}
                placeholder="e.g., 3rd, Ground, etc."
                placeholderTextColor={colors.text.tertiary}
              />
            </View>
            {errors.floor && <Text style={styles.errorText}>{errors.floor}</Text>}
          </View>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Size (sqft) *</Text>
              <View style={[styles.inputContainer, errors.size && styles.inputError]}>
                <Square size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.size}
                  onChangeText={(value) => updateFormData('size', value)}
                  placeholder="1200"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="numeric"
                />
              </View>
              {errors.size && <Text style={styles.errorText}>{errors.size}</Text>}
            </View>
            
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Rent (৳) *</Text>
              <View style={[styles.inputContainer, errors.rent && styles.inputError]}>
                <DollarSign size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.rent}
                  onChangeText={(value) => updateFormData('rent', value)}
                  placeholder="18000"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="numeric"
                />
              </View>
              {errors.rent && <Text style={styles.errorText}>{errors.rent}</Text>}
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Bedrooms *</Text>
              <View style={[styles.inputContainer, errors.bedrooms && styles.inputError]}>
                <Bed size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.bedrooms}
                  onChangeText={(value) => updateFormData('bedrooms', value)}
                  placeholder="3"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="numeric"
                />
              </View>
              {errors.bedrooms && <Text style={styles.errorText}>{errors.bedrooms}</Text>}
            </View>
            
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Bathrooms *</Text>
              <View style={[styles.inputContainer, errors.bathrooms && styles.inputError]}>
                <Bath size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.bathrooms}
                  onChangeText={(value) => updateFormData('bathrooms', value)}
                  placeholder="2"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="numeric"
                />
              </View>
              {errors.bathrooms && <Text style={styles.errorText}>{errors.bathrooms}</Text>}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  formData.status === 'vacant' && styles.statusOptionActive
                ]}
                onPress={() => updateFormData('status', 'vacant')}
              >
                <Text style={[
                  styles.statusOptionText,
                  formData.status === 'vacant' && styles.statusOptionTextActive
                ]}>Vacant</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  formData.status === 'occupied' && styles.statusOptionActive
                ]}
                onPress={() => updateFormData('status', 'occupied')}
              >
                <Text style={[
                  styles.statusOptionText,
                  formData.status === 'occupied' && styles.statusOptionTextActive
                ]}>Occupied</Text>
              </TouchableOpacity>
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
            title="Add Unit"
            onPress={handleSubmit}
            variant="primary"
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </ScrollView>
    </>
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
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 50,
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusOptionActive: {
    backgroundColor: colors.primary,
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  statusOptionTextActive: {
    color: colors.card,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
  },
});