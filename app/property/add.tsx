import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, MapPin, X } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import Button from '@/components/UI/Button';

export default function AddPropertyScreen() {
  const router = useRouter();
  const { addProperty } = useAppStore();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a property name');
      return;
    }
    
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter a property address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addProperty({
        name,
        address,
        image: image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        totalUnits: 0,
        occupiedUnits: 0,
        monthlyRevenue: 0,
        units: []
      });
      
      router.replace('/properties');
    } catch (error) {
      Alert.alert('Error', 'Failed to add property');
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
          <Text style={styles.label}>Property Name</Text>
          <View style={styles.inputContainer}>
            <Building2 size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter property name"
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
          <Text style={styles.label}>Address</Text>
          <View style={styles.inputContainer}>
            <MapPin size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter property address"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor={colors.text.tertiary}
              multiline
            />
            {address ? (
              <TouchableOpacity onPress={() => setAddress('')}>
                <X size={18} color={colors.text.tertiary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image URL (Optional)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter image URL"
              value={image}
              onChangeText={setImage}
              placeholderTextColor={colors.text.tertiary}
            />
            {image ? (
              <TouchableOpacity onPress={() => setImage('')}>
                <X size={18} color={colors.text.tertiary} />
              </TouchableOpacity>
            ) : null}
          </View>
          <Text style={styles.helperText}>
            Leave empty to use a default image
          </Text>
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
          title="Add Property"
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
    marginBottom: 24,
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
  helperText: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});