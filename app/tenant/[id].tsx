import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Edit2, Home, Mail, Phone, Trash2, FileText, Plus, CreditCard as CreditCardIcon } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import Button from '@/components/UI/Button';
import DocumentCard from '@/components/UI/DocumentCard';
import PaymentCard from '@/components/UI/PaymentCard';

export default function TenantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tenants, properties, payments, documents, deleteTenant } = useAppStore();
  
  const tenant = tenants.find(t => t.id === id);
  
  if (!tenant) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Tenant not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          variant="primary"
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }
  
  const property = properties.find(p => p.id === tenant.propertyId);
  const unit = property?.units.find(u => u.id === tenant.unitId);
  
  const tenantDocuments = documents.filter(
    doc => doc.relatedTo === 'tenant' && doc.relatedId === tenant.id
  );
  
  const tenantPayments = payments
    .filter(payment => payment.tenantId === tenant.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Calculate days remaining in lease
  const today = new Date();
  const leaseEnd = new Date(tenant.leaseEnd);
  const daysRemaining = Math.ceil((leaseEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const leaseStatus = daysRemaining <= 0 
    ? 'Expired' 
    : daysRemaining <= 30 
      ? 'Expiring Soon' 
      : 'Active';
  
  const leaseStatusColor = 
    leaseStatus === 'Expired' 
      ? colors.danger 
      : leaseStatus === 'Expiring Soon' 
        ? colors.warning 
        : colors.success;
  
  const handleDeleteTenant = () => {
    Alert.alert(
      "Delete Tenant",
      "Are you sure you want to delete this tenant? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteTenant(id);
            router.replace('/tenants');
          }
        }
      ]
    );
  };
  
  const handleEditTenant = () => {
    // Navigate to edit tenant screen (not implemented in this example)
    Alert.alert("Edit Tenant", "Edit tenant functionality would go here");
  };
  
  const handleAddDocument = () => {
    router.push('/document/add');
  };
  
  const handleAddPayment = () => {
    router.push('/payment/add');
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image 
          source={{ uri: tenant.photo || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }} 
          style={styles.avatar} 
        />
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditTenant}
          >
            <Edit2 size={18} color={colors.text.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteTenant}
          >
            <Trash2 size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.tenantName}>{tenant.name}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Phone size={18} color={colors.primary} />
            <Text style={styles.infoText}>{tenant.phone}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Mail size={18} color={colors.primary} />
            <Text style={styles.infoText}>{tenant.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Home size={18} color={colors.primary} />
            <Text style={styles.infoText}>
              {property?.name}, Unit {unit?.unitNumber}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Calendar size={18} color={colors.primary} />
            <Text style={styles.infoText}>
              NID: {tenant.nidNumber}
            </Text>
          </View>
        </View>
        
        <View style={styles.leaseContainer}>
          <View style={styles.leaseHeader}>
            <Text style={styles.leaseTitle}>Lease Information</Text>
            <View style={[
              styles.leaseStatusBadge,
              { backgroundColor: `${leaseStatusColor}20` }
            ]}>
              <Text style={[
                styles.leaseStatusText,
                { color: leaseStatusColor }
              ]}>
                {leaseStatus}
              </Text>
            </View>
          </View>
          
          <View style={styles.leaseDetails}>
            <View style={styles.leaseDetail}>
              <Text style={styles.leaseDetailLabel}>Start Date</Text>
              <Text style={styles.leaseDetailValue}>
                {new Date(tenant.leaseStart).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.leaseDetail}>
              <Text style={styles.leaseDetailLabel}>End Date</Text>
              <Text style={styles.leaseDetailValue}>
                {new Date(tenant.leaseEnd).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.leaseDetail}>
              <Text style={styles.leaseDetailLabel}>Monthly Rent</Text>
              <Text style={styles.leaseDetailValue}>
                ৳{tenant.monthlyRent.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.leaseDetail}>
              <Text style={styles.leaseDetailLabel}>Security Deposit</Text>
              <Text style={styles.leaseDetailValue}>
                ৳{tenant.securityDeposit.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <Button
            title="Add"
            onPress={handleAddDocument}
            variant="outline"
            size="small"
            icon={<Plus size={16} color={colors.primary} />}
          />
        </View>
        
        {tenantDocuments.length > 0 ? (
          tenantDocuments.map(document => (
            <DocumentCard key={document.id} document={document} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <FileText size={32} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>No documents added yet</Text>
          </View>
        )}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          <Button
            title="Add"
            onPress={handleAddPayment}
            variant="outline"
            size="small"
            icon={<Plus size={16} color={colors.primary} />}
          />
        </View>
        
        {tenantPayments.length > 0 ? (
          tenantPayments.map(payment => (
            <PaymentCard key={payment.id} payment={payment} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <CreditCardIcon size={32} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>No payment records yet</Text>
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
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.card,
  },
  headerActions: {
    position: 'absolute',
    top: 24,
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
  tenantName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 12,
  },
  leaseContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  leaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leaseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  leaseStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  leaseStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  leaseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  leaseDetail: {
    width: '50%',
    marginBottom: 16,
  },
  leaseDetailLabel: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  leaseDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  emptyState: {
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
    marginTop: 12,
  },
});