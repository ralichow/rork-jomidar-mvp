import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, Home, Users, CreditCard, AlertTriangle, Plus } from 'lucide-react-native';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/store/languageStore';
import { useTheme } from '@/store/themeStore';
import { getColors } from '@/constants/colors';
import DashboardCard from '@/components/UI/DashboardCard';
import PropertyCard from '@/components/UI/PropertyCard';
import TenantCard from '@/components/UI/TenantCard';
import PaymentCard from '@/components/UI/PaymentCard';

export default function DashboardScreen() {
  const router = useRouter();
  const { properties, tenants, payments, getDashboardStats } = useAppStore();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
  const stats = getDashboardStats();
  
  const recentTenants = tenants.slice(0, 3);
  const recentPayments = payments.slice(0, 3);
  
  const renderEmptyState = () => {
    if (properties.length === 0) {
      return (
        <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
          <Building2 size={48} color={colors.primary} />
          <Text style={[styles.emptyStateTitle, { color: colors.text.primary }]}>
            {t('add_first_property')}
          </Text>
          <TouchableOpacity
            style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/property/add')}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.emptyStateButtonText}>{t('add_property')}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (tenants.length === 0) {
      return (
        <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
          <Users size={48} color={colors.primary} />
          <Text style={[styles.emptyStateTitle, { color: colors.text.primary }]}>
            {t('add_first_tenant')}
          </Text>
          <TouchableOpacity
            style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/tenant/add')}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.emptyStateButtonText}>{t('add_tenant')}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (payments.length === 0) {
      return (
        <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
          <CreditCard size={48} color={colors.primary} />
          <Text style={[styles.emptyStateTitle, { color: colors.text.primary }]}>
            {t('record_first_payment')}
          </Text>
          <TouchableOpacity
            style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/payment/add')}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.emptyStateButtonText}>{t('record_payment')}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return null;
  };
  
  const renderDashboardContent = () => {
    if (properties.length === 0 || tenants.length === 0 || payments.length === 0) {
      return renderEmptyState();
    }
    
    return (
      <>
        <View style={styles.statsContainer}>
          <DashboardCard
            title={t('properties')}
            value={stats.totalProperties}
            icon={<Building2 size={20} color={colors.primary} />}
            width="48%"
          />
          <DashboardCard
            title={t('units')}
            value={stats.totalUnits}
            icon={<Home size={20} color={colors.accent} />}
            color={colors.accent}
            width="48%"
          />
          <DashboardCard
            title={t('occupancy')}
            value={`${stats.occupancyRate}%`}
            icon={<Users size={20} color={colors.success} />}
            color={colors.success}
            width="48%"
          />
          <DashboardCard
            title={t('monthly_revenue')}
            value={`৳${stats.monthlyRevenue.toLocaleString()}`}
            icon={<CreditCard size={20} color={colors.info} />}
            color={colors.info}
            width="48%"
          />
        </View>
        
        {(stats.pendingPayments > 0 || stats.overduePayments > 0 || stats.underpaidPayments > 0) && (
          <View style={[styles.alertsContainer, { backgroundColor: `${colors.warning}15` }]}>
            <View style={styles.alertsHeader}>
              <AlertTriangle size={20} color={colors.warning} />
              <Text style={[styles.alertsTitle, { color: colors.text.primary }]}>
                {t('payment_alerts')}
              </Text>
            </View>
            
            <View style={styles.alertsList}>
              {stats.pendingPayments > 0 && (
                <Text style={[styles.alertItem, { color: colors.text.secondary }]}>
                  {stats.pendingPayments} {stats.pendingPayments === 1 ? t('pending_payments') : t('pending_payments_plural')}
                </Text>
              )}
              
              {stats.overduePayments > 0 && (
                <Text style={[styles.alertItem, { color: colors.text.secondary }]}>
                  {stats.overduePayments} {stats.overduePayments === 1 ? t('overdue_payments') : t('overdue_payments_plural')}
                </Text>
              )}
              
              {stats.underpaidPayments > 0 && (
                <Text style={[styles.alertItem, { color: colors.text.secondary }]}>
                  {stats.underpaidPayments} {stats.underpaidPayments === 1 ? t('underpaid_payments') : t('underpaid_payments_plural')}
                </Text>
              )}
            </View>
          </View>
        )}
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              {t('recent_tenants')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/tenants')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>{t('see_all')}</Text>
            </TouchableOpacity>
          </View>
          
          {recentTenants.map((tenant) => (
            <TenantCard key={tenant.id} tenant={tenant} />
          ))}
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              {t('recent_payments')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/payments')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>{t('see_all')}</Text>
            </TouchableOpacity>
          </View>
          
          {recentPayments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
        </View>
      </>
    );
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.appName, { color: colors.text.primary }]}>{t('app_name')}</Text>
      <Text style={[styles.appSubtitle, { color: colors.text.secondary }]}>{t('app_subtitle')}</Text>
      
      {renderDashboardContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  alertsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  alertsList: {
    gap: 8,
  },
  alertItem: {
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});