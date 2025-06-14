import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, CreditCard, HomeIcon, Plus, Users, AlertCircle, FileText } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/store/languageStore';
import StatCard from '@/components/UI/StatCard';
import DashboardCard from '@/components/UI/DashboardCard';

export default function DashboardScreen() {
  const router = useRouter();
  const { 
    properties, 
    tenants, 
    payments, 
    documents,
    dashboardStats 
  } = useAppStore();
  
  const { t } = useTranslation();
  
  // Calculate pending/overdue/underpaid payments
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const overduePayments = payments.filter(p => p.status === 'overdue');
  const underpaidPayments = payments.filter(p => p.status === 'underpaid');
  
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky Header - Only this part should be sticky */}
        <View style={styles.stickyHeader}>
          <Text style={styles.appName}>{t('app_name')}</Text>
        </View>
        
        {/* Stats Section - This should scroll normally */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
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
          </View>
          
          <View style={styles.statsRow}>
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
        </View>
        
        {(pendingPayments.length > 0 || overduePayments.length > 0 || underpaidPayments.length > 0) && (
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
            
            {underpaidPayments.length > 0 && (
              <TouchableOpacity 
                style={styles.alertItem}
                onPress={() => router.push('/payments')}
              >
                <Text style={[styles.alertText, { color: colors.accent }]}>
                  {underpaidPayments.length} {underpaidPayments.length > 1 ? t('underpaid_payments_plural') : t('underpaid_payments')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('manage_your_properties')}</Text>
          
          <DashboardCard
            title={t('properties')}
            count={properties.length}
            icon={<Building2 size={24} color={colors.primary} />}
            onPress={() => router.push('/properties')}
            color={colors.primary}
          />
          
          <DashboardCard
            title={t('tenants')}
            count={tenants.length}
            icon={<Users size={24} color={colors.secondary} />}
            onPress={() => router.push('/tenants')}
            color={colors.secondary}
          />
          
          <DashboardCard
            title={t('payments')}
            count={payments.length}
            icon={<CreditCard size={24} color={colors.success} />}
            onPress={() => router.push('/payments')}
            color={colors.success}
          />
          
          <DashboardCard
            title={t('documents')}
            count={documents.length}
            icon={<FileText size={24} color={colors.accent} />}
            onPress={() => router.push('/documents')}
            color={colors.accent}
          />
        </View>
        
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>{t('quick_actions')}</Text>
          
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/property/add')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Building2 size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>{t('add_property')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/tenant/add')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.secondary}15` }]}>
                <Users size={24} color={colors.secondary} />
              </View>
              <Text style={styles.quickActionText}>{t('add_tenant')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/payment/add')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.success}15` }]}>
                <CreditCard size={24} color={colors.success} />
              </View>
              <Text style={styles.quickActionText}>{t('record_payment')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/document/add')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.accent}15` }]}>
                <FileText size={24} color={colors.accent} />
              </View>
              <Text style={styles.quickActionText}>{t('add_document')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  stickyHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAction: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
});