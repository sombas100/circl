import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../../api/axios";
import type { User } from "../../../interfaces/types";

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

export const register = createAsyncThunk(
    'auth/register',
    async (payload: {name: string, email: string, password: string, avatar_url?: string }) => {
        const { data } = await api.post('/register', payload)
        return data as { user: User, token: string }
    }
)

export const login = createAsyncThunk(
    'auth/login',
    async (payload: {email: string, password: string}) => {
        const { data } = await api.post('/login', payload)
        return data as { user: User, token: string }
    }
)

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
    }
})

export default authSlice.reducer