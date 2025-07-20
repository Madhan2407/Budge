import React, { useState } from 'react';
import { Building2, Shield, CheckCircle, ArrowRight, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const BankLinking: React.FC = () => {
  const [step, setStep] = useState<'select' | 'otp' | 'success'>('select');
  const [selectedBank, setSelectedBank] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setBankLinked } = useApp();

  const banks = [
    { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
    { id: 'icici', name: 'ICICI Bank', logo: '🏛️' },
    { id: 'sbi', name: 'State Bank of India', logo: '🏪' },
    { id: 'axis', name: 'Axis Bank', logo: '🏢' },
    { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏬' }
  ];

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpSubmit = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      setLoading(true);
      
      // Simulate OTP verification
      setTimeout(() => {
        setLoading(false);
        setStep('success');
        
        // After success animation, navigate to dashboard
        setTimeout(() => {
          setBankLinked(true);
          navigate('/dashboard');
        }, 2000);
      }, 1500);
    }
  };

  const handleSkip = () => {
    setBankLinked(true);
    navigate('/dashboard');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Bank Linked Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-400">Your account is now connected and ready to use.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {step === 'select' ? 'Link Your Bank Account' : 'Verify Your Account'}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {step === 'select' 
              ? 'Choose your bank to get started with automatic transaction tracking'
              : 'Enter the OTP sent to your registered mobile number'
            }
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {step === 'select' && (
            <>
              {/* Security Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Your data is secure</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      We use bank-grade encryption and never store your login credentials
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Selection */}
              <div className="space-y-3">
                {banks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => handleBankSelect(bank.id)}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{bank.logo}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{bank.name}</span>
                    </div>
                    {loading && selectedBank === bank.id ? (
                      <Loader className="w-5 h-5 animate-spin text-gray-400" />
                    ) : (
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Skip Option */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Skip for now, I'll link later
                </button>
              </div>
            </>
          )}

          {step === 'otp' && (
            <>
              {/* Selected Bank Info */}
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <span className="text-3xl">{banks.find(b => b.id === selectedBank)?.logo}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {banks.find(b => b.id === selectedBank)?.name}
                  </p>
                </div>
              </div>

              {/* OTP Input */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                    Enter 6-digit OTP
                  </label>
                  <div className="flex justify-center space-x-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 text-center text-lg font-bold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleOtpSubmit}
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <Loader className="animate-spin h-5 w-5" />
                  ) : (
                    'Verify & Link Account'
                  )}
                </button>

                <div className="text-center">
                  <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    Didn't receive OTP? Resend
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankLinking;