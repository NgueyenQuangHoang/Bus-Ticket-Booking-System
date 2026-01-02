import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { cityService } from '../services/cityService';
import type { City } from '../types/index';

interface CityState {
  cities: City[];
  loading: boolean;
  error: string | null;
}

const initialState: CityState = {
  cities: [],
  loading: false,
  error: null,
};

export const fetchCities = createAsyncThunk(
  'city/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cityService.getAllCities();
      return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch cities');
    }
  }
);


export const deleteCity = createAsyncThunk('city/removeItem', async (id: string) => {
  await cityService.deleteCity(id)
  return id
})

export const addNewCity = createAsyncThunk('city/create', async (city: City) => {
  await cityService.createCity(city)
  return city
})

export const updateCity = createAsyncThunk('city/update', async (city: City) => {
  await cityService.updateCity(city)
  return city
})


const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // add data
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action: PayloadAction<City[]>) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      // remove
      builder
        .addCase(deleteCity.fulfilled, (state, action) => {
          const id = action.payload
          state.cities = state.cities.filter(item => item.id != id)
        })

        // add
      builder
        .addCase(addNewCity.fulfilled, (state, action) => {
          const city = action.payload
          state.cities = [...state.cities, city]
        })
        
        // update
      builder
        .addCase(updateCity.fulfilled, (state, action) => {
          const cityUpdate = action.payload
          console.log(cityUpdate);
          
          state.cities = state.cities.map(item => item.id === cityUpdate.id ? cityUpdate : item)
        })
  },
});

export default citySlice.reducer;
