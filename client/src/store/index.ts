import { configureStore } from '@reduxjs/toolkit';
import bannerReducer from '../slices/bannerSlice';
import busCompanyReducer from '../slices/busCompanySlice';
import routesReducer from '../slices/routesSlice';
import popularRouteReducer from '../slices/popularRouteSlice';

import stationReducer from '../slices/stationSlice';

export const store = configureStore({
  reducer: {
    banner: bannerReducer,
    busCompany: busCompanyReducer,
    routes: routesReducer,
    popularRoutes: popularRouteReducer,
    station: stationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
