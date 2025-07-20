import React, { useState } from 'react';
import { Target, Plus, Calendar, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';

interface NewGoal {
  title: string;
  targetAmount: number;
  deadline: string;
  category: string;
}

const Goals: React.FC = () => {
  const { goals } = useApp();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<NewGoal>({
    title: '',
    targetAmount: 0,
    deadline: '',
    category: 'Savings'
  });

  const categories = ['Savings', 'Travel', 'Education', 'Health', 'Investment', 'Emergency', 'Other'];

  const handleAddGoal = () => {
    // Here you would typically add the goal to your state/database
    console.log('Adding goal:', newGoal);
    setShowAddGoal(false);
    setNewGoal({ title: '', targetAmount: 0, deadline: '', category: 'Savings' });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Financial Goals</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your savings and financial targets</p>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{goals.length}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {goals.filter(g => g.currentAmount >= g.targetAmount).length}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Saved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(goals.reduce((sum, g) => sum + g.currentAmount, 0))}
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysRemaining = getDaysRemaining(goal.deadline);
          
          return (
            <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{goal.title}</h3>
                  <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                    {goal.category}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Current</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 dark:text-gray-400">Target</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Deadline</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(goal.deadline)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Days left</p>
                    <p className={`text-sm font-medium ${daysRemaining < 30 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {daysRemaining > 0 ? daysRemaining : 'Overdue'}
                    </p>
                  </div>
                </div>

                <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Add Money
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add New Goal</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Emergency Fund"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Amount
                </label>
                <input
                  type="number"
                  value={newGoal.targetAmount || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddGoal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;