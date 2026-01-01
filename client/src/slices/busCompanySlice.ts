import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { busCompanyService } from '../services/busCompanyService';
import type { BusCompany } from '../types/index';

interface BusCompanyState {
  companies: BusCompany[];
  popularCompanies: BusCompany[];
  loading: boolean;
  error: string | null;
}

const initialState: BusCompanyState = {
  companies: [],
  popularCompanies: [],
  loading: false,
  error: null,
};

export const fetchBusCompanies = createAsyncThunk(
  'busCompany/fetchBusCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const data = await busCompanyService.getAllBusCompanies();
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch bus companies');
    }
  }
);

export const fetchPopularBusCompanies = createAsyncThunk(
  'busCompany/fetchPopularBusCompanies',
  async (limit: number | undefined, { rejectWithValue }) => {
    try {
      const data = await busCompanyService.getPopularBusCompanies(limit);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch popular bus companies');
    }
  }
);

const busCompanySlice = createSlice({
  name: 'busCompany',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchBusCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusCompanies.fulfilled, (state, action: PayloadAction<BusCompany[]>) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchBusCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Popular
    builder
      .addCase(fetchPopularBusCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularBusCompanies.fulfilled, (state, action: PayloadAction<BusCompany[]>) => {
        state.loading = false;
        state.popularCompanies = action.payload;
      })
      .addCase(fetchPopularBusCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default busCompanySlice.reducer;
