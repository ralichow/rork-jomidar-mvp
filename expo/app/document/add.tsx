import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Camera, FileText, Image as ImageIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import Button from '@/components/UI/Button';
import { Document, DocumentSource } from '@/types';

export default function AddDocumentScreen() {
  const router = useRouter();
  const { properties, tenants, addDocument } = useAppStore();
  
  const [name, setName] = useState('');
  const [type, setType] = useState<Document['type']>('lease');
  const [documentSource, setDocumentSource] = useState<DocumentSource | null>(null);
  const [relatedTo, setRelatedTo] = useState<Document['relatedTo']>('property');
  const [relatedId, setRelatedId] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get related entities based on selection
  const getRelatedEntities = () => {
    switch (relatedTo) {
      case 'property':
        return properties;
      case 'tenant':
        return tenants;
      case 'unit':
        // Flatten all units from all properties
        return properties.flatMap(property => 
          property.units.map(unit => ({
            id: unit.id,
            name: `${property.name}, Unit ${unit.unitNumber}`
          }))
        );
      default:
        return [];
    }
  };
  
  const relatedEntities = getRelatedEntities();
  
  const pickImage = async (useCamera = false) => {
    try {
      let result;
      
      if (useCamera) {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Camera permission is required to take photos');
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
      } else {
        // Request media library permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Media library permission is required to select photos');
          return;
        }
        
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
      }
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setDocumentSource({
          type: 'image',
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          mimeType: asset.mimeType || 'image/jpeg',
          size: asset.fileSize
        });
        
        // Auto-set name if not already set
        if (!name) {
          setName(asset.fileName || `Document ${new Date().toLocaleDateString()}`);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true
      });
      
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setDocumentSource({
          type: 'document',
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType,
          size: asset.size
        });
        
        // Auto-set name if not already set
        if (!name) {
          setName(asset.name);
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };
  
  const clearDocumentSource = () => {
    setDocumentSource(null);
  };
  
  const handleSubmit = () => {
    // Validate required fields
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter document name');
      return;
    }
    
    if (!documentSource) {
      Alert.alert('Error', 'Please select a document or image');
      return;
    }
    
    if (!relatedId) {
      Alert.alert('Error', `Please select a ${relatedTo}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addDocument({
        name,
        type,
        source: documentSource,
        uploadDate: new Date().toISOString(),
        relatedTo,
        relatedId
      });
      
      router.replace('/documents');
    } catch (error) {
      Alert.alert('Error', 'Failed to add document');
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
          <Text style={styles.label}>Document Name</Text>
          <View style={styles.inputContainer}>
            <FileText size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter document name"
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
          <Text style={styles.label}>Document Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeOption,
                type === 'lease' && styles.selectedTypeOption
              ]}
              onPress={() => setType('lease')}
            >
              <Text style={[
                styles.typeOptionText,
                type === 'lease' && styles.selectedTypeOptionText
              ]}>
                Lease
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeOption,
                type === 'receipt' && styles.selectedTypeOption
              ]}
              onPress={() => setType('receipt')}
            >
              <Text style={[
                styles.typeOptionText,
                type === 'receipt' && styles.selectedTypeOptionText
              ]}>
                Receipt
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeOption,
                type === 'utility' && styles.selectedTypeOption
              ]}
              onPress={() => setType('utility')}
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
              onPress={() => setType('maintenance')}
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
                type === 'other' && styles.selectedTypeOption
              ]}
              onPress={() => setType('other')}
            >
              <Text style={[
                styles.typeOptionText,
                type === 'other' && styles.selectedTypeOptionText
              ]}>
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Document Source</Text>
          
          {!documentSource ? (
            <View style={styles.uploadOptions}>
              <TouchableOpacity 
                style={styles.uploadOption} 
                onPress={() => pickImage(false)}
              >
                <View style={styles.uploadIconContainer}>
                  <ImageIcon size={24} color={colors.primary} />
                </View>
                <Text style={styles.uploadOptionText}>Photo Library</Text>
              </TouchableOpacity>
              
              {Platform.OS !== 'web' && (
                <TouchableOpacity 
                  style={styles.uploadOption} 
                  onPress={() => pickImage(true)}
                >
                  <View style={styles.uploadIconContainer}>
                    <Camera size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.uploadOptionText}>Take Photo</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.uploadOption} 
                onPress={pickDocument}
              >
                <View style={styles.uploadIconContainer}>
                  <FileText size={24} color={colors.primary} />
                </View>
                <Text style={styles.uploadOptionText}>Document</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.selectedDocumentContainer}>
              {documentSource.type === 'image' && (
                <Image 
                  source={{ uri: documentSource.uri }} 
                  style={styles.previewImage} 
                  resizeMode="cover"
                />
              )}
              
              {documentSource.type === 'document' && (
                <View style={styles.documentPreview}>
                  <FileText size={32} color={colors.primary} />
                  <Text style={styles.documentName} numberOfLines={1} ellipsizeMode="middle">
                    {documentSource.name}
                  </Text>
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={clearDocumentSource}
              >
                <X size={18} color={colors.text.tertiary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Related To</Text>
          <View style={styles.relatedSelector}>
            <TouchableOpacity
              style={[
                styles.relatedOption,
                relatedTo === 'property' && styles.selectedRelatedOption
              ]}
              onPress={() => {
                setRelatedTo('property');
                setRelatedId('');
              }}
            >
              <Text style={[
                styles.relatedOptionText,
                relatedTo === 'property' && styles.selectedRelatedOptionText
              ]}>
                Property
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.relatedOption,
                relatedTo === 'tenant' && styles.selectedRelatedOption
              ]}
              onPress={() => {
                setRelatedTo('tenant');
                setRelatedId('');
              }}
            >
              <Text style={[
                styles.relatedOptionText,
                relatedTo === 'tenant' && styles.selectedRelatedOptionText
              ]}>
                Tenant
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.relatedOption,
                relatedTo === 'unit' && styles.selectedRelatedOption
              ]}
              onPress={() => {
                setRelatedTo('unit');
                setRelatedId('');
              }}
            >
              <Text style={[
                styles.relatedOptionText,
                relatedTo === 'unit' && styles.selectedRelatedOptionText
              ]}>
                Unit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Select {relatedTo.charAt(0).toUpperCase() + relatedTo.slice(1)}
          </Text>
          <ScrollView 
            style={styles.entitySelector}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {relatedEntities.length > 0 ? (
              relatedEntities.map((entity: any) => (
                <TouchableOpacity
                  key={entity.id}
                  style={[
                    styles.entityOption,
                    relatedId === entity.id && styles.selectedEntityOption
                  ]}
                  onPress={() => setRelatedId(entity.id)}
                >
                  <Text style={[
                    styles.entityOptionText,
                    relatedId === entity.id && styles.selectedEntityOptionText
                  ]}>
                    {entity.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noEntitiesMessage}>
                <Text style={styles.noEntitiesText}>
                  No {relatedTo}s available
                </Text>
              </View>
            )}
          </ScrollView>
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
          title="Add Document"
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
    marginBottom: 8,
    minWidth: '30%',
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
  uploadOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  uploadOption: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 12,
  },
  uploadIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    borderStyle: 'dashed',
  },
  uploadOptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  selectedDocumentContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentName: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  clearButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  relatedSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  relatedOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    alignItems: 'center',
  },
  selectedRelatedOption: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  relatedOptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  selectedRelatedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  entitySelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  entityOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedEntityOption: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  entityOptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  selectedEntityOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  noEntitiesMessage: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  noEntitiesText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
});