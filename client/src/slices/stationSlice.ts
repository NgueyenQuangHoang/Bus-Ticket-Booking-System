import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { stationService } from '../services/stationService';
import type { Station } from '../types/index';

interface StationState {
  stations: Station[];
  popularStations: Station[];
  loading: boolean;
  error: string | null;
}

const initialState: StationState = {
  stations: [],
  popularStations: [],
  loading: false,
  error: null,
};

export const fetchStations = createAsyncThunk(
  'station/fetchStations',
  async (_, { rejectWithValue }) => {
    try {
      const data = await stationService.getAllStations();
      return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch stations');
    }
  }
);

export const fetchPopularStations = createAsyncThunk(
    'station/fetchPopularStations',
    async (limit: number | undefined, { rejectWithValue }) => {
      try {
        const data = await stationService.getPopularStations(limit);
        return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch popular stations');
      }
    }
  );

const stationSlice = createSlice({
  name: 'station',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStations.fulfilled, (state, action: PayloadAction<Station[]>) => {
        state.loading = false;
        state.stations = action.payload;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Popular
    builder
      .addCase(fetchPopularStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularStations.fulfilled, (state, action: PayloadAction<Station[]>) => {
        state.loading = false;
        state.popularStations = action.payload;
      })
      .addCase(fetchPopularStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },

});

export default stationSlice.reducer;
