import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../../api/axios";
import type { User } from "../../../interfaces/types";
import type { PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
    user: User | null;
    token: string | null;
    error?: string | null;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
}

export const register = createAsyncThunk<
  { user: User; token: string },
  { name: string; email: string; password: string; avatar_url?: string },
  { rejectValue: string }
>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/register', payload);
      return data as { user: User; token: string };
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/login', payload);
      return data as { user: User; token: string };
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Login failed';
      return rejectWithValue(message);
    }
  }
);


export const me = createAsyncThunk(
    'auth/me',
    async () => {
        const { data } = await api.get('/me');
        return data as User;
    }
)

export const logout = createAsyncThunk(
    'auth/logout', async () => {
        const res = await api.post('/logout');
        if (!res) {
            return false;
        }
        return true
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(register.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.error = null;
            state.token = action.payload.token;
            state.loading = false;
            localStorage.setItem('token', state.token!);
        })
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message as string;
        })
        builder.addCase(login.fulfilled, (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.error = null
            state.loading = false
            localStorage.setItem('token', state.token!)
        })
        builder.addCase(login.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message as string
        })
        builder.addCase(me.fulfilled, (state, action: PayloadAction<User>) => {
            state.user = action.payload
        })
        builder.addCase(me.pending, (state) => {
            state.error = null;
            state.loading = true
        })
        builder.addCase(me.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message as string
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token')
        })
        builder.addCase(logout.pending, (state) => {
            state.error = null;
            state.loading = true
        })
        builder.addCase(logout.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message as string
        })
    }
})

export default authSlice.reducer