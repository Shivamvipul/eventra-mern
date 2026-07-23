import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '../../services/bookingService';

export const fetchBookings = createAsyncThunk('bookings/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await bookingService.getAll(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load bookings');
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default bookingSlice.reducer;
