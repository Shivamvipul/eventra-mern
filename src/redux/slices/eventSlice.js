import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventService } from '../../services/eventService';

export const fetchEvents = createAsyncThunk('events/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await eventService.getEvents(params);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load events');
  }
});

export const fetchFeatured = createAsyncThunk('events/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await eventService.getFeatured();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load featured events');
  }
});

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    list: [],
    meta: { page: 1, limit: 12, total: 0, pages: 0 },
    featured: [],
    upcoming: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.featured = action.payload.featured;
        state.upcoming = action.payload.upcoming;
      });
  },
});

export default eventSlice.reducer;
