import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/store/languageStore';
import { useTheme } from '@/store/themeStore';
import { getColors } from '@/constants/colors';
import { Document, DocumentSource } from '@/types';
import Button from '@/components/UI/Button';
import { Camera as CameraIcon, Image as ImageIcon, X } from 'lucide-react-native';

export default function AddDocumentScreen() {
  const router = useRouter();
  const { addDocument, properties, tenants } = useAppStore();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
  const [name, setName] = useState('');
  const [type, setType] = useState<'lease' | 'receipt' | 'utility' | 'maintenance' | 'other'>('lease');
  const [relatedTo, setRelatedTo] = useState<'property' | 'tenant'>('property');
  const [relatedId, setRelatedId] = useState('');
  const [documentSource, setDocumentSource] = useState<DocumentSource | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  
  const cameraRef = useRef<any>(null);
  
  const handleAddDocument = () => {
    if (!name) {
      Alert.alert('Error', 'Please enter a document name');
      return;
    }
    
    if (!relatedId) {
      Alert.alert('Error', 'Please select a related property or tenant');
      return;
    }
    
    if (!documentSource) {
      Alert.alert('Error', 'Please upload or capture a document');
      return;
    }
    
    const newDocument: Document = {
      id: uuidv4(),
      name,
      type,
      source: documentSource,
      uploadDate: new Date().toISOString(),
      relatedTo,
      relatedId,
    };
    
    addDocument(newDocument);
    router.back();
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setDocumentSource({
        type: asset.type === 'image' ? 'image' : 'document',
        uri: asset.uri,
        name: asset.fileName || 'document',
        mimeType: asset.mimeType,
        size: asset.fileSize,
      });
      setShowCamera(false);
    }
  };
  
  const takePicture = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Camera permission is required to take pictures');
        return;
      }
    }
    
    setShowCamera(true);
  };
  
  const handleCameraCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        
        setDocumentSource({
          type: 'image',
          uri: photo.uri,
          name: `photo_${new Date().getTime()}.jpg`,
          mimeType: 'image/jpeg',
        });
        
        setShowCamera(false);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };
  
  if (showCamera) {
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={CameraType.back}
          ref={cameraRef}
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity 
              style={[styles.cameraButton, { backgroundColor: colors.card }]} 
              onPress={() => setShowCamera(false)}
            >
              <X size={20} color={colors.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.captureButton, { borderColor: '#fff' }]} 
              onPress={handleCameraCapture}
            />
          </View>
        </CameraView>
      </View>
    );
  }
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text.primary }]}>{t('document_name')}</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.card, 
            color: colors.text.primary,
            borderColor: colors.border
          }]}
          value={name}
          onChangeText={setName}
          placeholder={t('document_name')}
          placeholderTextColor={colors.text.tertiary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text.primary }]}>{t('document_type')}</Text>
        <View style={[styles.pickerContainer, { 
          backgroundColor: colors.card,
          borderColor: colors.border
        }]}>
          <Picker
            selectedValue={type}
            onValueChange={(itemValue) => setType(itemValue as any)}
            style={[styles.picker, { color: colors.text.primary }]}
            dropdownIconColor={colors.text.primary}
          >
            <Picker.Item label={t('lease')} value="lease" />
            <Picker.Item label={t('receipt')} value="receipt" />
            <Picker.Item label={t('utility_doc')} value="utility" />
            <Picker.Item label={t('maintenance_doc')} value="maintenance" />
            <Picker.Item label={t('other')} value="other" />
          </Picker>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text.primary }]}>{t('related_to')}</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity 
            style={styles.radioOption} 
            onPress={() => setRelatedTo('property')}
          >
            <View style={[styles.radioButton, { 
              borderColor: colors.primary,
              backgroundColor: relatedTo === 'property' ? colors.primary : 'transparent'
            }]} />
            <Text style={[styles.radioLabel, { color: colors.text.primary }]}>{t('property')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.radioOption} 
            onPress={() => setRelatedTo('tenant')}
          >
            <View style={[styles.radioButton, { 
              borderColor: colors.primary,
              backgroundColor: relatedTo === 'tenant' ? colors.primary : 'transparent'
            }]} />
            <Text style={[styles.radioLabel, { color: colors.text.primary }]}>{t('tenant')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {relatedTo === 'property' && (
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>{t('select_property')}</Text>
          <View style={[styles.pickerContainer, { 
            backgroundColor: colors.card,
            borderColor: colors.border
          }]}>
            <Picker
              selectedValue={relatedId}
              onValueChange={(itemValue) => setRelatedId(itemValue)}
              style={[styles.picker, { color: colors.text.primary }]}
              dropdownIconColor={colors.text.primary}
            >
              <Picker.Item label={t('select_property')} value="" />
              {properties.map((property) => (
                <Picker.Item key={property.id} label={property.name} value={property.id} />
              ))}
            </Picker>
          </View>
        </View>
      )}
      
      {relatedTo === 'tenant' && (
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>{t('select_tenant')}</Text>
          <View style={[styles.pickerContainer, { 
            backgroundColor: colors.card,
            borderColor: colors.border
          }]}>
            <Picker
              selectedValue={relatedId}
              onValueChange={(itemValue) => setRelatedId(itemValue)}
              style={[styles.picker, { color: colors.text.primary }]}
              dropdownIconColor={colors.text.primary}
            >
              <Picker.Item label={t('select_tenant')} value="" />
              {tenants.map((tenant) => (
                <Picker.Item key={tenant.id} label={tenant.name} value={tenant.id} />
              ))}
            </Picker>
          </View>
        </View>
      )}
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text.primary }]}>{t('document')}</Text>
        
        <View style={styles.documentActions}>
          <TouchableOpacity 
            style={[styles.documentButton, { backgroundColor: colors.primary }]} 
            onPress={pickImage}
          >
            <ImageIcon size={20} color="#fff" />
            <Text style={styles.documentButtonText}>{t('choose_from_gallery')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.documentButton, { backgroundColor: colors.primary }]} 
            onPress={takePicture}
          >
            <CameraIcon size={20} color="#fff" />
            <Text style={styles.documentButtonText}>{t('take_photo')}</Text>
          </TouchableOpacity>
        </View>
        
        {documentSource && (
          <View style={[styles.documentPreview, { backgroundColor: colors.card }]}>
            <Text style={[styles.documentName, { color: colors.text.primary }]}>
              {documentSource.name || 'Document'}
            </Text>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => setDocumentSource(null)}
            >
              <Text style={{ color: colors.error }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title={t('add')}
          onPress={handleAddDocument}
          variant="primary"
        />
        <Button 
          title={t('cancel')}
          onPress={() => router.back()}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    width: '100%',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 8,
  },
  radioLabel: {
    fontSize: 16,
  },
  documentActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  documentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  documentButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  documentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  documentName: {
    fontSize: 16,
  },
  removeButton: {
    padding: 8,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cameraButton: {
    padding: 12,
    borderRadius: 8,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});