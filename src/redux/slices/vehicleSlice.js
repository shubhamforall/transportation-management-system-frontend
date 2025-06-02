import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance"; 

export const addVehicle = createAsyncThunk(
  "vehicles/addVehicle",
  async (vehicleData, { rejectWithValue }) => {
    try {
      const response = await API.post("/vehicle");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchVehicles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/vehicle");
      return response.data.data.list; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicles: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearVehicleState: (state) => {
      state.vehicles = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Vehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Vehicle
      .addCase(addVehicle.pending, (state) => {
        state.loading = true;
      })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles.push(action.payload); // Optimistically add to list
      })
      .addCase(addVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVehicleState } = vehicleSlice.actions;
export default vehicleSlice.reducer;
