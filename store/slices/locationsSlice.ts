import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Location {
  id: string;
  name: string;
  address?: string;
  category?: string;
  status: 'active' | 'inactive';
  activeRewards: number;
  revenueMTD: string;
  activeCustomers?: number;
  avgLoyaltySpend?: string;
  lastActiveDate?: string;
  createdAt?: string;
}

interface LocationsState {
  locations: Location[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LocationsState = {
  locations: [],
  isLoading: false,
  error: null,
};

// Async thunk to fetch locations
export const fetchLocations = createAsyncThunk(
  'locations/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/locations', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const result = await response.json();

      if (result.success && result.data) {
        // Map Restaurant documents to Location interface
        const mappedLocations: Location[] = result.data.map((restaurant: any) => {
          const created = restaurant.createdAt ? new Date(restaurant.createdAt) : null;
          return {
            id: restaurant._id || restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
            category: restaurant.category,
            status: 'active' as const,
            activeRewards: 0,
            revenueMTD: '$0.00',
            activeCustomers: 0,
            avgLoyaltySpend: '$0.00',
            lastActiveDate: created ? created.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : undefined,
            createdAt: restaurant.createdAt,
          };
        });
        return mappedLocations;
      }

      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch locations');
    }
  }
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    clearLocations: (state) => {
      state.locations = [];
      state.error = null;
    },
    addLocation: (state, action: PayloadAction<Location>) => {
      state.locations.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.locations = action.payload;
        state.error = null;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLocations, addLocation } = locationsSlice.actions;
export default locationsSlice.reducer;
