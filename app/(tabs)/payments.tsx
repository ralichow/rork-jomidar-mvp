import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, Download, Filter, Plus, Search } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import PaymentCard from '@/components/UI/PaymentCard';
import Button from '@/components/UI/Button';
import { generateAndSharePaymentsReport } from '@/utils/reportUtils';

export default function PaymentsScreen() {
  const router = useRouter();
  const { payments, tenants, properties } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue' | 'underpaid'>('all');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const filteredPayments = payments
    .filter(payment => 
      statusFilter === 'all' || payment.status === statusFilter
    )
    .filter(payment => {
      if (!searchQuery) return true;
      
      // Get tenant name for search
      const tenant = tenants.find(t => t.id === payment.tenantId);
      const tenantName = tenant?.name || '';
      
      return (
        tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.month.includes(searchQuery) ||
        payment.amount.toString().includes(searchQuery)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const handleAddPayment = () => {
    router.push('/payment/add');
  };
  
  const handleGenerateReport = async () => {
    try {
      setIsGeneratingReport(true);
      
      // Determine which payments to include in the report
      const paymentsToInclude = statusFilter === 'all' 
        ? filteredPayments 
        : payments.filter(p => p.status === statusFilter);
      
      // Generate report name based on filter
      const reportName = statusFilter === 'all' 
        ? 'all_payments' 
        : `${statusFilter}_payments`;
      
      await generateAndSharePaymentsReport(
        paymentsToInclude,
        tenants,
        properties,
        reportName
      );
    } catch (error) {
      Alert.alert("Error", "Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search payments..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.text.tertiary}
          />
        </View>
        
        <Button
          title="Add"
          onPress={handleAddPayment}
          variant="primary"
          size="small"
          icon={<Plus size={16} color={colors.card} />}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            statusFilter === 'all' && styles.activeFilterButton
          ]}
          onPress={() => setStatusFilter('all')}
        >
          <Text style={[
            styles.filterText,
            statusFilter === 'all' && styles.activeFilterText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            statusFilter === 'paid' && styles.activeFilterButton,
            statusFilter === 'paid' && { backgroundColor: `${colors.success}20` }
          ]}
          onPress={() => setStatusFilter('paid')}
        >
          <Text style={[
            styles.filterText,
            statusFilter === 'paid' && styles.activeFilterText,
            statusFilter === 'paid' && { color: colors.success }
          ]}>
            Paid
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            statusFilter === 'pending' && styles.activeFilterButton,
            statusFilter === 'pending' && { backgroundColor: `${colors.warning}20` }
          ]}
          onPress={() => setStatusFilter('pending')}
        >
          <Text style={[
            styles.filterText,
            statusFilter === 'pending' && styles.activeFilterText,
            statusFilter === 'pending' && { color: colors.warning }
          ]}>
            Pending
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            statusFilter === 'overdue' && styles.activeFilterButton,
            statusFilter === 'overdue' && { backgroundColor: `${colors.danger}20` }
          ]}
          onPress={() => setStatusFilter('overdue')}
        >
          <Text style={[
            styles.filterText,
            statusFilter === 'overdue' && styles.activeFilterText,
            statusFilter === 'overdue' && { color: colors.danger }
          ]}>
            Overdue
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            statusFilter === 'underpaid' && styles.activeFilterButton,
            statusFilter === 'underpaid' && { backgroundColor: `${colors.accent}20` }
          ]}
          onPress={() => setStatusFilter('underpaid')}
        >
          <Text style={[
            styles.filterText,
            statusFilter === 'underpaid' && styles.activeFilterText,
            statusFilter === 'underpaid' && { color: colors.accent }
          ]}>
            Underpaid
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredPayments.length > 0 ? (
        <>
          <View style={styles.reportButtonContainer}>
            <Button
              title="Download Report"
              onPress={handleGenerateReport}
              variant="outline"
              size="small"
              icon={<Download size={16} color={colors.primary} />}
              style={styles.reportButton}
              loading={isGeneratingReport}
              disabled={isGeneratingReport}
            />
          </View>
          
          <FlatList
            data={filteredPayments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PaymentCard payment={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <CreditCard size={64} color={`${colors.text.tertiary}80`} />
          <Text style={styles.emptyTitle}>No payments found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery || statusFilter !== 'all'
              ? "Try different search terms or filters" 
              : "Record your first payment to get started"}
          </Text>
          
          {!searchQuery && statusFilter === 'all' && (
            <Button
              title="Record Payment"
              onPress={handleAddPayment}
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
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
    marginBottom: 8,
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
  reportButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  reportButton: {
    alignSelf: 'flex-end',
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