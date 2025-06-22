import { Platform, Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Payment, Tenant, Property, Unit } from '@/types';

/**
 * Generate CSV data for payments
 */
export const generatePaymentsCSV = (
  payments: Payment[],
  tenants: Tenant[],
  properties: Property[]
): string => {
  // CSV header
  let csv = 'Date,Tenant Name,Property,Unit,Payment Type,Amount,Status,Month,Notes\n';
  
  // Add each payment as a row
  payments.forEach(payment => {
    const tenant = tenants.find(t => t.id === payment.tenantId);
    const property = properties.find(p => p.id === payment.propertyId);
    const unit = property?.units.find(u => u.id === payment.unitId);
    
    // Format date
    const paymentDate = new Date(payment.date).toLocaleDateString();
    
    // Format month (e.g., "2023-05" to "May 2023")
    const [year, month] = payment.month.split('-');
    const paymentMonth = new Date(parseInt(year), parseInt(month) - 1)
      .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Escape any commas in text fields
    const tenantName = tenant?.name ? `"${tenant.name}"` : 'Unknown';
    const propertyName = property?.name ? `"${property.name}"` : 'Unknown';
    const unitNumber = unit?.unitNumber ? `"${unit.unitNumber}"` : 'Unknown';
    const notes = payment.notes ? `"${payment.notes.replace(/"/g, '""')}"` : '';
    
    // Add row
    csv += `${paymentDate},${tenantName},${propertyName},${unitNumber},${payment.type},${payment.amount},${payment.status},${paymentMonth},${notes}\n`;
  });
  
  return csv;
};

/**
 * Generate HTML receipt for a payment
 */
export const generatePaymentReceipt = (
  payment: Payment,
  tenant: Tenant | undefined,
  property: Property | undefined,
  unit: Unit | undefined
): string => {
  // Format date
  const paymentDate = new Date(payment.date).toLocaleDateString();
  
  // Format month
  const [year, month] = payment.month.split('-');
  const paymentMonth = new Date(parseInt(year), parseInt(month) - 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Generate receipt number
  const receiptNumber = `REC-${payment.id.substring(0, 8)}`;
  
  // Get payment status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'overdue': return '#F44336';
      case 'underpaid': return '#9C27B0';
      default: return '#757575';
    }
  };
  
  // Create HTML receipt
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Receipt</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .receipt {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #ddd;
          padding: 30px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #eee;
          padding-bottom: 20px;
        }
        .receipt-number {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
        h1 {
          color: #333;
          margin: 0;
          font-size: 24px;
        }
        .date {
          margin-top: 5px;
          color: #666;
        }
        .info-section {
          margin-bottom: 25px;
        }
        .info-section h2 {
          font-size: 16px;
          margin-bottom: 10px;
          color: #555;
        }
        .info-row {
          display: flex;
          margin-bottom: 5px;
        }
        .info-label {
          width: 150px;
          font-weight: bold;
          color: #555;
        }
        .info-value {
          flex: 1;
        }
        .amount-section {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 25px;
        }
        .amount-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .amount-total {
          font-size: 18px;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid #ddd;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
          color: white;
          background-color: ${getStatusColor(payment.status)};
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="receipt-number">Receipt #: ${receiptNumber}</div>
          <h1>Payment Receipt</h1>
          <div class="date">Date: ${paymentDate}</div>
        </div>
        
        <div class="info-section">
          <h2>Tenant Information</h2>
          <div class="info-row">
            <div class="info-label">Name:</div>
            <div class="info-value">${tenant?.name || 'Unknown'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Phone:</div>
            <div class="info-value">${tenant?.phone || 'N/A'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Email:</div>
            <div class="info-value">${tenant?.email || 'N/A'}</div>
          </div>
        </div>
        
        <div class="info-section">
          <h2>Property Information</h2>
          <div class="info-row">
            <div class="info-label">Property:</div>
            <div class="info-value">${property?.name || 'Unknown'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Unit:</div>
            <div class="info-value">${unit?.unitNumber || 'Unknown'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Address:</div>
            <div class="info-value">${property?.address || 'Unknown'}</div>
          </div>
        </div>
        
        <div class="info-section">
          <h2>Payment Details</h2>
          <div class="info-row">
            <div class="info-label">Payment Type:</div>
            <div class="info-value">${payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Payment Period:</div>
            <div class="info-value">${paymentMonth}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Status:</div>
            <div class="info-value">
              <span class="status-badge">${payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
            </div>
          </div>
          ${payment.notes ? `
          <div class="info-row">
            <div class="info-label">Notes:</div>
            <div class="info-value">${payment.notes}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="amount-section">
          <div class="amount-row">
            <div>Payment Amount:</div>
            <div>৳${payment.amount.toLocaleString()}</div>
          </div>
          ${payment.expectedAmount && payment.status === 'underpaid' ? `
          <div class="amount-row">
            <div>Expected Amount:</div>
            <div>৳${payment.expectedAmount.toLocaleString()}</div>
          </div>
          <div class="amount-row">
            <div>Remaining Amount:</div>
            <div>৳${payment.remainingAmount?.toLocaleString() || 0}</div>
          </div>
          ` : ''}
          <div class="amount-total">
            <div>Total Paid:</div>
            <div>৳${payment.amount.toLocaleString()}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This is a computer-generated receipt and does not require a signature.</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return html;
};

/**
 * Save and share a file on mobile or download on web
 */
export const saveAndShareFile = async (
  content: string,
  fileName: string,
  mimeType: string
): Promise<void> => {
  if (Platform.OS === 'web') {
    // For web: Create a blob and download it
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  } else {
    // For mobile: Save to file system and share
    try {
      // Get the app's document directory
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Write the content to a file
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      
      // Share the file
      await Share.share({
        url: fileUri,
        title: fileName,
      });
    } catch (error) {
      console.error('Error saving or sharing file:', error);
      throw error;
    }
  }
};

/**
 * Generate and download/share a payments report
 */
export const generateAndSharePaymentsReport = async (
  payments: Payment[],
  tenants: Tenant[],
  properties: Property[],
  period?: string
): Promise<void> => {
  try {
    // Generate CSV content
    const csvContent = generatePaymentsCSV(payments, tenants, properties);
    
    // Create filename with date
    const date = new Date().toISOString().split('T')[0];
    const periodText = period ? `_${period}` : '';
    const fileName = `payments_report${periodText}_${date}.csv`;
    
    // Save and share the file
    await saveAndShareFile(csvContent, fileName, 'text/csv');
  } catch (error) {
    console.error('Error generating payments report:', error);
    throw error;
  }
};

/**
 * Generate and download/share a payment receipt
 */
export const generateAndSharePaymentReceipt = async (
  payment: Payment,
  tenant: Tenant | undefined,
  property: Property | undefined,
  unit: Unit | undefined
): Promise<void> => {
  try {
    // Generate HTML content
    const htmlContent = generatePaymentReceipt(payment, tenant, property, unit);
    
    // Create filename
    const date = new Date(payment.date).toISOString().split('T')[0];
    const tenantName = tenant?.name?.replace(/\s+/g, '_') || 'unknown';
    const fileName = `payment_receipt_${tenantName}_${date}.html`;
    
    // Save and share the file
    await saveAndShareFile(htmlContent, fileName, 'text/html');
  } catch (error) {
    console.error('Error generating payment receipt:', error);
    throw error;
  }
};