import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Download, Edit2, ExternalLink, FileText, Trash2, User, Link as LinkIcon } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import Button from '@/components/UI/Button';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { documents, tenants, properties, deleteDocument } = useAppStore();
  
  const document = documents.find(d => d.id === id);
  
  if (!document) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Document not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          variant="primary"
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }
  
  const getRelatedEntityName = () => {
    if (document.relatedTo === 'property') {
      const property = properties.find(p => p.id === document.relatedId);
      return property?.name || 'Unknown Property';
    } else if (document.relatedTo === 'tenant') {
      const tenant = tenants.find(t => t.id === document.relatedId);
      return tenant?.name || 'Unknown Tenant';
    } else if (document.relatedTo === 'unit') {
      let unitInfo = 'Unknown Unit';
      properties.forEach(property => {
        const unit = property.units.find(u => u.id === document.relatedId);
        if (unit) {
          unitInfo = `${property.name}, Unit ${unit.unitNumber}`;
        }
      });
      return unitInfo;
    }
    return 'Unknown';
  };
  
  const handleDeleteDocument = () => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteDocument(id);
            router.replace('/documents');
          }
        }
      ]
    );
  };
  
  const handleEditDocument = () => {
    // Navigate to edit document screen (not implemented in this example)
    Alert.alert("Edit Document", "Edit document functionality would go here");
  };
  
  const handleOpenDocument = () => {
    Linking.openURL(document.url);
  };
  
  const getDocumentTypeIcon = () => {
    switch (document.type) {
      case 'lease':
        return <FileText size={32} color={colors.primary} />;
      case 'receipt':
        return <FileText size={32} color={colors.success} />;
      case 'utility':
        return <FileText size={32} color={colors.warning} />;
      case 'maintenance':
        return <FileText size={32} color={colors.accent} />;
      default:
        return <FileText size={32} color={colors.text.secondary} />;
    }
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            {document.type === 'lease' && <FileText size={32} color={colors.primary} />}
            {document.type === 'receipt' && <FileText size={32} color={colors.success} />}
            {document.type === 'utility' && <FileText size={32} color={colors.warning} />}
            {document.type === 'maintenance' && <FileText size={32} color={colors.accent} />}
            {document.type === 'other' && <FileText size={32} color={colors.text.secondary} />}
          </View>
          <Text style={styles.documentName}>{document.name}</Text>
          <Text style={styles.documentType}>
            {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditDocument}
          >
            <Edit2 size={18} color={colors.text.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteDocument}
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
              <Text style={styles.infoLabel}>Upload Date</Text>
              <Text style={styles.infoValue}>
                {new Date(document.uploadDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <User size={18} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Related To</Text>
              <Text style={styles.infoValue}>
                {document.relatedTo.charAt(0).toUpperCase() + document.relatedTo.slice(1)}: {getRelatedEntityName()}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <LinkIcon size={18} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Document URL</Text>
              <Text 
                style={[styles.infoValue, styles.urlText]}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {document.url}
              </Text>
            </View>
          </View>
        </View>
        
        <Button
          title="Open Document"
          onPress={handleOpenDocument}
          variant="primary"
          icon={<ExternalLink size={16} color={colors.card} />}
          style={styles.openButton}
        />
        
        {Platform.OS !== 'web' && (
          <Button
            title="Download Document"
            onPress={() => {
              // This would download the document (not implemented in this example)
              Alert.alert("Download Document", "Download functionality would go here");
            }}
            variant="outline"
            icon={<Download size={16} color={colors.primary} />}
            style={styles.downloadButton}
          />
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
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  documentType: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  headerActions: {
    position: 'absolute',
    top: 24,
    right: 24,
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
  urlText: {
    color: colors.primary,
  },
  openButton: {
    marginBottom: 12,
  },
  downloadButton: {
    marginBottom: 24,
  },
});