import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Calendar, TrendingUp, DollarSign, Filter } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, getCategoryColor } from '../utils/formatters';

const Insights: React.FC = () => {
  const { transactions } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter transactions based on selected period
  const getFilteredTransactions = () => {
    const now = new Date();
    const startDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return transactions.filter(t => new Date(t.date) >= startDate);
  };

  const filteredTransactions = getFilteredTransactions();

  // Category wise spending data for pie chart
  const categoryData = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    category,
    amount,
    color: getCategoryColor(category),
  }));

  // Monthly spending trend for line chart
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
    });

    const income = monthTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);

    return {
      month: monthName,
      income,
      expenses,
      savings: income - expenses,
    };
  });

  // Daily spending for bar chart (last 7 days)
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.toDateString() === date.toDateString();
    });

    const spending = dayTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);

    return {
      day: dayName,
      spending,
    };
  });

  const totalSpending = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpending) / totalIncome) * 100 : 0;

  const categories = ['all', ...Array.from(new Set(transactions.map(t => t.category)))];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Insights</h1>
          <p className="text-gray-600 dark:text-gray-400">Analyze your spending patterns</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Spending</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalSpending)}</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Savings</p>
              <p className={`text-2xl font-bold ${(totalIncome - totalSpending) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(totalIncome - totalSpending)}
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Savings Rate</p>
              <p className={`text-2xl font-bold ${savingsRate >= 20 ? 'text-green-600 dark:text-green-400' : savingsRate >= 10 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                {Math.round(savingsRate)}%
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Filter className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown - Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Spending - Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Spending (Last 7 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" tickFormatter={(value) => `₹${value}`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="spending" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trend - Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Income vs Expenses</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Expenses"
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Savings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Spending Categories</h3>
        <div className="space-y-4">
          {pieData
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
            .map((category, index) => {
              const percentage = (category.amount / totalSpending) * 100;
              return (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{category.category}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}% of total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(category.amount)}</p>
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-1">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${percentage}%`, 
                          backgroundColor: category.color 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Insights;