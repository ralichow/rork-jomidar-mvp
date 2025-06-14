import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, Home, Users } from 'lucide-react-native';
import { Property } from '@/types';
import { useTranslation } from '@/store/languageStore';
import { useTheme } from '@/store/themeStore';
import { getColors } from '@/constants/colors';

type PropertyCardProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
  const occupancyRate = property.totalUnits > 0 
    ? Math.round((property.occupiedUnits / property.totalUnits) * 100) 
    : 0;
  
  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { 
        backgroundColor: colors.card,
        shadowColor: isDark ? 'rgba(0, 0, 0, 0.3)' : '#000',
      }]} 
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }} 
          style={styles.image} 
          resizeMode="cover"
        />
        <View style={styles.occupancyBadge}>
          <Text style={styles.occupancyText}>{occupancyRate}% {t('occupied')}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text.primary }]}>{property.name}</Text>
        <Text style={[styles.address, { color: colors.text.secondary }]}>{property.address}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Building2 size={16} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.text.secondary }]}>{property.totalUnits} {t('units')}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Users size={16} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.text.secondary }]}>{property.occupiedUnits} {t('tenants')}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Home size={16} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.text.secondary }]}>৳{property.monthlyRevenue.toLocaleString()}{t('per_month')}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  occupancyBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  occupancyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    marginLeft: 4,
  },
});