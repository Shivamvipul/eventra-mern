import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notificationService';

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await notificationService.getAll();
    return { list: data.data, unreadCount: data.meta.unreadCount };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load notifications');
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { list: [], unreadCount: 0 },
  reducers: {
    addRealtimeNotification: (state, action) => {
      state.list.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.list = action.payload.list;
      state.unreadCount = action.payload.unreadCount;
    });
  },
});

export const { addRealtimeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
