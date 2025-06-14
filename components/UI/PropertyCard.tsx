import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, Home, Users } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Property } from '@/types';

type PropertyCardProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  
  const occupancyRate = property.totalUnits > 0 
    ? Math.round((property.occupiedUnits / property.totalUnits) * 100) 
    : 0;
  
  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }} 
          style={styles.image} 
          resizeMode="cover"
        />
        <View style={styles.occupancyBadge}>
          <Text style={styles.occupancyText}>{occupancyRate}% Occupied</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{property.name}</Text>
        <Text style={styles.address}>{property.address}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Building2 size={16} color={colors.primary} />
            <Text style={styles.statText}>{property.totalUnits} Units</Text>
          </View>
          
          <View style={styles.statItem}>
            <Users size={16} color={colors.primary} />
            <Text style={styles.statText}>{property.occupiedUnits} Tenants</Text>
          </View>
          
          <View style={styles.statItem}>
            <Home size={16} color={colors.primary} />
            <Text style={styles.statText}>৳{property.monthlyRevenue.toLocaleString()}/mo</Text>
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
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
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
    color: colors.text.primary,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: colors.text.secondary,
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
    color: colors.text.secondary,
    marginLeft: 4,
  },
});