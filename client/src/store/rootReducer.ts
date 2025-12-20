import { combineReducers } from '@reduxjs/toolkit';
import bannerReducer from '../slices/bannerSlice';
import busCompanyReducer from '../slices/busCompanySlice';
import routesReducer from '../slices/routesSlice';

const rootReducer = combineReducers({
  banner: bannerReducer,
  busCompany: busCompanyReducer,
  routes: routesReducer,
});

export default rootReducer;
