import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, FileText, Image as ImageIcon } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Document } from '@/types';
import { useAppStore } from '@/store/appStore';

type DocumentCardProps = {
  document: Document;
};

export default function DocumentCard({ document }: DocumentCardProps) {
  const router = useRouter();
  const properties = useAppStore((state) => state.properties);
  const tenants = useAppStore((state) => state.tenants);
  
  const handlePress = () => {
    router.push(`/document/${document.id}`);
  };
  
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
  
  const getDocumentIcon = () => {
    // First check the document source type
    if (document.source?.type === 'image') {
      return (
        <Image 
          source={{ uri: document.source.uri }} 
          style={styles.thumbnailImage} 
          resizeMode="cover"
        />
      );
    }
    
    // If not an image or no source, use the document type icon
    switch (document.type) {
      case 'lease':
        return <FileText size={20} color={colors.primary} />;
      case 'receipt':
        return <FileText size={20} color={colors.success} />;
      case 'utility':
        return <FileText size={20} color={colors.warning} />;
      case 'maintenance':
        return <FileText size={20} color={colors.accent} />;
      default:
        return <FileText size={20} color={colors.text.secondary} />;
    }
  };
  
  const getSourceTypeIcon = () => {
    if (!document.source) return null;
    
    switch (document.source.type) {
      case 'image':
        return <ImageIcon size={14} color={colors.text.tertiary} />;
      case 'document':
        return <FileText size={14} color={colors.text.tertiary} />;
      default:
        return null;
    }
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
        {getDocumentIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{document.name}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Calendar size={14} color={colors.text.tertiary} />
            <Text style={styles.infoText}>
              {new Date(document.uploadDate).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            {getSourceTypeIcon()}
            <Text style={styles.infoText}>
              {getRelatedEntityName()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 4,
  },
});