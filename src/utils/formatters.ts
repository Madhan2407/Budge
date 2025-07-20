export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Food': '#10B981',
    'Bills': '#3B82F6',
    'Shopping': '#8B5CF6',
    'Entertainment': '#F59E0B',
    'Transport': '#EF4444',
    'Health': '#06B6D4',
    'Income': '#22C55E',
    'Transfer': '#6B7280',
    'Investment': '#8B5CF6',
    'Education': '#F97316',
  };
  return colors[category] || '#6B7280';
};