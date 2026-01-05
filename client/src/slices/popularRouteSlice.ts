import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { popularRouteService } from '../services/popularRouteService';
import { routesService } from '../services/routesService';
import { stationService } from '../services/stationService';
import { cityService } from '../services/cityService';

export interface PopularRouteView {
  id: number;
  routeId: number;
  image: string;
  title: string;
  price: string;
}

interface PopularRouteState {
  items: PopularRouteView[];
  loading: boolean;
  error: string | null;
}

const initialState: PopularRouteState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchPopularRoutes = createAsyncThunk(
  'popularRoutes/fetchCombined',
  async (_, { rejectWithValue }) => {
    try {
      const [popularRoutes, routes, stations, cities] = await Promise.all([
        popularRouteService.getPopularRoutes(),
        routesService.getAllRoutes(),
        stationService.getAllStations(),
        cityService.getAllCities(),
      ]);

      const items: PopularRouteView[] = popularRoutes.map((pr) => {
        // Cast both sides to string to ensure matching (json-server often returns string IDs vs number references)
        const route = routes.find((r) => String(r.id) === String(pr.route_id));
        if (!route) return null;

        const departureStation = stations.find((s) => String(s.id) === String(route.departure_station_id));
        const arrivalStation = stations.find((s) => String(s.id) === String(route.arrival_station_id));

        if (!departureStation || !arrivalStation) return null;

        const departureCity = cities.find((c) => String(c.id) === String(departureStation.city_id));
        const arrivalCity = cities.find((c) => String(c.id) === String(arrivalStation.city_id));

        if (!departureCity || !arrivalCity) return null;

        return {
          id: pr.popular_route_id,
          routeId: pr.route_id,
          image: pr.image_url,
          title: `${departureCity.city_name} - ${arrivalCity.city_name}`,
          price: route.base_price ? `${Number(route.base_price).toLocaleString('vi-VN')}đ` : 'Liên hệ',
        };
      }).filter((item): item is PopularRouteView => item !== null);

      return items;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch popular routes');
    }
  }
);

const popularRouteSlice = createSlice({
  name: 'popularRoutes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPopularRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default popularRouteSlice.reducer;
