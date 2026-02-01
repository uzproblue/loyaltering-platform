'use client';

import { useEffect, useState } from 'react';

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

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

interface TransactionHistory {
  transactions: Transaction[];
  balance: number;
  total: number;
}

interface CustomerVerificationModalProps {
  customer: CustomerData | null;
  error: string | null;
  onClose: () => void;
  onAddPoints?: () => void;
  onRedeemReward?: () => void;
  onViewProfile?: () => void;
  onTransactionCreated?: () => void;
}

export default function CustomerVerificationModal({
  customer,
  error,
  onClose,
  onAddPoints,
  onRedeemReward,
  onViewProfile,
  onTransactionCreated,
}: CustomerVerificationModalProps) {
  // All hooks must be declared before any early returns
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory | null>(null);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  // Fetch transaction history when customer is loaded or when transaction is created
  useEffect(() => {
    if (customer?._id) {
      const fetchTransactionHistory = async () => {
        setIsLoadingTransactions(true);
        try {
          const response = await fetch(`/api/customers/${customer._id}/transactions?limit=10`);
          const result = await response.json();

          if (response.ok && result.success && result.data) {
            setTransactionHistory(result.data);
          }
        } catch (error) {
          console.error('Error fetching transaction history:', error);
        } finally {
          setIsLoadingTransactions(false);
        }
      };
      fetchTransactionHistory();
    }
  }, [customer?._id, onTransactionCreated]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Don't render if no customer and no error
  if (!customer && !error) return null;

  // Format member code with #
  const memberCode = customer?.memberCode ? `#${customer.memberCode}` : 'N/A';

  // Get balance from transaction history or default to 0
  const pointsBalance = transactionHistory?.balance ?? 0;
  const tierStatus = 'Gold Member'; // TODO: Get from customer data
  const tierBadge = 'GOLD';
  
  // Calculate last visit (placeholder - would need visit history)
  const lastVisit = 'YESTERDAY AT 4:15 PM'; // TODO: Get from visit history
  const visitsThisMonth = 4; // TODO: Get from visit history

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'REGISTRATION':
      case 'EARNED':
      case 'REFUNDED':
        return 'text-green-600 dark:text-green-400';
      case 'REDEEMED':
      case 'EXPIRED':
        return 'text-red-600 dark:text-red-400';
      case 'ADJUSTED':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-background-dark w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {error ? (
          // Error State
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600">error</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Customer Not Found</h2>
                <p className="text-xs opacity-50 uppercase tracking-widest font-semibold">Search Error</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        ) : customer ? (
          // Success State
          <>
            <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white dark:bg-background-dark sticky top-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600">verified_user</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Customer Verified</h2>
                  <p className="text-xs opacity-50 uppercase tracking-widest font-semibold">Member ID: {memberCode}</p>
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
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/5 dark:bg-white/5 border-2 border-primary/10 dark:border-white/10 flex items-center justify-center overflow-hidden">
                    <span className="material-symbols-outlined text-5xl opacity-20">person</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-primary text-[10px] font-black px-2 py-0.5 rounded border-2 border-white dark:border-background-dark">
                    {tierBadge}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold tracking-tight">{customer.name}</h3>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                    <div className="text-center md:text-left">
                      <p className="text-[10px] uppercase font-bold opacity-40">Points Balance</p>
                      <p className="text-2xl font-black text-primary dark:text-white">
                        {pointsBalance.toLocaleString()} <span className="text-xs font-medium opacity-50">pts</span>
                      </p>
                    </div>
                    <div className="w-px h-8 bg-black/10 dark:bg-white/10"></div>
                    <div className="text-center md:text-left">
                      <p className="text-[10px] uppercase font-bold opacity-40">Tier Status</p>
                      <p className="text-lg font-bold">{tierStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={onAddPoints}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-primary text-white rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-3xl">add_shopping_cart</span>
                  <span className="font-bold text-sm text-center">Add Points for Purchase</span>
                </button>
                <button
                  onClick={onRedeemReward}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl hover:border-primary transition-all"
                >
                  <span className="material-symbols-outlined text-3xl text-primary dark:text-white">card_giftcard</span>
                  <span className="font-bold text-sm text-center">Redeem Reward</span>
                </button>
                <button
                  onClick={() => setShowTransactionHistory(!showTransactionHistory)}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl hover:border-primary transition-all"
                >
                  <span className="material-symbols-outlined text-3xl text-primary dark:text-white">history</span>
                  <span className="font-bold text-sm text-center">Transaction History</span>
                </button>
              </div>

              {/* Transaction History Section */}
              {showTransactionHistory && (
                <div className="mb-6 p-4 bg-background-light dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm uppercase tracking-widest opacity-60">Transaction History</h4>
                    <button
                      onClick={() => setShowTransactionHistory(false)}
                      className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                  
                  {isLoadingTransactions ? (
                    <div className="text-center py-4 text-sm opacity-60">Loading transactions...</div>
                  ) : transactionHistory && transactionHistory.transactions.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {transactionHistory.transactions.map((tx) => (
                        <div
                          key={tx._id}
                          className="flex items-center justify-between p-3 bg-white dark:bg-background-dark rounded-lg border border-black/5 dark:border-white/5"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold uppercase ${getTransactionTypeColor(tx.type)}`}>
                                {tx.type}
                              </span>
                              <span className="text-xs opacity-40">{formatDate(tx.createdAt)}</span>
                            </div>
                            <p className="text-sm opacity-80">{tx.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className={`font-bold ${tx.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {tx.amount >= 0 ? '+' : ''}{tx.amount}
                            </p>
                            <p className="text-xs opacity-40">Balance: {tx.balanceAfter}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm opacity-60">No transactions found</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-background-light dark:bg-white/5 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-[10px] font-medium opacity-40">
              <span>LAST VISIT: {lastVisit}</span>
              <span>VISITS THIS MONTH: {visitsThisMonth}</span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
