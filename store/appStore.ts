import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Property, Tenant, Payment, Document, DashboardStats, Unit, DocumentSource } from '@/types';
import { mockProperties, mockTenants, mockPayments, mockDocuments, mockDashboardStats } from '@/mocks/data';

interface AppState {
  properties: Property[];
  tenants: Tenant[];
  payments: Payment[];
  documents: Document[];
  dashboardStats: DashboardStats;
  
  // Property actions
  addProperty: (property: Omit<Property, 'id'>) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  
  // Unit actions
  addUnit: (propertyId: string, unit: Omit<Property['units'][0], 'id'>) => void;
  updateUnit: (propertyId: string, unit: Property['units'][0]) => void;
  deleteUnit: (propertyId: string, unitId: string) => void;
  
  // Tenant actions
  addTenant: (tenant: Omit<Tenant, 'id' | 'documents' | 'paymentHistory'>) => void;
  updateTenant: (tenant: Tenant) => void;
  deleteTenant: (id: string) => void;
  
  // Payment actions
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;
  
  // Document actions
  addDocument: (document: Omit<Document, 'id'>) => void;
  updateDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;
  
  // Stats calculation
  recalculateStats: () => void;
}

// Convert legacy documents to new format
const convertLegacyDocuments = (documents: any[]): Document[] => {
  return documents.map(doc => {
    // If the document already has a source property, return it as is
    if (doc.source) return doc;
    
    // Otherwise, convert the url to a source object
    return {
      ...doc,
      source: {
        type: 'url',
        uri: doc.url || ''
      }
    };
  });
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      properties: mockProperties,
      tenants: mockTenants,
      payments: mockPayments,
      documents: convertLegacyDocuments(mockDocuments),
      dashboardStats: mockDashboardStats,
      
      // Property actions
      addProperty: (property) => {
        const newProperty = {
          ...property,
          id: Date.now().toString(),
          units: [],
          occupiedUnits: 0,
          monthlyRevenue: 0
        };
        
        set((state) => ({
          properties: [...state.properties, newProperty]
        }));
        
        get().recalculateStats();
      },
      
      updateProperty: (property) => {
        set((state) => ({
          properties: state.properties.map((p) => 
            p.id === property.id ? property : p
          )
        }));
        
        get().recalculateStats();
      },
      
      deleteProperty: (id) => {
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== id),
          tenants: state.tenants.filter((t) => t.propertyId !== id),
          payments: state.payments.filter((p) => p.propertyId !== id),
          documents: state.documents.filter((d) => 
            !(d.relatedTo === 'property' && d.relatedId === id)
          )
        }));
        
        get().recalculateStats();
      },
      
      // Unit actions
      addUnit: (propertyId, unit) => {
        const newUnit = {
          ...unit,
          id: Date.now().toString(),
          propertyId
        };
        
        set((state) => ({
          properties: state.properties.map((property) => {
            if (property.id === propertyId) {
              return {
                ...property,
                units: [...property.units, newUnit],
                totalUnits: property.totalUnits + 1
              };
            }
            return property;
          })
        }));
        
        get().recalculateStats();
      },
      
      updateUnit: (propertyId, unit) => {
        set((state) => ({
          properties: state.properties.map((property) => {
            if (property.id === propertyId) {
              return {
                ...property,
                units: property.units.map((u) => 
                  u.id === unit.id ? unit : u
                )
              };
            }
            return property;
          })
        }));
        
        get().recalculateStats();
      },
      
      deleteUnit: (propertyId, unitId) => {
        set((state) => {
          // Find the unit to check if it's occupied
          const property = state.properties.find(p => p.id === propertyId);
          const unit = property?.units.find(u => u.id === unitId);
          const isOccupied = unit?.status === 'occupied';
          
          return {
            properties: state.properties.map((property) => {
              if (property.id === propertyId) {
                return {
                  ...property,
                  units: property.units.filter((u) => u.id !== unitId),
                  totalUnits: property.totalUnits - 1,
                  occupiedUnits: isOccupied 
                    ? property.occupiedUnits - 1 
                    : property.occupiedUnits
                };
              }
              return property;
            }),
            tenants: state.tenants.filter((t) => t.unitId !== unitId),
            payments: state.payments.filter((p) => p.unitId !== unitId)
          };
        });
        
        get().recalculateStats();
      },
      
      // Tenant actions
      addTenant: (tenant) => {
        const newTenant = {
          ...tenant,
          id: Date.now().toString(),
          documents: [],
          paymentHistory: []
        };
        
        set((state) => {
          // Update the unit status to occupied
          const updatedProperties = state.properties.map((property) => {
            if (property.id === tenant.propertyId) {
              return {
                ...property,
                occupiedUnits: property.occupiedUnits + 1,
                units: property.units.map((unit) => {
                  if (unit.id === tenant.unitId) {
                    return {
                      ...unit,
                      status: 'occupied' as const,
                      tenantId: newTenant.id
                    };
                  }
                  return unit;
                })
              };
            }
            return property;
          });
          
          return {
            properties: updatedProperties,
            tenants: [...state.tenants, newTenant]
          };
        });
        
        get().recalculateStats();
      },
      
      updateTenant: (tenant) => {
        set((state) => ({
          tenants: state.tenants.map((t) => 
            t.id === tenant.id ? tenant : t
          )
        }));
      },
      
      deleteTenant: (id) => {
        set((state) => {
          const tenant = state.tenants.find(t => t.id === id);
          
          if (!tenant) return state;
          
          // Update the unit status to vacant
          const updatedProperties = state.properties.map((property) => {
            if (property.id === tenant.propertyId) {
              return {
                ...property,
                occupiedUnits: property.occupiedUnits - 1,
                units: property.units.map((unit) => {
                  if (unit.id === tenant.unitId) {
                    return {
                      ...unit,
                      status: 'vacant' as const,
                      tenantId: undefined
                    };
                  }
                  return unit;
                })
              };
            }
            return property;
          });
          
          return {
            properties: updatedProperties,
            tenants: state.tenants.filter((t) => t.id !== id),
            payments: state.payments.filter((p) => p.tenantId !== id),
            documents: state.documents.filter((d) => 
              !(d.relatedTo === 'tenant' && d.relatedId === id)
            )
          };
        });
        
        get().recalculateStats();
      },
      
      // Payment actions
      addPayment: (payment) => {
        const newPayment = {
          ...payment,
          id: Date.now().toString()
        };
        
        set((state) => ({
          payments: [...state.payments, newPayment]
        }));
        
        get().recalculateStats();
      },
      
      updatePayment: (payment) => {
        set((state) => ({
          payments: state.payments.map((p) => 
            p.id === payment.id ? payment : p
          )
        }));
        
        get().recalculateStats();
      },
      
      deletePayment: (id) => {
        set((state) => ({
          payments: state.payments.filter((p) => p.id !== id)
        }));
        
        get().recalculateStats();
      },
      
      // Document actions
      addDocument: (document) => {
        const newDocument = {
          ...document,
          id: Date.now().toString()
        };
        
        set((state) => ({
          documents: [...state.documents, newDocument]
        }));
      },
      
      updateDocument: (document) => {
        set((state) => ({
          documents: state.documents.map((d) => 
            d.id === document.id ? document : d
          )
        }));
      },
      
      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id)
        }));
      },
      
      // Stats calculation
      recalculateStats: () => {
        set((state) => {
          const totalProperties = state.properties.length;
          const totalUnits = state.properties.reduce((sum, property) => sum + property.totalUnits, 0);
          const occupiedUnits = state.properties.reduce((sum, property) => sum + property.occupiedUnits, 0);
          const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
          
          const monthlyRevenue = state.properties.reduce((sum, property) => {
            const propertyRevenue = property.units.reduce((unitSum, unit) => {
              return unit.status === 'occupied' ? unitSum + unit.rent : unitSum;
            }, 0);
            return sum + propertyRevenue;
          }, 0);
          
          const pendingPayments = state.payments.filter(p => p.status === 'pending').length;
          const overduePayments = state.payments.filter(p => p.status === 'overdue').length;
          const underpaidPayments = state.payments.filter(p => p.status === 'underpaid').length;
          
          return {
            dashboardStats: {
              totalProperties,
              totalUnits,
              occupancyRate,
              monthlyRevenue,
              pendingPayments,
              overduePayments,
              underpaidPayments
            }
          };
        });
      }
    }),
    {
      name: 'jomidar-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Convert legacy documents to new format if needed
        if (state && state.documents) {
          state.documents = convertLegacyDocuments(state.documents);
        }
      }
    }
  )
);