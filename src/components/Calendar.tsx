import React, { useState } from 'react';
import { Calendar as CalendarIcon, Bell, CreditCard, Zap, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  category: 'subscription' | 'emi' | 'utility' | 'insurance';
  isPaid: boolean;
  isRecurring: boolean;
}

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddBill, setShowAddBill] = useState(false);

  // Mock bills data
  const bills: Bill[] = [
    {
      id: '1',
      title: 'Netflix Subscription',
      amount: 649,
      dueDate: '2025-01-15',
      category: 'subscription',
      isPaid: false,
      isRecurring: true
    },
    {
      id: '2',
      title: 'Home Loan EMI',
      amount: 25000,
      dueDate: '2025-01-20',
      category: 'emi',
      isPaid: false,
      isRecurring: true
    },
    {
      id: '3',
      title: 'Electricity Bill',
      amount: 1200,
      dueDate: '2025-01-25',
      category: 'utility',
      isPaid: false,
      isRecurring: true
    },
    {
      id: '4',
      title: 'Car Insurance',
      amount: 15000,
      dueDate: '2025-01-30',
      category: 'insurance',
      isPaid: true,
      isRecurring: false
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'subscription': return Zap;
      case 'emi': return CreditCard;
      case 'utility': return Bell;
      case 'insurance': return Bell;
      default: return Bell;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'subscription': return 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400';
      case 'emi': return 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400';
      case 'utility': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400';
      case 'insurance': return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400';
    }
  };

  const upcomingBills = bills
    .filter(bill => new Date(bill.dueDate) >= new Date() && !bill.isPaid)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const overdueBills = bills
    .filter(bill => new Date(bill.dueDate) < new Date() && !bill.isPaid);

  const totalUpcoming = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalOverdue = overdueBills.reduce((sum, bill) => sum + bill.amount, 0);

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Bill Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your upcoming bills and subscriptions</p>
        </div>
        <button
          onClick={() => setShowAddBill(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Bill</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Bills</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(totalUpcoming)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{upcomingBills.length} bills</p>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue Bills</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalOverdue)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{overdueBills.length} bills</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Bell className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(bills.reduce((sum, bill) => sum + bill.amount, 0))}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{bills.length} total bills</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bills List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bills */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Bills</h3>
          <div className="space-y-4">
            {upcomingBills.map((bill) => {
              const Icon = getCategoryIcon(bill.category);
              const daysUntilDue = getDaysUntilDue(bill.dueDate);
              
              return (
                <div key={bill.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${getCategoryColor(bill.category)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{bill.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Due {formatDate(bill.dueDate)}
                        {bill.isRecurring && ' • Recurring'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(bill.amount)}</p>
                    <p className={`text-xs ${daysUntilDue <= 3 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} days left`}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {upcomingBills.length === 0 && (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No upcoming bills</p>
              </div>
            )}
          </div>
        </div>

        {/* Overdue Bills */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overdue Bills</h3>
          <div className="space-y-4">
            {overdueBills.map((bill) => {
              const Icon = getCategoryIcon(bill.category);
              const daysOverdue = Math.abs(getDaysUntilDue(bill.dueDate));
              
              return (
                <div key={bill.id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg mr-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{bill.title}</p>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {daysOverdue} days overdue
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600 dark:text-red-400">{formatCurrency(bill.amount)}</p>
                    <button className="text-xs bg-red-600 text-white px-2 py-1 rounded mt-1 hover:bg-red-700">
                      Pay Now
                    </button>
                  </div>
                </div>
              );
            })}
            
            {overdueBills.length === 0 && (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No overdue bills</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Bills */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Bills</h3>
        <div className="space-y-3">
          {bills.map((bill) => {
            const Icon = getCategoryIcon(bill.category);
            
            return (
              <div key={bill.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${getCategoryColor(bill.category)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{bill.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(bill.dueDate)}
                      {bill.isRecurring && ' • Recurring'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(bill.amount)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      bill.isPaid ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                      'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                    }`}>
                      {bill.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  {!bill.isPaid && (
                    <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;