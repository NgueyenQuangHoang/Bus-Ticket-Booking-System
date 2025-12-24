import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { tripSearchService, type TripSearchResult, type SearchParams } from '../services/tripSearchService';

interface TripSearchState {
  trips: TripSearchResult[];
  loading: boolean;
  error: string | null;
  searchParams: SearchParams | null;
}

const initialState: TripSearchState = {
  trips: [],
  loading: false,
  error: null,
  searchParams: null,
};

export const searchTrips = createAsyncThunk(
  'tripSearch/searchTrips',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const data = await tripSearchService.searchTrips(params);
      return { trips: data, params };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Lỗi tìm kiếm chuyến xe');
    }
  }
);

const tripSearchSlice = createSlice({
  name: 'tripSearch',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.trips = [];
      state.error = null;
      state.searchParams = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTrips.fulfilled, (state, action: PayloadAction<{ trips: TripSearchResult[]; params: SearchParams }>) => {
        state.loading = false;
        state.trips = action.payload.trips;
        state.searchParams = action.payload.params;
      })
      .addCase(searchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSearchResults } = tripSearchSlice.actions;
export default tripSearchSlice.reducer;
