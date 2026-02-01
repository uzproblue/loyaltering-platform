'use client';

import { useState, useEffect } from 'react';

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

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  icon: string;
}

interface RedeemRewardModalProps {
  customer: CustomerData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: { title: string; description: string }) => void;
}

// Sample rewards - in production, this would come from an API
const SAMPLE_REWARDS: Reward[] = [
  {
    id: '1',
    name: 'Signature Latte',
    description: 'Any size, hot or iced',
    pointsCost: 150,
    category: 'Beverages',
    icon: 'coffee'
  },
  {
    id: '2',
    name: 'Pastry of Choice',
    description: 'Daily fresh selection',
    pointsCost: 300,
    category: 'Food',
    icon: 'lunch_dining'
  },
  {
    id: '3',
    name: '20% Off Coupon',
    description: 'Entire purchase discount',
    pointsCost: 500,
    category: 'Vouchers',
    icon: 'sell'
  },
  {
    id: '4',
    name: '$10 Store Credit',
    description: 'Apply to any purchase',
    pointsCost: 1000,
    category: 'Vouchers',
    icon: 'local_mall'
  },
  {
    id: '5',
    name: 'Limited Edition Hoodie',
    description: 'Premium cotton apparel',
    pointsCost: 2500,
    category: 'Merchandise',
    icon: 'apparel'
  }
];

const CATEGORIES = ['All Categories', 'Beverages', 'Food', 'Vouchers', 'Merchandise'];

export default function RedeemRewardModal({
  customer,
  isOpen,
  onClose,
  onSuccess,
}: RedeemRewardModalProps) {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

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

  const handleRedeem = async (reward: Reward) => {
    if (!customer || !customer._id || !customer.restaurantId) {
      alert('Customer information is incomplete');
      return;
    }

    if (currentBalance < reward.pointsCost) {
      alert('Insufficient points for this reward');
      return;
    }

    setIsRedeeming(reward.id);

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer._id,
          restaurantId: customer.restaurantId,
          type: 'REDEEMED',
          amount: -reward.pointsCost,
          description: `Reward redeemed: ${reward.name}`,
          metadata: {
            rewardId: reward.id,
            rewardName: reward.name,
            rewardCategory: reward.category
          }
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onSuccess({
          title: 'Reward Redeemed',
          description: `Successfully redeemed ${reward.name} for ${reward.pointsCost} points`
        });
        // Refresh balance
        fetchBalance();
      } else {
        alert(result.message || 'Failed to redeem reward');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('An error occurred while redeeming reward');
    } finally {
      setIsRedeeming(null);
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

  // Filter rewards
  const filteredRewards = SAMPLE_REWARDS.filter((reward) => {
    const matchesSearch = reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || reward.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Count available rewards (affordable)
  const availableRewardsCount = filteredRewards.filter(r => currentBalance >= r.pointsCost).length;

  // Tier status (placeholder)
  const tierStatus = 'Gold Member';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-background-dark w-full max-w-2xl h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-black/5 dark:border-white/5 flex flex-col gap-4 bg-white dark:bg-background-dark shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="w-8 h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center"
                aria-label="Back"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <div>
                <h2 className="text-lg font-bold">Operator Redemption Console</h2>
                <p className="text-[11px] opacity-60">
                  Customer: <span className="font-bold">{customer.name}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end px-4 py-2 bg-primary/5 dark:bg-white/5 rounded-xl border border-primary/10 dark:border-white/10">
              <p className="text-[10px] uppercase font-bold opacity-40 leading-none mb-1">
                Available Points
              </p>
              <p className="text-3xl font-black text-primary dark:text-white leading-none">
                {isLoadingBalance ? '...' : currentBalance.toLocaleString()}{' '}
                <span className="text-xs font-medium opacity-50 uppercase">pts</span>
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="px-6 py-3 border-b border-black/5 dark:border-white/5 bg-background-light/30 dark:bg-white/5 flex gap-3 items-center shrink-0">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 opacity-40 text-sm">
              search
            </span>
            <input
              className="w-full bg-white dark:bg-background-dark border border-black/10 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Quick find rewards..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative min-w-[140px]">
            <select
              className="w-full bg-white dark:bg-background-dark border border-black/10 dark:border-white/10 rounded-lg pl-3 pr-8 py-2 text-xs font-bold appearance-none focus:ring-1 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none opacity-40">
              expand_more
            </span>
          </div>
        </div>

        {/* Rewards List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {filteredRewards.map((reward) => {
              const canAfford = currentBalance >= reward.pointsCost;
              const isRedeemingThis = isRedeeming === reward.id;

              return (
                <div
                  key={reward.id}
                  className={`flex items-center gap-4 px-6 py-3 transition-colors ${
                    canAfford
                      ? 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                      : 'opacity-40'
                  }`}
                >
                  <div className="w-10 h-10 bg-background-light dark:bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl opacity-60">
                      {reward.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{reward.name}</h4>
                    <p className="text-[11px] opacity-40 truncate">{reward.description}</p>
                  </div>
                  <div className="text-right px-4">
                    <p className="text-sm font-black whitespace-nowrap">
                      {reward.pointsCost.toLocaleString()}{' '}
                      <span className="text-[9px] font-bold opacity-40 uppercase">pts</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || isRedeemingThis}
                    className={`px-5 py-2 text-[11px] font-bold rounded-lg whitespace-nowrap shadow-sm transition-colors ${
                      canAfford
                        ? 'bg-primary text-white hover:bg-black'
                        : 'bg-black/5 dark:bg-white/5 cursor-not-allowed border border-black/5 dark:border-white/5'
                    }`}
                  >
                    {isRedeemingThis
                      ? 'Processing...'
                      : canAfford
                      ? 'Redeem'
                      : 'Insufficient'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-background-light dark:bg-white/5 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-[10px] font-bold opacity-40 shrink-0 uppercase tracking-widest">
          <span>Tier: {tierStatus}</span>
          <span>{availableRewardsCount} available items</span>
        </div>
      </div>
    </div>
  );
}
