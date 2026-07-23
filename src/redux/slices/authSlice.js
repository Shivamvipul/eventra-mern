import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authService.login(payload);
    localStorage.setItem('accessToken', data.data.accessToken);
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authService.register(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authService.getMe();
    return data.data;
  } catch (err) {
    localStorage.removeItem('accessToken');
    return rejectWithValue(err.response?.data?.message || 'Session expired');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
  localStorage.removeItem('accessToken');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    initialized: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.initialized = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
