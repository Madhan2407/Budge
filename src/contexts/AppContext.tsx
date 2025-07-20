import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'credit' | 'debit';
  account: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'credit' | 'wallet';
  balance: number;
  lastUpdated: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly';
}

interface AppContextType {
  accounts: Account[];
  transactions: Transaction[];
  goals: Goal[];
  budgets: Budget[];
  isLoading: boolean;
  bankLinked: boolean;
  setBankLinked: (linked: boolean) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bankLinked, setBankLinked] = useState(false);

  // Mock data for demonstration
  const mockAccounts: Account[] = [
    {
      id: '1',
      name: 'HDFC Savings',
      type: 'bank',
      balance: 125000,
      lastUpdated: new Date().toISOString()
    },
    {
      id: '2',
      name: 'PhonePe Wallet',
      type: 'wallet',
      balance: 2500,
      lastUpdated: new Date().toISOString()
    },
    {
      id: '3',
      name: 'ICICI Credit Card',
      type: 'credit',
      balance: -15000,
      lastUpdated: new Date().toISOString()
    }
  ];

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      amount: 2500,
      description: 'Salary Credit',
      category: 'Income',
      date: '2025-01-10',
      type: 'credit',
      account: 'HDFC Savings'
    },
    {
      id: '2',
      amount: 850,
      description: 'Grocery Shopping',
      category: 'Food',
      date: '2025-01-09',
      type: 'debit',
      account: 'HDFC Savings'
    },
    {
      id: '3',
      amount: 1200,
      description: 'Electricity Bill',
      category: 'Bills',
      date: '2025-01-08',
      type: 'debit',
      account: 'HDFC Savings'
    },
    {
      id: '4',
      amount: 500,
      description: 'Coffee with friends',
      category: 'Entertainment',
      date: '2025-01-07',
      type: 'debit',
      account: 'PhonePe Wallet'
    }
  ];

  const mockGoals: Goal[] = [
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 100000,
      currentAmount: 45000,
      deadline: '2025-12-31',
      category: 'Savings'
    },
    {
      id: '2',
      title: 'Vacation to Goa',
      targetAmount: 25000,
      currentAmount: 8000,
      deadline: '2025-06-30',
      category: 'Travel'
    }
  ];

  const mockBudgets: Budget[] = [
    {
      id: '1',
      category: 'Food',
      limit: 8000,
      spent: 5200,
      period: 'monthly'
    },
    {
      id: '2',
      category: 'Entertainment',
      limit: 3000,
      spent: 2100,
      period: 'monthly'
    },
    {
      id: '3',
      category: 'Shopping',
      limit: 5000,
      spent: 4800,
      period: 'monthly'
    }
  ];

  const refreshData = () => {
    if (!user || !bankLinked) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAccounts(mockAccounts);
      setTransactions(mockTransactions);
      setGoals(mockGoals);
      setBudgets(mockBudgets);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (user && bankLinked) {
      refreshData();
    }
  }, [user, bankLinked]);

  const value = {
    accounts,
    transactions,
    goals,
    budgets,
    isLoading,
    bankLinked,
    setBankLinked,
    refreshData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};