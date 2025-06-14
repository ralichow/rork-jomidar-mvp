import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Building2, Edit2, HomeIcon, Plus, Trash2, Users } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import Button from '@/components/UI/Button';
import StatCard from '@/components/UI/StatCard';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { properties, tenants, deleteProperty } = useAppStore();
  
  const property = properties.find(p => p.id === id);
  
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
  
  const propertyTenants = tenants.filter(tenant => tenant.propertyId === id);
  
  const occupancyRate = property.totalUnits > 0 
    ? Math.round((property.occupiedUnits / property.totalUnits) * 100) 
    : 0;
  
  const handleDeleteProperty = () => {
    Alert.alert(
      "Delete Property",
      "Are you sure you want to delete this property? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteProperty(id);
            router.replace('/properties');
          }
        }
      ]
    );
  };
  
  const handleEditProperty = () => {
    // Navigate to edit property screen (not implemented in this example)
    Alert.alert("Edit Property", "Edit property functionality would go here");
  };
  
  const handleAddUnit = () => {
    // Navigate to add unit screen (not implemented in this example)
    Alert.alert("Add Unit", "Add unit functionality would go here");
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        <View style={styles.imageOverlay}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProperty}
          >
            <Edit2 size={18} color={colors.text.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteProperty}
          >
            <Trash2 size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.propertyName}>{property.name}</Text>
        <Text style={styles.propertyAddress}>{property.address}</Text>
        
        <View style={styles.statsContainer}>
          <StatCard
            title="Units"
            value={property.totalUnits}
            icon={<HomeIcon size={18} color={colors.primary} />}
            color={colors.primary}
          />
          
          <StatCard
            title="Occupancy"
            value={occupancyRate}
            icon={<Users size={18} color={colors.secondary} />}
            color={colors.secondary}
            isPercentage
          />
          
          <StatCard
            title="Monthly Revenue"
            value={property.monthlyRevenue}
            icon={<Building2 size={18} color={colors.success} />}
            color={colors.success}
            isCurrency
          />
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Units</Text>
          <Button
            title="Add Unit"
            onPress={handleAddUnit}
            variant="outline"
            size="small"
            icon={<Plus size={16} color={colors.primary} />}
          />
        </View>
        
        {property.units.length > 0 ? (
          property.units.map(unit => {
            const tenant = tenants.find(t => t.unitId === unit.id);
            
            return (
              <TouchableOpacity 
                key={unit.id} 
                style={styles.unitCard}
                onPress={() => Alert.alert("Unit Details", `Details for Unit ${unit.unitNumber}`)}
              >
                <View style={styles.unitHeader}>
                  <Text style={styles.unitNumber}>Unit {unit.unitNumber}</Text>
                  <View style={[
                    styles.statusBadge,
                    { 
                      backgroundColor: unit.status === 'occupied' 
                        ? `${colors.success}20` 
                        : `${colors.text.tertiary}20` 
                    }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { 
                        color: unit.status === 'occupied' 
                          ? colors.success 
                          : colors.text.tertiary 
                      }
                    ]}>
                      {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.unitDetails}>
                  <View style={styles.unitDetail}>
                    <Text style={styles.unitDetailLabel}>Floor</Text>
                    <Text style={styles.unitDetailValue}>{unit.floor}</Text>
                  </View>
                  
                  <View style={styles.unitDetail}>
                    <Text style={styles.unitDetailLabel}>Size</Text>
                    <Text style={styles.unitDetailValue}>{unit.size} sqft</Text>
                  </View>
                  
                  <View style={styles.unitDetail}>
                    <Text style={styles.unitDetailLabel}>Bedrooms</Text>
                    <Text style={styles.unitDetailValue}>{unit.bedrooms}</Text>
                  </View>
                  
                  <View style={styles.unitDetail}>
                    <Text style={styles.unitDetailLabel}>Bathrooms</Text>
                    <Text style={styles.unitDetailValue}>{unit.bathrooms}</Text>
                  </View>
                </View>
                
                <View style={styles.unitFooter}>
                  <Text style={styles.rentAmount}>৳{unit.rent.toLocaleString()}/month</Text>
                  
                  {tenant ? (
                    <TouchableOpacity
                      onPress={() => router.push(`/tenant/${tenant.id}`)}
                    >
                      <Text style={styles.tenantLink}>
                        Tenant: {tenant.name}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.addTenantButton}
                      onPress={() => router.push('/tenant/add')}
                    >
                      <Plus size={14} color={colors.primary} />
                      <Text style={styles.addTenantText}>Add Tenant</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyUnits}>
            <Text style={styles.emptyText}>No units added yet</Text>
            <Button
              title="Add First Unit"
              onPress={handleAddUnit}
              variant="primary"
              style={{ marginTop: 16 }}
              icon={<Plus size={16} color={colors.card} />}
            />
          </View>
        )}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tenants</Text>
        </View>
        
        {propertyTenants.length > 0 ? (
          propertyTenants.map(tenant => {
            const unit = property.units.find(u => u.id === tenant.unitId);
            
            return (
              <TouchableOpacity 
                key={tenant.id} 
                style={styles.tenantCard}
                onPress={() => router.push(`/tenant/${tenant.id}`)}
              >
                <View style={styles.tenantInfo}>
                  <Text style={styles.tenantName}>{tenant.name}</Text>
                  <Text style={styles.tenantUnit}>Unit {unit?.unitNumber}</Text>
                </View>
                
                <View style={styles.tenantContact}>
                  <Text style={styles.tenantPhone}>{tenant.phone}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyTenants}>
            <Text style={styles.emptyText}>No tenants for this property</Text>
            <Button
              title="Add Tenant"
              onPress={() => router.push('/tenant/add')}
              variant="primary"
              style={{ marginTop: 16 }}
              icon={<Plus size={16} color={colors.card} />}
            />
          </View>
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
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  propertyName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  unitCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  unitNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  unitDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  unitDetail: {
    width: '50%',
    marginBottom: 8,
  },
  unitDetailLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  unitDetailValue: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  unitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  rentAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  tenantLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  addTenantButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTenantText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyUnits: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  tenantCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  tenantUnit: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  tenantContact: {
    alignItems: 'flex-end',
  },
  tenantPhone: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  emptyTenants: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
});