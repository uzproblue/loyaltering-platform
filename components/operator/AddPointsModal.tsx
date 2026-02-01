'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface CustomerData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  memberCode?: string;
  restaurantId?: string;
  createdAt: string;
  updatedAt: string;
}

interface AddPointsModalProps {
  customer: CustomerData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: { title: string; description: string }) => void;
}

const EARN_RATE = 0.10; // 10% earn rate

export default function AddPointsModal({
  customer,
  isOpen,
  onClose,
  onSuccess,
}: AddPointsModalProps) {
  const { data: session } = useSession();
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [manualOverride, setManualOverride] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  // Fetch current balance when modal opens
  useEffect(() => {
    if (isOpen && customer?._id) {
      fetchBalance();
    }
  }, [isOpen, customer?._id]);

  const fetchBalance = async () => {
    if (!customer?._id) return;

    setIsLoadingBalance(true);
    try {
      const response = await fetch(`/api/customers/${customer._id}/balance`);
      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setCurrentBalance(result.data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Calculate points from purchase amount
  const calculatedPoints = purchaseAmount
    ? Math.round(parseFloat(purchaseAmount) * EARN_RATE)
    : 0;

  // Calculate manual override adjustment
  const overrideAdjustment = manualOverride
    ? (manualOverride.startsWith('+') || manualOverride.startsWith('-')
        ? parseInt(manualOverride, 10)
        : parseInt(manualOverride, 10))
    : 0;

  // Total points to add
  const totalPoints = calculatedPoints + overrideAdjustment;

  // New balance after transaction
  const newBalance = currentBalance + totalPoints;

  // Calculate next tier (placeholder - would need tier system)
  const nextTierPoints = 2500; // Example: Platinum at 2500
  const pointsToNextTier = Math.max(0, nextTierPoints - newBalance);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer || !customer._id || !customer.restaurantId) {
      alert('Customer information is incomplete');
      return;
    }

    if (!purchaseAmount || parseFloat(purchaseAmount) <= 0) {
      alert('Please enter a valid purchase amount');
      return;
    }

    if (totalPoints <= 0) {
      alert('Total points to add must be greater than 0');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer._id,
          restaurantId: customer.restaurantId,
          type: 'EARNED',
          amount: totalPoints,
          description: `Points earned: Purchase $${parseFloat(purchaseAmount).toFixed(2)}${overrideAdjustment !== 0 ? ` (${overrideAdjustment > 0 ? '+' : ''}${overrideAdjustment} override)` : ''}`,
          metadata: {
            purchaseAmount: parseFloat(purchaseAmount),
            calculatedPoints,
            overrideAdjustment,
            earnRate: EARN_RATE
          }
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onSuccess({
          title: 'Points Added',
          description: `Successfully added ${totalPoints} points to ${customer.name}'s account`
        });
        onClose();
        // Reset form
        setPurchaseAmount('');
        setManualOverride('');
      } else {
        alert(result.message || 'Failed to add points');
      }
    } catch (error) {
      console.error('Error adding points:', error);
      alert('An error occurred while adding points');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const memberCode = customer?.memberCode ? `#${customer.memberCode}` : 'N/A';
  const operatorName = session?.user?.name || 'Operator';
  const terminalId = 'POS-1120-WEST'; // TODO: Get from context or props

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-background-dark w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white dark:bg-background-dark">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Back"
            >
              <span className="material-symbols-outlined opacity-60">arrow_back</span>
            </button>
            <div>
              <h2 className="text-xl font-bold">Add Points for Purchase</h2>
              <p className="text-[10px] opacity-50 uppercase tracking-widest font-semibold italic">
                Customer: {customer.name} • {memberCode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined opacity-60">close</span>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest mb-3 opacity-60">
                    Total Purchase Amount ($)
                  </label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold opacity-30 group-focus-within:opacity-100 transition-opacity">
                      $
                    </span>
                    <input
                      autoFocus
                      className="w-full pl-12 pr-6 py-6 text-4xl font-black bg-background-light dark:bg-white/5 border-2 border-transparent focus:border-primary dark:focus:border-white rounded-2xl outline-none transition-all"
                      type="number"
                      step="0.01"
                      min="0"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold opacity-60">Points to be Added</span>
                    <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded font-bold uppercase">
                      {Math.round(EARN_RATE * 100)}% Earn Rate
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-primary dark:text-white">
                      {calculatedPoints}
                    </span>
                    <span className="text-sm font-bold opacity-40 mb-1.5 uppercase">Points</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest mb-3 opacity-60">
                      Manual Point Override (Optional)
                    </label>
                    <div className="relative">
                      <input
                        className="w-full px-4 py-3 bg-background-light dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="± Enter extra points..."
                        type="text"
                        value={manualOverride}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow empty, +, -, or numbers
                          if (value === '' || /^[+-]?\d*$/.test(value)) {
                            setManualOverride(value);
                          }
                        }}
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-30">
                        edit_note
                      </span>
                    </div>
                    <p className="mt-2 text-[10px] opacity-40 italic">
                      Use for special promotions or corrections.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="opacity-60">Current Balance</span>
                      <span className="font-bold">
                        {isLoadingBalance ? 'Loading...' : `${currentBalance.toLocaleString()} pts`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="opacity-60">New Balance</span>
                      <span className="font-bold text-green-600">
                        {newBalance.toLocaleString()} pts
                      </span>
                    </div>
                    <div className="w-full h-px bg-black/5 dark:bg-white/5 my-2"></div>
                    <div className="flex justify-between text-xs">
                      <span className="opacity-60">Next Tier Progress</span>
                      <span className="font-bold">
                        {pointsToNextTier > 0
                          ? `Platinum in ${pointsToNextTier} pts`
                          : 'Platinum Achieved'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !purchaseAmount || totalPoints <= 0}
                  className="w-full mt-8 bg-primary dark:bg-white text-white dark:text-primary py-5 rounded-xl font-black text-lg shadow-xl shadow-primary/20 dark:shadow-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  {isLoading ? 'Processing...' : 'Confirm Points'}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-background-light dark:bg-white/5 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-[10px] font-bold opacity-40 tracking-wider">
            <span>OPERATOR: {operatorName.toUpperCase()}</span>
            <span>TERMINAL: {terminalId}</span>
          </div>
        </form>
      </div>
    </div>
  );
}
