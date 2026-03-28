import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, Filter, Plus, Search } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import DocumentCard from '@/components/UI/DocumentCard';
import Button from '@/components/UI/Button';
import { Document } from '@/types';

export default function DocumentsScreen() {
  const router = useRouter();
  const documents = useAppStore((state) => state.documents);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<Document['type'] | 'all'>('all');
  
  const filteredDocuments = documents
    .filter(document => 
      typeFilter === 'all' || document.type === typeFilter
    )
    .filter(document => {
      if (!searchQuery) return true;
      
      return document.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  
  const handleAddDocument = () => {
    router.push('/document/add');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.text.tertiary}
          />
        </View>
        
        <Button
          title="Add"
          onPress={handleAddDocument}
          variant="primary"
          size="small"
          icon={<Plus size={16} color={colors.card} />}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            typeFilter === 'all' && styles.activeFilterButton
          ]}
          onPress={() => setTypeFilter('all')}
        >
          <Text style={[
            styles.filterText,
            typeFilter === 'all' && styles.activeFilterText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            typeFilter === 'lease' && styles.activeFilterButton
          ]}
          onPress={() => setTypeFilter('lease')}
        >
          <Text style={[
            styles.filterText,
            typeFilter === 'lease' && styles.activeFilterText
          ]}>
            Lease
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            typeFilter === 'receipt' && styles.activeFilterButton
          ]}
          onPress={() => setTypeFilter('receipt')}
        >
          <Text style={[
            styles.filterText,
            typeFilter === 'receipt' && styles.activeFilterText
          ]}>
            Receipt
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            typeFilter === 'other' && styles.activeFilterButton
          ]}
          onPress={() => setTypeFilter('other')}
        >
          <Text style={[
            styles.filterText,
            typeFilter === 'other' && styles.activeFilterText
          ]}>
            Other
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredDocuments.length > 0 ? (
        <FlatList
          data={filteredDocuments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DocumentCard document={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FileText size={64} color={`${colors.text.tertiary}80`} />
          <Text style={styles.emptyTitle}>No documents found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery || typeFilter !== 'all'
              ? "Try different search terms or filters" 
              : "Add your first document to get started"}
          </Text>
          
          {!searchQuery && typeFilter === 'all' && (
            <Button
              title="Add Document"
              onPress={handleAddDocument}
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
    paddingBottom: 8,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
  },
  activeFilterButton: {
    backgroundColor: `${colors.primary}20`,
  },
  filterText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  activeFilterText: {
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
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