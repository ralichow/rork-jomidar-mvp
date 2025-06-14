import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Search, Users } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import TenantCard from '@/components/UI/TenantCard';
import Button from '@/components/UI/Button';

export default function TenantsScreen() {
  const router = useRouter();
  const tenants = useAppStore((state) => state.tenants);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.phone.includes(searchQuery) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddTenant = () => {
    router.push('/tenant/add');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tenants..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.text.tertiary}
          />
        </View>
        
        <Button
          title="Add"
          onPress={handleAddTenant}
          variant="primary"
          size="small"
          icon={<Plus size={16} color={colors.card} />}
        />
      </View>
      
      {filteredTenants.length > 0 ? (
        <FlatList
          data={filteredTenants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TenantCard tenant={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Users size={64} color={`${colors.text.tertiary}80`} />
          <Text style={styles.emptyTitle}>No tenants found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery 
              ? "Try a different search term" 
              : "Add your first tenant to get started"}
          </Text>
          
          {!searchQuery && (
            <Button
              title="Add Tenant"
              onPress={handleAddTenant}
              variant="primary"
              style={styles.addButton}
              icon={<Plus size={16} color={colors.card} />}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: colors.text.primary,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    marginTop: 16,
  },
});