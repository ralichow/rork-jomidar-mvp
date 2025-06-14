export type Property = {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  occupiedUnits: number;
  image?: string;
  monthlyRevenue: number;
  units: Unit[];
};

export type Unit = {
  id: string;
  propertyId: string;
  unitNumber: string;
  floor: string;
  size: string; // in square feet
  bedrooms: number;
  bathrooms: number;
  rent: number;
  status: 'vacant' | 'occupied';
  tenantId?: string;
};

export type Tenant = {
  id: string;
  name: string;
  phone: string;
  email: string;
  nidNumber: string; // National ID number
  photo?: string;
  unitId: string;
  propertyId: string;
  leaseStart: string; // ISO date string
  leaseEnd: string; // ISO date string
  monthlyRent: number;
  securityDeposit: number;
  documents: Document[];
  paymentHistory: Payment[];
};

export type Payment = {
  id: string;
  tenantId: string;
  unitId: string;
  propertyId: string;
  amount: number;
  date: string; // ISO date string
  type: 'rent' | 'utility' | 'maintenance' | 'deposit';
  status: 'paid' | 'pending' | 'overdue' | 'underpaid';
  month: string; // Format: "YYYY-MM"
  notes?: string;
  receiptUrl?: string;
  expectedAmount?: number; // For tracking underpaid amounts
  remainingAmount?: number; // Amount still due
};

export type Document = {
  id: string;
  name: string;
  type: 'lease' | 'receipt' | 'utility' | 'maintenance' | 'other';
  url: string;
  uploadDate: string; // ISO date string
  relatedTo: 'property' | 'tenant' | 'unit';
  relatedId: string;
};

export type DashboardStats = {
  totalProperties: number;
  totalUnits: number;
  occupancyRate: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  underpaidPayments?: number;
};