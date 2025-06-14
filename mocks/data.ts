import { Property, Tenant, Payment, Document, DashboardStats } from '@/types';

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Bashundhara Residency',
    address: 'Block D, Road 5, Bashundhara R/A, Dhaka',
    totalUnits: 8,
    occupiedUnits: 6,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    monthlyRevenue: 120000,
    units: [
      {
        id: 'u1',
        propertyId: '1',
        unitNumber: '3A',
        floor: '3rd',
        size: '1200',
        bedrooms: 3,
        bathrooms: 2,
        rent: 18000,
        status: 'occupied',
        tenantId: 't1'
      },
      {
        id: 'u2',
        propertyId: '1',
        unitNumber: '4B',
        floor: '4th',
        size: '1100',
        bedrooms: 2,
        bathrooms: 2,
        rent: 15000,
        status: 'occupied',
        tenantId: 't2'
      },
      {
        id: 'u3',
        propertyId: '1',
        unitNumber: '5A',
        floor: '5th',
        size: '1300',
        bedrooms: 3,
        bathrooms: 2,
        rent: 20000,
        status: 'vacant'
      }
    ]
  },
  {
    id: '2',
    name: 'Gulshan Heights',
    address: 'House 7, Road 14, Gulshan-1, Dhaka',
    totalUnits: 6,
    occupiedUnits: 5,
    image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    monthlyRevenue: 150000,
    units: [
      {
        id: 'u4',
        propertyId: '2',
        unitNumber: '2A',
        floor: '2nd',
        size: '1500',
        bedrooms: 3,
        bathrooms: 3,
        rent: 30000,
        status: 'occupied',
        tenantId: 't3'
      },
      {
        id: 'u5',
        propertyId: '2',
        unitNumber: '3B',
        floor: '3rd',
        size: '1400',
        bedrooms: 3,
        bathrooms: 2,
        rent: 28000,
        status: 'occupied',
        tenantId: 't4'
      }
    ]
  }
];

export const mockTenants: Tenant[] = [
  {
    id: 't1',
    name: 'Rahim Ahmed',
    phone: '01712345678',
    email: 'rahim@example.com',
    nidNumber: '1234567890',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    unitId: 'u1',
    propertyId: '1',
    leaseStart: '2023-01-01',
    leaseEnd: '2024-01-01',
    monthlyRent: 18000,
    securityDeposit: 36000,
    documents: [],
    paymentHistory: []
  },
  {
    id: 't2',
    name: 'Karim Hossain',
    phone: '01812345678',
    email: 'karim@example.com',
    nidNumber: '0987654321',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    unitId: 'u2',
    propertyId: '1',
    leaseStart: '2023-03-01',
    leaseEnd: '2024-03-01',
    monthlyRent: 15000,
    securityDeposit: 30000,
    documents: [],
    paymentHistory: []
  },
  {
    id: 't3',
    name: 'Fatima Begum',
    phone: '01912345678',
    email: 'fatima@example.com',
    nidNumber: '5678901234',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    unitId: 'u4',
    propertyId: '2',
    leaseStart: '2023-02-01',
    leaseEnd: '2024-02-01',
    monthlyRent: 30000,
    securityDeposit: 60000,
    documents: [],
    paymentHistory: []
  },
  {
    id: 't4',
    name: 'Jamal Uddin',
    phone: '01612345678',
    email: 'jamal@example.com',
    nidNumber: '6789012345',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    unitId: 'u5',
    propertyId: '2',
    leaseStart: '2023-04-01',
    leaseEnd: '2024-04-01',
    monthlyRent: 28000,
    securityDeposit: 56000,
    documents: [],
    paymentHistory: []
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'p1',
    tenantId: 't1',
    unitId: 'u1',
    propertyId: '1',
    amount: 18000,
    date: '2023-05-05',
    type: 'rent',
    status: 'paid',
    month: '2023-05',
    notes: 'Paid on time'
  },
  {
    id: 'p2',
    tenantId: 't1',
    unitId: 'u1',
    propertyId: '1',
    amount: 18000,
    date: '2023-06-07',
    type: 'rent',
    status: 'paid',
    month: '2023-06',
    notes: 'Paid 2 days late'
  },
  {
    id: 'p3',
    tenantId: 't2',
    unitId: 'u2',
    propertyId: '1',
    amount: 15000,
    date: '2023-06-03',
    type: 'rent',
    status: 'paid',
    month: '2023-06',
    notes: 'Paid on time'
  },
  {
    id: 'p4',
    tenantId: 't3',
    unitId: 'u4',
    propertyId: '2',
    amount: 30000,
    date: '2023-06-10',
    type: 'rent',
    status: 'pending',
    month: '2023-06',
    notes: 'Payment pending'
  }
];

export const mockDocuments: Document[] = [
  {
    id: 'd1',
    name: 'Lease Agreement - Rahim Ahmed',
    type: 'lease',
    url: 'https://example.com/lease1.pdf',
    uploadDate: '2023-01-01',
    relatedTo: 'tenant',
    relatedId: 't1'
  },
  {
    id: 'd2',
    name: 'Rent Receipt - May 2023',
    type: 'receipt',
    url: 'https://example.com/receipt1.pdf',
    uploadDate: '2023-05-05',
    relatedTo: 'tenant',
    relatedId: 't1'
  },
  {
    id: 'd3',
    name: 'Property Deed - Bashundhara Residency',
    type: 'other',
    url: 'https://example.com/deed1.pdf',
    uploadDate: '2022-12-15',
    relatedTo: 'property',
    relatedId: '1'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalProperties: 2,
  totalUnits: 14,
  occupancyRate: 78.6, // (11/14) * 100
  monthlyRevenue: 270000,
  pendingPayments: 1,
  overduePayments: 0
};