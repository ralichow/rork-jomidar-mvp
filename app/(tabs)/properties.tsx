import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Building, Plus, Search } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import PropertyCard from '@/components/UI/PropertyCard';
import Button from '@/components/UI/Button';

export default function PropertiesScreen() {
  const router = useRouter();
  const properties = useAppStore((state) => state.properties);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddProperty = () => {
    router.push('/property/add');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.text.tertiary}
          />
        </View>
        
        <Button
          title="Add"
          onPress={handleAddProperty}
          variant="primary"
          size="small"
          icon={<Plus size={16} color={colors.card} />}
        />
      </View>
      
      {filteredProperties.length > 0 ? (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PropertyCard property={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Building size={64} color={`${colors.text.tertiary}80`} />
          <Text style={styles.emptyTitle}>No properties found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery 
              ? "Try a different search term" 
              : "Add your first property to get started"}
          </Text>
          
          {!searchQuery && (
            <Button
              title="Add Property"
              onPress={handleAddProperty}
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