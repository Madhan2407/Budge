import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Eye, 
  EyeOff,
  CreditCard,
  Building2,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Calendar,
  Mic,
  Camera
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/formatters';
import VoiceAssistant from './VoiceAssistant';
import ReceiptScanner from './ReceiptScanner';
import type { ExtractedExpense } from '../services/ocrService';

const Dashboard: React.FC = () => {
  const { accounts, transactions, goals, budgets, isLoading } = useApp();
  const [showBalance, setShowBalance] = useState(true);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const thisMonthIncome = transactions
    .filter(t => t.type === 'credit' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);
  const thisMonthExpenses = transactions
    .filter(t => t.type === 'debit' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTransactions = transactions.slice(0, 5);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'bank': return Building2;
      case 'credit': return CreditCard;
      case 'wallet': return Smartphone;
      default: return Wallet;
    }
  };

  const handleExpenseExtracted = (expense: ExtractedExpense) => {
    // Here you would typically add the expense to your state/database
    console.log('Extracted expense:', expense);
    // For now, we'll just show a success message
    alert(`Expense added: ₹${expense.amount} for ${expense.description}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Welcome back!</h1>
          <p className="text-gray-600 dark:text-gray-400">Here's your financial overview</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowVoiceAssistant(true)}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button 
            onClick={() => setShowReceiptScanner(true)}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Camera className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Total Balance</h2>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-3xl md:text-4xl font-bold mb-2">
          {showBalance ? formatCurrency(totalBalance) : '₹ ****'}
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            Income: {formatCurrency(thisMonthIncome)}
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            Expenses: {formatCurrency(thisMonthExpenses)}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Accounts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{accounts.length}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Goals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{goals.length}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Budgets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{budgets.length}</p>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{transactions.length}</p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Accounts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accounts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Accounts</h3>
            <button className="text-green-600 dark:text-green-400 hover:text-green-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {accounts.map((account) => {
              const Icon = getAccountIcon(account.type);
              return (
                <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-white dark:bg-gray-600 rounded-lg mr-3">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{account.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{account.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${account.balance < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
            <button className="text-green-600 dark:text-green-400 hover:text-green-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${transaction.type === 'credit' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                    {transaction.type === 'credit' ? (
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goal Progress</h3>
          <button className="text-green-600 dark:text-green-400 hover:text-green-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{formatCurrency(goal.currentAmount)}</span>
                  <span className="text-gray-600 dark:text-gray-400">{formatCurrency(goal.targetAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Overview</h3>
          <button className="text-green-600 dark:text-green-400 hover:text-green-700 text-sm font-medium">
            Manage Budgets
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage > 80;
            
            return (
              <div key={budget.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{budget.category}</h4>
                  <span className={`text-sm font-medium ${
                    isOverBudget ? 'text-red-600 dark:text-red-400' : 
                    isNearLimit ? 'text-orange-600 dark:text-orange-400' : 
                    'text-green-600 dark:text-green-400'
                  }`}>
                    {Math.round(percentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isOverBudget ? 'bg-red-500' : 
                      isNearLimit ? 'bg-orange-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{formatCurrency(budget.spent)}</span>
                  <span className="text-gray-600 dark:text-gray-400">{formatCurrency(budget.limit)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistant 
        isOpen={showVoiceAssistant} 
        onClose={() => setShowVoiceAssistant(false)} 
      />

      {/* Receipt Scanner Modal */}
      <ReceiptScanner 
        isOpen={showReceiptScanner} 
        onClose={() => setShowReceiptScanner(false)}
        onExpenseExtracted={handleExpenseExtracted}
      />
    </div>
  );
};

export default Dashboard;