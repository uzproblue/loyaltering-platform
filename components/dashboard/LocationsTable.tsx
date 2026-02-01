'use client';

export interface Location {
  id: string;
  name: string;
  status: 'active' | 'maintenance' | 'inactive';
  activeRewards: number;
  revenueMTD: string;
}

interface LocationsTableProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
  isEmpty?: boolean;
  onAddLocation?: () => void;
}

export default function LocationsTable({ locations, onLocationClick, isEmpty = false, onAddLocation }: LocationsTableProps) {
  const getStatusBadge = (status: Location['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide">
            Active
          </span>
        );
      case 'maintenance':
        return (
          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-wide">
            Maintenance
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wide">
            Inactive
          </span>
        );
    }
  };

  if (isEmpty) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-[#e0e0e0] dark:border-[#333] shadow-sm overflow-hidden flex flex-col min-h-[300px]">
        <div className="p-6 border-b border-[#e0e0e0] dark:border-[#333]">
          <h3 className="text-lg font-bold">Locations Overview</h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          <div className="size-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[#757575]">storefront</span>
          </div>
          <p className="text-[#757575] text-sm font-medium mb-4">You haven&apos;t added any business locations.</p>
          {onAddLocation && (
            <button
              onClick={onAddLocation}
              className="text-primary dark:text-white border border-primary/20 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined !text-[20px]">add</span>
              Add Your First Location
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-[#e0e0e0] dark:border-[#333] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[#e0e0e0] dark:border-[#333]">
        <h3 className="text-lg font-bold">Locations Overview</h3>
      </div>
      <table className="w-full text-left">
        <thead className="bg-background-light/50 dark:bg-white/5">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-[#757575] uppercase tracking-wider">
              Location Name
            </th>
            <th className="px-6 py-4 text-xs font-bold text-[#757575] uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-[#757575] uppercase tracking-wider text-center">
              Active Rewards
            </th>
            <th className="px-6 py-4 text-xs font-bold text-[#757575] uppercase tracking-wider text-right">
              Revenue (MTD)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e0e0e0] dark:divide-[#333]">
          {locations.map((location) => (
            <tr
              key={location.id}
              onClick={() => onLocationClick?.(location)}
              className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined !text-lg">storefront</span>
                  </div>
                  <span className="text-sm font-semibold">{location.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">{getStatusBadge(location.status)}</td>
              <td className="px-6 py-4 text-center text-sm">{location.activeRewards}</td>
              <td className="px-6 py-4 text-right text-sm font-medium">{location.revenueMTD}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

