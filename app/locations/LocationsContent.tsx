'use client';

import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import AddLocationModal from '@/components/dashboard/AddLocationModal';
import EditLocationModal from '@/components/dashboard/EditLocationModal';
import LocationCreatedSuccessModal from '@/components/dashboard/LocationCreatedSuccessModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLocations } from '@/store/slices/locationsSlice';
import type { Location } from '@/store/slices/locationsSlice';

const PAGE_SIZE = 10;

export default function LocationsContent() {
  const dispatch = useAppDispatch();
  const { locations, isLoading } = useAppSelector((state) => state.locations);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdLocation, setCreatedLocation] = useState<{
    location: { id: string; name: string; address: string; category: string; createdAt: string };
    operator: { id: string; name: string; email: string; role: string; locationAccess: string[]; password: string; createdAt: string };
  } | null>(null);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return locations;
    const q = searchQuery.trim().toLowerCase();
    return locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        (loc.address && loc.address.toLowerCase().includes(q))
    );
  }, [locations, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredLocations.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedLocations = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLocations.slice(start, start + PAGE_SIZE);
  }, [filteredLocations, currentPage]);

  const activeCount = locations.filter((l) => l.status === 'active').length;
  const totalActiveCustomers = locations.reduce((sum, l) => sum + (l.activeCustomers ?? 0), 0);
  const avgSpendValues = locations
    .filter((l) => l.avgLoyaltySpend && l.avgLoyaltySpend !== '$0.00')
    .map((l) => parseFloat((l.avgLoyaltySpend || '0').replace(/[$,]/g, '')));
  const globalAvgSpend =
    avgSpendValues.length > 0
      ? '$' + (avgSpendValues.reduce((a, b) => a + b, 0) / avgSpendValues.length).toFixed(2)
      : '$0.00';

  const handleAddLocation = (data: {
    location: { id: string; name: string; address: string; category: string; createdAt: string };
    operator: { id: string; name: string; email: string; role: string; locationAccess: string[]; password: string; createdAt: string };
  }) => {
    setIsAddLocationModalOpen(false);
    setCreatedLocation(data);
    setIsSuccessModalOpen(true);
    dispatch(fetchLocations());
  };

  const handleEditSaved = () => {
    setEditingLocation(null);
    dispatch(fetchLocations());
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-background-light dark:bg-background-dark">
        <Header title="Locations" />

        <div className="flex-1 overflow-hidden p-8 max-w-7xl mx-auto w-full flex flex-col">
          {/* Business Branches section */}
          <div className="mb-6 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-lg font-bold text-[#141414] dark:text-white">Business Branches</h3>
              <p className="text-sm text-gray-500 mt-1">
                Power user view: {locations.length} active location{locations.length !== 1 ? 's' : ''} across regions.
              </p>
            </div>
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-white/5 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-gray-500 text-[#141414] dark:text-white"
                placeholder="Search locations..."
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#202020] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden flex-1 min-h-0">
            <div className="overflow-x-auto custom-scrollbar flex-1 min-h-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-500">
                  Loading locations...
                </div>
              ) : filteredLocations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <span className="material-symbols-outlined text-4xl mb-4">storefront</span>
                  <p className="text-sm font-medium">
                    {searchQuery ? 'No locations match your search.' : 'You haven\'t added any business locations.'}
                  </p>
                  {!searchQuery && (
                    <button
                      type="button"
                      onClick={() => setIsAddLocationModalOpen(true)}
                      className="mt-4 flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-black"
                    >
                      <span className="material-symbols-outlined text-xl">add_location</span>
                      Add Your First Location
                    </button>
                  )}
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Location Name
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                        Active Customers
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                        Avg. Loyalty Spend
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Last Active Date
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {paginatedLocations.map((location) => (
                      <LocationRow
                        key={location.id}
                        location={location}
                        onEdit={() => setEditingLocation(location)}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {!isLoading && filteredLocations.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
                <span className="text-xs font-medium text-gray-500">
                  Showing {paginatedLocations.length} of {filteredLocations.length} locations
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                  </button>
                  <span className="text-xs font-bold px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stats cards + Quick Add */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
            <div className="bg-white dark:bg-[#202020] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total Active Customers
              </p>
              <p className="text-xl font-bold mt-1 text-[#141414] dark:text-white">
                {totalActiveCustomers.toLocaleString()}
              </p>
            </div>
            <div className="bg-white dark:bg-[#202020] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Global Avg. Spend
              </p>
              <p className="text-xl font-bold mt-1 text-[#141414] dark:text-white">{globalAvgSpend}</p>
            </div>
            <div className="bg-white dark:bg-[#202020] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Active Branches
              </p>
              <p className="text-xl font-bold mt-1 text-[#141414] dark:text-white">
                {activeCount}/{locations.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddLocationModalOpen(true)}
              className="border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-xl p-4 flex items-center justify-center gap-2 hover:border-primary transition-colors text-gray-500 group"
            >
              <span className="material-symbols-outlined group-hover:text-primary transition-colors">
                add_circle
              </span>
              <span className="text-sm font-bold group-hover:text-primary transition-colors">
                Quick Add Location
              </span>
            </button>
          </div>
        </div>
      </main>

      <AddLocationModal
        isOpen={isAddLocationModalOpen}
        onClose={() => setIsAddLocationModalOpen(false)}
        onSubmit={handleAddLocation}
      />

      <EditLocationModal
        isOpen={!!editingLocation}
        onClose={() => setEditingLocation(null)}
        location={editingLocation ? { id: editingLocation.id, name: editingLocation.name, address: editingLocation.address || '', category: editingLocation.category || 'Retail' } : null}
        onSaved={handleEditSaved}
      />

      {createdLocation && (
        <LocationCreatedSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => {
            setIsSuccessModalOpen(false);
            setCreatedLocation(null);
          }}
          location={createdLocation.location}
          operator={createdLocation.operator}
        />
      )}
    </div>
  );
}

function LocationRow({ location, onEdit }: { location: Location; onEdit?: () => void }) {
  const isActive = location.status === 'active';
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-bold text-[#141414] dark:text-white text-sm">{location.name}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-500">{location.address || '—'}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <span
          className={`text-sm font-bold ${isActive ? 'text-primary dark:text-white' : 'text-gray-400'}`}
        >
          {(location.activeCustomers ?? 0).toLocaleString()}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <span
          className={`text-sm font-medium ${isActive ? 'text-[#141414] dark:text-white' : 'text-gray-400'}`}
        >
          {location.avgLoyaltySpend ?? '$0.00'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-500">{location.lastActiveDate || '—'}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div
            className={`size-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
          />
          <span
            className={`text-xs font-semibold uppercase ${isActive ? 'text-green-600' : 'text-gray-400'}`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <button
          type="button"
          onClick={onEdit}
          className="text-gray-400 hover:text-primary transition-colors"
          aria-label="Edit location"
        >
          <span className="material-symbols-outlined">settings_suggest</span>
        </button>
      </td>
    </tr>
  );
}
