// Color palette for Jomidar app
const lightColors = {
  primary: '#2563EB', // Primary blue
  secondary: '#0EA5E9', // Secondary blue/teal
  accent: '#6366F1', // Accent purple for highlights
  success: '#10B981', // Green for positive indicators
  warning: '#F59E0B', // Amber for warnings
  danger: '#EF4444', // Red for errors/alerts
  
  // Neutrals
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    tertiary: '#9CA3AF',
  },
  border: '#E5E7EB',
  
  // Status colors
  paid: '#10B981',
  pending: '#F59E0B',
  overdue: '#EF4444',
  vacant: '#9CA3AF',
  occupied: '#10B981',
};

const darkColors = {
  primary: '#3B82F6', // Slightly lighter blue for dark mode
  secondary: '#38BDF8', // Slightly lighter blue/teal for dark mode
  accent: '#818CF8', // Slightly lighter purple for dark mode
  success: '#34D399', // Slightly lighter green for dark mode
  warning: '#FBBF24', // Slightly lighter amber for dark mode
  danger: '#F87171', // Slightly lighter red for dark mode
  
  // Neutrals
  background: '#111827',
  card: '#1F2937',
  text: {
    primary: '#F9FAFB',
    secondary: '#E5E7EB',
    tertiary: '#9CA3AF',
  },
  border: '#374151',
  
  // Status colors
  paid: '#34D399',
  pending: '#FBBF24',
  overdue: '#F87171',
  vacant: '#9CA3AF',
  occupied: '#34D399',
};

export const getColors = (isDark: boolean) => {
  return isDark ? darkColors : lightColors;
};

// For backward compatibility, export light theme as default
export default lightColors;