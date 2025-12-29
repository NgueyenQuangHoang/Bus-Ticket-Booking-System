import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch popular routes');
        }
    }
);

export const removeRoute = createAsyncThunk('routes/removeRoutes', async (id: string) => {
    try {
        const response = await routesService.deleteRoute(id)
        return response
    } catch (error) {
        return error
    }
})

export const updateRoutes = createAsyncThunk('routes/updateRoute', async (route: Route) => {
    try {
        const response = await routesService.updateRoute(route)
        return response
    } catch (error) {
        return error as string
    }
})

export const createPostRoute = createAsyncThunk('routes/postRoute', async (route: Route) => {
    try {
        const response = await routesService.createRoute(route)
        return response
    } catch (error) {
        return error as string
    }
})

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

        // xoa data
        builder
            .addCase(removeRoute.pending, (state) => {
                state.loading = true
            })
            .addCase(removeRoute.fulfilled, (state, action) => {
                const id = action.payload
                state.routes = state.routes.filter(item => item.id != id)
            })
            .addCase(removeRoute.rejected, (state, action) => {
                state.error = action.payload as string
            })

        // sua du lieu
        builder
            .addCase(updateRoutes.pending, (state) => { state.loading = true })
            .addCase(updateRoutes.fulfilled, (state, action) => {
                const route = action.payload  as Route
                state.routes = state.routes.map((item) => {
                    return item.id == route.id ? route : item
                })
            })

        // them route
        builder
            .addCase(createPostRoute.pending, (state) => {state.loading = true})
            .addCase(createPostRoute.fulfilled, (state, action) => {
                const route = action.payload as Route
                state.routes = [...state.routes, route]
            })
    },
});

export default routesSlice.reducer;
