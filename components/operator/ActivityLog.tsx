'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { connectSocket, disconnectSocket, subscribeToTransactions, isSocketConnected } from '@/lib/socket';

interface Transaction {
  _id: string;
  customerId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface ActivityItem {
  id: string;
  customerId: string | null;
  customerName: string;
  description: string;
  points: number;
  pointsType: 'add' | 'redeem';
  timeAgo: string;
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
};

interface ActivityLogProps {
  onCustomerClick?: (customerId: string) => void;
}

export default function ActivityLog({ onCustomerClick }: ActivityLogProps) {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [useWebSocket, setUseWebSocket] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Track mount state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get restaurantId from user profile
  useEffect(() => {
    const fetchRestaurantId = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch('/api/user/profile', {
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.restaurantId) {
            setRestaurantId(data.data.restaurantId);
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant ID:', error);
      }
    };

    fetchRestaurantId();
  }, [session]);

  // Fetch transactions function (used for initial load and polling fallback)
  const fetchTransactions = async () => {
    if (!restaurantId) return;

    try {
      const response = await fetch(`/api/transactions/restaurant/${restaurantId}?limit=20`);
      const result = await response.json();

      if (response.ok && result.success && result.data?.transactions) {
        const transactions: Transaction[] = result.data.transactions;
        const activityItems: ActivityItem[] = transactions.map((tx) => {
          const customerName = typeof tx.customerId === 'object' && tx.customerId !== null
            ? tx.customerId.name
            : 'Unknown Customer';
          
          const customerId = typeof tx.customerId === 'object' && tx.customerId !== null
            ? tx.customerId._id
            : typeof tx.customerId === 'string'
            ? tx.customerId
            : null;

          const pointsType: 'add' | 'redeem' = 
            tx.type === 'EARNED' || tx.type === 'REGISTRATION' || tx.type === 'REFUNDED'
              ? 'add'
              : 'redeem';

          return {
            id: tx._id,
            customerId,
            customerName,
            description: tx.description,
            points: Math.abs(tx.amount),
            pointsType,
            timeAgo: formatTimeAgo(tx.createdAt),
          };
        });

        setActivities(activityItems);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert transaction to activity item
  const transactionToActivity = (tx: Transaction): ActivityItem => {
    const customerName = typeof tx.customerId === 'object' && tx.customerId !== null
      ? tx.customerId.name
      : 'Unknown Customer';
    
    const customerId = typeof tx.customerId === 'object' && tx.customerId !== null
      ? tx.customerId._id
      : typeof tx.customerId === 'string'
      ? tx.customerId
      : null;

    const pointsType: 'add' | 'redeem' = 
      tx.type === 'EARNED' || tx.type === 'REGISTRATION' || tx.type === 'REFUNDED'
        ? 'add'
        : 'redeem';

    return {
      id: tx._id,
      customerId,
      customerName,
      description: tx.description,
      points: Math.abs(tx.amount),
      pointsType,
      timeAgo: formatTimeAgo(tx.createdAt),
    };
  };

  // WebSocket connection and subscription
  useEffect(() => {
    if (!restaurantId || !useWebSocket) return;

    // Initial fetch
    setIsLoading(true);
    fetchTransactions();

    // Connect to Socket.io
    const socket = connectSocket(restaurantId);

    // Set initial connection status
    setIsConnected(isSocketConnected());

    // Track disconnection attempts
    let disconnectionAttempts = 0;

    // Check connection status periodically
    const connectionCheckInterval = setInterval(() => {
      const connected = isSocketConnected();
      setIsConnected(connected);
      
      // Fallback to polling if WebSocket fails after multiple attempts
      if (!connected && useWebSocket) {
        disconnectionAttempts++;
        
        if (disconnectionAttempts > 3) { // After 6 seconds of disconnection
          console.warn('WebSocket disconnected, falling back to polling');
          setUseWebSocket(false);
        }
      } else {
        disconnectionAttempts = 0; // Reset on successful connection
      }
    }, 2000);

    // Subscribe to transaction events
    const unsubscribe = subscribeToTransactions((data: { transaction: Transaction; customer: any }) => {
      const { transaction } = data;
      
      // Add new transaction to the top of the list
      setActivities((prev) => {
        // Check if transaction already exists (avoid duplicates)
        if (prev.some((activity) => activity.id === transaction._id)) {
          return prev;
        }
        
        const newActivity = transactionToActivity(transaction);
        return [newActivity, ...prev].slice(0, 20); // Keep only latest 20
      });
    });

    unsubscribeRef.current = unsubscribe;

    // Cleanup on unmount
    return () => {
      clearInterval(connectionCheckInterval);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      disconnectSocket();
    };
  }, [restaurantId, useWebSocket]);

  // Polling fallback when WebSocket is not available
  useEffect(() => {
    if (!restaurantId || useWebSocket) return;

    // Initial fetch
    fetchTransactions();

    // Set up polling interval
    pollingIntervalRef.current = setInterval(fetchTransactions, 10000); // Poll every 10 seconds

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [restaurantId, useWebSocket]);
  return (
    <div className="bg-white dark:bg-background-dark border border-black/10 dark:border-white/10 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
      <div className="p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
        <h2 className="font-bold text-lg">Recent Activity</h2>
        <div className="flex items-center gap-2">
          {mounted && useWebSocket && (
            <span 
              className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${
                isConnected
                  ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                  : 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
              }`}
              title={isConnected ? 'Connected (Real-time)' : 'Connecting...'}
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              {isConnected ? 'Live' : 'Connecting'}
            </span>
          )}
          {mounted && !useWebSocket && (
            <span className="text-xs font-bold text-primary/60 dark:text-white/60 bg-primary/10 dark:bg-white/10 px-2 py-1 rounded">
              Polling
            </span>
          )}
          {!mounted && (
            <span className="text-xs font-bold text-primary/60 dark:text-white/60 bg-primary/10 dark:bg-white/10 px-2 py-1 rounded">
              Live
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[600px]">
        {isLoading ? (
          <div className="text-center py-8 text-sm opacity-60">Loading recent activity...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-sm opacity-60">No recent activity</div>
        ) : (
          activities.map((activity) => (
          <div
            key={activity.id}
            onClick={() => {
              if (activity.customerId && onCustomerClick) {
                onCustomerClick(activity.customerId);
              }
            }}
            className={`p-4 bg-background-light dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 flex items-center gap-4 ${
              activity.customerId && onCustomerClick
                ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 transition-colors'
                : ''
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.pointsType === 'add'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-primary/10 dark:bg-white/10 text-primary dark:text-white'
              }`}
            >
              <span className="material-symbols-outlined">
                {activity.pointsType === 'add' ? 'add' : 'card_giftcard'}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm">{activity.customerName}</h3>
                <span className="text-[10px] font-medium opacity-40 italic">{activity.timeAgo}</span>
              </div>
              <p className="text-xs opacity-60">{activity.description}</p>
            </div>
            <div className="text-right">
              <p
                className={`font-bold ${
                  activity.pointsType === 'add'
                    ? 'text-green-600'
                    : 'opacity-80'
                }`}
              >
                {activity.pointsType === 'add' ? '+' : '-'}
                {activity.points} pts
              </p>
            </div>
          </div>
          ))
        )}
      </div>
      <div className="p-6 bg-primary/5 dark:bg-white/5 border-t border-black/10 dark:border-white/10 mt-auto">
        <button className="w-full text-center py-2 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity">
          View Full History
        </button>
      </div>
    </div>
  );
}

