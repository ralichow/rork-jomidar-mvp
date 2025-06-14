import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, CreditCard, HomeIcon, Plus, Users, AlertCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/store/languageStore';
import StatCard from '@/components/UI/StatCard';
import PropertyCard from '@/components/UI/PropertyCard';
import TenantCard from '@/components/UI/TenantCard';
import PaymentCard from '@/components/UI/PaymentCard';

export default function DashboardScreen() {
  const router = useRouter();
  const { 
    properties, 
    tenants, 
    payments, 
    dashboardStats 
  } = useAppStore();
  
  const { t } = useTranslation();
  
  // Get recent data for dashboard
  const recentProperties = properties.slice(0, 2);
  const recentTenants = tenants.slice(0, 2);
  const recentPayments = payments
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  // Calculate pending/overdue payments
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const overduePayments = payments.filter(p => p.status === 'overdue');
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('app_name')}</Text>
        <Text style={styles.subtitle}>{t('app_subtitle')}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <StatCard
          title={t('properties')}
          value={dashboardStats.totalProperties}
          icon={<Building2 size={18} color={colors.primary} />}
          color={colors.primary}
        />
        
        <StatCard
          title={t('units')}
          value={dashboardStats.totalUnits}
          icon={<HomeIcon size={18} color={colors.secondary} />}
          color={colors.secondary}
        />
        
        <StatCard
          title={t('occupancy')}
          value={Math.round(dashboardStats.occupancyRate)}
          icon={<Users size={18} color={colors.accent} />}
          color={colors.accent}
          isPercentage
        />
        
        <StatCard
          title={t('monthly_revenue')}
          value={dashboardStats.monthlyRevenue}
          icon={<CreditCard size={18} color={colors.success} />}
          color={colors.success}
          isCurrency
        />
      </View>
      
      {(pendingPayments.length > 0 || overduePayments.length > 0) && (
        <View style={styles.alertContainer}>
          <View style={styles.alertHeader}>
            <AlertCircle size={20} color={colors.warning} />
            <Text style={styles.alertTitle}>{t('payment_alerts')}</Text>
          </View>
          
          {pendingPayments.length > 0 && (
            <TouchableOpacity 
              style={styles.alertItem}
              onPress={() => router.push('/payments')}
            >
              <Text style={styles.alertText}>
                {pendingPayments.length} {pendingPayments.length > 1 ? t('pending_payments_plural') : t('pending_payments')}
              </Text>
            </TouchableOpacity>
          )}
          
          {overduePayments.length > 0 && (
            <TouchableOpacity 
              style={styles.alertItem}
              onPress={() => router.push('/payments')}
            >
              <Text style={[styles.alertText, { color: colors.danger }]}>
                {overduePayments.length} {overduePayments.length > 1 ? t('overdue_payments_plural') : t('overdue_payments')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('properties')}</Text>
          <TouchableOpacity onPress={() => router.push('/properties')}>
            <Text style={styles.seeAllText}>{t('see_all')}</Text>
          </TouchableOpacity>
        </View>
        
        {recentProperties.length > 0 ? (
          recentProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <TouchableOpacity 
            style={styles.emptyState}
            onPress={() => router.push('/property/add')}
          >
            <Plus size={24} color={colors.primary} />
            <Text style={styles.emptyStateText}>{t('add_first_property')}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('recent_tenants')}</Text>
          <TouchableOpacity onPress={() => router.push('/tenants')}>
            <Text style={styles.seeAllText}>{t('see_all')}</Text>
          </TouchableOpacity>
        </View>
        
        {recentTenants.length > 0 ? (
          recentTenants.map(tenant => (
            <TenantCard key={tenant.id} tenant={tenant} />
          ))
        ) : (
          <TouchableOpacity 
            style={styles.emptyState}
            onPress={() => router.push('/tenant/add')}
          >
            <Plus size={24} color={colors.primary} />
            <Text style={styles.emptyStateText}>{t('add_first_tenant')}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('recent_payments')}</Text>
          <TouchableOpacity onPress={() => router.push('/payments')}>
            <Text style={styles.seeAllText}>{t('see_all')}</Text>
          </TouchableOpacity>
        </View>
        
        {recentPayments.length > 0 ? (
          recentPayments.map(payment => (
            <PaymentCard key={payment.id} payment={payment} />
          ))
        ) : (
          <TouchableOpacity 
            style={styles.emptyState}
            onPress={() => router.push('/payment/add')}
          >
            <Plus size={24} color={colors.primary} />
            <Text style={styles.emptyStateText}>{t('record_first_payment')}</Text>
          </TouchableOpacity>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  alertContainer: {
    margin: 16,
    marginTop: 0,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  alertItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  alertText: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 12,
    fontWeight: '500',
  },
});