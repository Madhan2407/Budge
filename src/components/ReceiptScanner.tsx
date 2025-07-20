import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader, Check } from 'lucide-react';
import { extractTextFromImage, parseReceiptText, ExtractedExpense } from '../services/ocrService';

interface ReceiptScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseExtracted: (expense: ExtractedExpense) => void;
}

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ isOpen, onClose, onExpenseExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [extractedExpense, setExtractedExpense] = useState<ExtractedExpense | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setIsProcessing(true);
    setError('');
    setExtractedText('');
    setExtractedExpense(null);

    try {
      const text = await extractTextFromImage(file);
      setExtractedText(text);
      
      const expense = parseReceiptText(text);
      if (expense) {
        setExtractedExpense(expense);
      } else {
        setError('Could not extract expense data from the receipt');
      }
    } catch (err) {
      setError('Failed to process the image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleAddExpense = () => {
    if (extractedExpense) {
      onExpenseExtracted(extractedExpense);
      onClose();
    }
  };

  const resetScanner = () => {
    setExtractedText('');
    setExtractedExpense(null);
    setError('');
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Receipt Scanner</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isProcessing && !extractedExpense && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Upload a receipt image to automatically extract expense details
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200"
            >
              <Upload className="w-5 h-5" />
              <span>Choose Image</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-8">
            <Loader className="w-12 h-12 animate-spin text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Processing receipt...</p>
          </div>
        )}

        {extractedExpense && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-gray-900 dark:text-white font-medium">Expense Extracted!</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{extractedExpense.amount}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <p className="text-gray-900 dark:text-white">{extractedExpense.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <p className="text-gray-900 dark:text-white">{extractedExpense.date}</p>
              </div>

              {extractedExpense.merchant && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Merchant
                  </label>
                  <p className="text-gray-900 dark:text-white">{extractedExpense.merchant}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleAddExpense}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Add Expense
              </button>
              <button
                onClick={resetScanner}
                className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Scan Another
              </button>
            </div>
          </div>
        )}

        {extractedText && !extractedExpense && !isProcessing && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Extracted Text:
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto">
                <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {extractedText}
                </pre>
              </div>
            </div>
            <button
              onClick={resetScanner}
              className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Try Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptScanner;