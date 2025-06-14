import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Home, Phone } from 'lucide-react-native';
import { Tenant } from '@/types';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/store/languageStore';
import { useTheme } from '@/store/themeStore';
import { getColors } from '@/constants/colors';

type TenantCardProps = {
  tenant: Tenant;
};

export default function TenantCard({ tenant }: TenantCardProps) {
  const router = useRouter();
  const properties = useAppStore((state) => state.properties);
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
  const property = properties.find(p => p.id === tenant.propertyId);
  const unit = property?.units.find(u => u.id === tenant.unitId);
  
  const handlePress = () => {
    router.push(`/tenant/${tenant.id}`);
  };
  
  // Calculate days remaining in lease
  const today = new Date();
  const leaseEnd = new Date(tenant.leaseEnd);
  const daysRemaining = Math.ceil((leaseEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const leaseStatus = daysRemaining <= 0 
    ? t('expired')
    : daysRemaining <= 30 
      ? t('expiring_soon')
      : t('active');
  
  const leaseStatusColor = 
    leaseStatus === t('expired')
      ? colors.danger 
      : leaseStatus === t('expiring_soon')
        ? colors.warning 
        : colors.success;
  
  return (
    <TouchableOpacity 
      style={[styles.container, { 
        backgroundColor: colors.card,
        shadowColor: isDark ? 'rgba(0, 0, 0, 0.3)' : '#000',
      }]} 
      onPress={handlePress}
    >
      <View style={styles.header}>
        <Image 
          source={{ uri: tenant.photo || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }} 
          style={styles.avatar} 
        />
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: colors.text.primary }]}>{tenant.name}</Text>
          <View style={styles.leaseStatusContainer}>
            <View style={[styles.statusDot, { backgroundColor: leaseStatusColor }]} />
            <Text style={[styles.leaseStatus, { color: leaseStatusColor }]}>
              {leaseStatus}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Home size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            {property?.name}, {t('unit')} {unit?.unitNumber}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Phone size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>{tenant.phone}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Calendar size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            {t('lease')}: {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={[styles.rentContainer, { borderRightColor: colors.border }]}>
          <Text style={[styles.rentLabel, { color: colors.text.tertiary }]}>{t('monthly_rent')}</Text>
          <Text style={[styles.rentAmount, { color: colors.text.primary }]}>৳{tenant.monthlyRent.toLocaleString()}</Text>
        </View>
        
        <View style={styles.depositContainer}>
          <Text style={[styles.depositLabel, { color: colors.text.tertiary }]}>{t('security_deposit')}</Text>
          <Text style={[styles.depositAmount, { color: colors.text.primary }]}>৳{tenant.securityDeposit.toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  leaseStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  leaseStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  rentContainer: {
    flex: 1,
    borderRightWidth: 1,
    paddingRight: 12,
  },
  depositContainer: {
    flex: 1,
    paddingLeft: 12,
  },
  rentLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  rentAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  depositLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  depositAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});