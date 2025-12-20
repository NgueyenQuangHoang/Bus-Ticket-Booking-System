import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { routesService } from '../services/routesService';
import type { Route } from '../types/index';

interface RoutesState {
  routes: Route[];
  popularRoutes: Route[];
  loading: boolean;
  error: string | null;
}

const initialState: RoutesState = {
  routes: [],
  popularRoutes: [],
  loading: false,
  error: null,
};

export const fetchRoutes = createAsyncThunk(
  'routes/fetchRoutes',
  async (_, { rejectWithValue }) => {
    try {
      const data = await routesService.getAllRoutes();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch routes');
    }
  }
);

export const fetchPopularRoutes = createAsyncThunk(
  'routes/fetchPopularRoutes',
  async (limit: number | undefined, { rejectWithValue }) => {
    try {
      const data = await routesService.getPopularRoutes(limit);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch popular routes');
    }
  }
);

const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action: PayloadAction<Route[]>) => {
        state.loading = false;
        state.routes = action.payload;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Popular
    builder
      .addCase(fetchPopularRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularRoutes.fulfilled, (state, action: PayloadAction<Route[]>) => {
        state.loading = false;
        state.popularRoutes = action.payload;
      })
      .addCase(fetchPopularRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default routesSlice.reducer;
