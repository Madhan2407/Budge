import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { voiceService } from '../services/voiceService';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/formatters';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const { transactions, accounts, budgets } = useApp();

  const handleVoiceCommand = (command: string) => {
    setTranscript(command);
    const response = processCommand(command.toLowerCase());
    setResponse(response);
    
    setIsSpeaking(true);
    voiceService.speak(response);
    
    setTimeout(() => setIsSpeaking(false), response.length * 50);
  };

  const processCommand = (command: string): string => {
    if (command.includes('balance') || command.includes('total money')) {
      const total = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      return `Your total balance is ${formatCurrency(total)}`;
    }
    
    if (command.includes('spent') && (command.includes('food') || command.includes('grocery'))) {
      const foodExpenses = transactions
        .filter(t => t.type === 'debit' && t.category.toLowerCase().includes('food'))
        .reduce((sum, t) => sum + t.amount, 0);
      return `You've spent ${formatCurrency(foodExpenses)} on food this month`;
    }
    
    if (command.includes('budget')) {
      if (budgets.length === 0) {
        return "You haven't set up any budgets yet. Would you like me to help you create one?";
      }
      const overBudget = budgets.filter(b => b.spent > b.limit);
      if (overBudget.length > 0) {
        return `You're over budget in ${overBudget.length} categories. Consider reducing spending in ${overBudget[0].category}`;
      }
      return "You're doing well with your budgets this month!";
    }
    
    if (command.includes('save money') || command.includes('savings tips')) {
      const tips = [
        "Try the 50-30-20 rule: 50% needs, 30% wants, 20% savings",
        "Set up automatic transfers to your savings account",
        "Track your daily expenses to identify spending patterns",
        "Consider cooking at home more often to reduce food expenses"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    
    if (command.includes('last transaction') || command.includes('recent spending')) {
      const lastTransaction = transactions[0];
      if (lastTransaction) {
        return `Your last transaction was ${formatCurrency(lastTransaction.amount)} for ${lastTransaction.description}`;
      }
      return "No recent transactions found";
    }
    
    return "I'm sorry, I didn't understand that. You can ask about your balance, spending, budgets, or savings tips.";
  };

  const startListening = () => {
    setIsListening(true);
    voiceService.startListening(
      (text) => {
        setIsListening(false);
        handleVoiceCommand(text);
      },
      (error) => {
        setIsListening(false);
        setResponse(`Sorry, I couldn't understand. ${error}`);
      }
    );
  };

  const stopListening = () => {
    setIsListening(false);
    voiceService.stopListening();
  };

  const stopSpeaking = () => {
    setIsSpeaking(false);
    voiceService.stopSpeaking();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Voice Assistant</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Ask me about your finances</p>
        </div>

        <div className="space-y-4">
          {transcript && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>You said:</strong> {transcript}
              </p>
            </div>
          )}

          {response && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-800 dark:text-green-300">
                <strong>Assistant:</strong> {response}
              </p>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            {!isListening ? (
              <button
                onClick={startListening}
                className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full text-white transition-colors"
              >
                <Mic className="w-8 h-8" />
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors animate-pulse"
              >
                <MicOff className="w-8 h-8" />
              </button>
            )}

            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center justify-center w-16 h-16 bg-orange-500 hover:bg-orange-600 rounded-full text-white transition-colors"
              >
                <VolumeX className="w-8 h-8" />
              </button>
            )}
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            {isListening ? 'Listening...' : 'Tap the microphone to speak'}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;