import { configureStore } from '@reduxjs/toolkit';
import bannerReducer from '../slices/bannerSlice';
import busCompanyReducer from '../slices/busCompanySlice';
import routesReducer from '../slices/routesSlice';
import popularRouteReducer from '../slices/popularRouteSlice';
import stationReducer from '../slices/stationSlice';
import cityReducer from '../slices/citySlice';
import tripSearchReducer from '../slices/tripSearchSlice';
import userReducer from '../slices/userSlice';

export const store = configureStore({
  reducer: {
    banner: bannerReducer,
    busCompany: busCompanyReducer,
    routes: routesReducer,
    popularRoutes: popularRouteReducer,
    station: stationReducer,
    city: cityReducer,
    tripSearch: tripSearchReducer,
    user: userReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
