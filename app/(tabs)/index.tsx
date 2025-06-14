import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, Home, Users, CreditCard, AlertTriangle, Plus, ArrowRight } from 'lucide-react-native';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/store/languageStore';
import { useTheme } from '@/store/themeStore';
import { getColors } from '@/constants/colors';
import DashboardCard from '@/components/UI/DashboardCard';

export default function DashboardScreen() {
  const router = useRouter();
  const { properties, tenants, payments, dashboardStats } = useAppStore();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
  // Recalculate stats on component mount
  React.useEffect(() => {
    const appStore = useAppStore.getState();
    appStore.recalculateStats();
  }, []);
  
  const stats = dashboardStats;
  
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
            value={`${stats.occupancyRate.toFixed(0)}%`}
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
        
        <Text style={[styles.sectionTitle, { color: colors.text.primary, marginTop: 24 }]}>
          {t('manage_your_properties')}
        </Text>
        
        <View style={styles.cardGrid}>
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.card }]} 
            onPress={() => router.push('/(tabs)/properties')}
          >
            <View style={[styles.cardIconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Building2 size={24} color={colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text.primary }]}>{t('properties')}</Text>
            <Text style={[styles.cardValue, { color: colors.text.secondary }]}>
              {stats.totalProperties} {t('properties')}
            </Text>
            <View style={styles.cardAction}>
              <ArrowRight size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.card }]} 
            onPress={() => router.push('/(tabs)/tenants')}
          >
            <View style={[styles.cardIconContainer, { backgroundColor: `${colors.accent}15` }]}>
              <Users size={24} color={colors.accent} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text.primary }]}>{t('tenants')}</Text>
            <Text style={[styles.cardValue, { color: colors.text.secondary }]}>
              {tenants.length} {tenants.length === 1 ? t('tenant') : t('tenants')}
            </Text>
            <View style={styles.cardAction}>
              <ArrowRight size={16} color={colors.accent} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.card }]} 
            onPress={() => router.push('/(tabs)/payments')}
          >
            <View style={[styles.cardIconContainer, { backgroundColor: `${colors.success}15` }]}>
              <CreditCard size={24} color={colors.success} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text.primary }]}>{t('payments')}</Text>
            <Text style={[styles.cardValue, { color: colors.text.secondary }]}>
              {payments.length} {payments.length === 1 ? t('payment') : t('payments')}
            </Text>
            <View style={styles.cardAction}>
              <ArrowRight size={16} color={colors.success} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.card }]} 
            onPress={() => router.push('/(tabs)/documents')}
          >
            <View style={[styles.cardIconContainer, { backgroundColor: `${colors.info}15` }]}>
              <FileText size={24} color={colors.info} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text.primary }]}>{t('documents')}</Text>
            <Text style={[styles.cardValue, { color: colors.text.secondary }]}>
              {/* Get document count from store */}
              {useAppStore.getState().documents.length} {useAppStore.getState().documents.length === 1 ? t('document') : t('documents')}
            </Text>
            <View style={styles.cardAction}>
              <ArrowRight size={16} color={colors.info} />
            </View>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text.primary, marginTop: 24 }]}>
          {t('quick_actions')}
        </Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/property/add')}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.actionButtonText}>{t('add_property')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/tenant/add')}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.actionButtonText}>{t('add_tenant')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.success }]}
            onPress={() => router.push('/payment/add')}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.actionButtonText}>{t('record_payment')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.info }]}
            onPress={() => router.push('/document/add')}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.actionButtonText}>{t('add_document')}</Text>
          </TouchableOpacity>
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
    marginBottom: 8,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardAction: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
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