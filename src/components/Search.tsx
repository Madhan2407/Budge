import React, { useState } from 'react';
import { Search as SearchIcon, Filter, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';

const Search: React.FC = () => {
  const { transactions } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', ...Array.from(new Set(transactions.map(t => t.category)))];
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      switch (dateRange) {
        case 'today':
          matchesDate = transactionDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= monthAgo;
          break;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= yearAgo;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesType && matchesDate;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setDateRange('all');
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Search Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">Find and filter your financial transactions</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="credit">Income</option>
                <option value="debit">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {filteredTransactions.length} transactions found
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total: {formatCurrency(filteredTransactions.reduce((sum, t) => 
                t.type === 'credit' ? sum + t.amount : sum - t.amount, 0
              ))}
            </p>
          </div>
          <div className="flex space-x-4 text-sm">
            <div className="text-center">
              <p className="text-green-600 dark:text-green-400 font-semibold">
                +{formatCurrency(filteredTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0))}
              </p>
              <p className="text-gray-500 dark:text-gray-400">Income</p>
            </div>
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 font-semibold">
                -{formatCurrency(filteredTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0))}
              </p>
              <p className="text-gray-500 dark:text-gray-400">Expenses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Search Results</h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">No transactions found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg mr-4 ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100 dark:bg-green-900' 
                        : 'bg-red-100 dark:bg-red-900'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                          {transaction.category}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.account}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      transaction.type === 'credit' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {transaction.type === 'credit' ? 'Income' : 'Expense'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;