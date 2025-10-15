import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../../api/axios";
import type { User } from "../../../interfaces/types";

type PendingItem = {
  id: number;
  requester_id: number;
  addressee_id: number;
  status: "pending" | "accepted" | "declined";
  requester: User;
};

type FriendsState = {
  friends: User[];
  pending: PendingItem[];
  searchResults: (User & { requested?: boolean })[];
  loading: boolean;
  error: string | null;
};

const initialState: FriendsState = {
  friends: [],
  pending: [],
  searchResults: [],
  loading: false,
  error: null,
};

export const fetchFriends = createAsyncThunk<User[], void, { rejectValue: string }>(
  "friends/fetchFriends",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<User[]>("/friends");
      return data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load friends");
    }
  }
);

export const fetchPending = createAsyncThunk<PendingItem[], void, { rejectValue: string }>(
  "friends/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/friend-requests");
      return (data?.data ?? data) as PendingItem[];
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load requests");
    }
  }
);

export const sendRequest = createAsyncThunk<any, number, { rejectValue: string }>(
  "friends/sendRequest",
  async (addresseeId, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/friend-requests", { addressee_id: addresseeId });
      return { addresseeId, data };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to send request");
    }
  }
);

export const respondRequest = createAsyncThunk<
  { id: number; status: "accepted" | "declined" },
  { id: number; action: "accept" | "decline" },
  { rejectValue: string }
>("friends/respondRequest", async ({ id, action }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/friend-requests/${id}/respond`, { action });
    return { id, status: data.status as "accepted" | "declined" };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to respond");
  }
});

export const searchUsers = createAsyncThunk<User[], string, { rejectValue: string }>(
  "friends/searchUsers",
  async (q, { rejectWithValue }) => {
    const term = q.trim();
    if (!term) return []; // avoid hitting backend on empty
    try {
      const { data } = await api.get(`/users/search?q=${encodeURIComponent(term)}`);
      return (data?.data ?? data) as User[];
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Search failed");
    }
  }
);

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    clearSearch(state) { state.searchResults = []; },
  },
  extraReducers: (builder) => {
    // pending
    builder.addCase(fetchFriends.pending,  (s) => { s.loading = true; s.error = null; });
    builder.addCase(fetchPending.pending,  (s) => { s.loading = true; s.error = null; });
    builder.addCase(searchUsers.pending,   (s) => { s.loading = true; s.error = null; });
    builder.addCase(sendRequest.pending,   (s) => { s.error = null; });
    builder.addCase(respondRequest.pending,(s) => { s.error = null; });

    // fulfilled
    builder.addCase(fetchFriends.fulfilled, (s, a) => { s.loading = false; s.friends = a.payload; });
    builder.addCase(fetchPending.fulfilled, (s, a) => { s.loading = false; s.pending = a.payload; });
    builder.addCase(searchUsers.fulfilled,  (s, a) => { s.loading = false; s.searchResults = a.payload; });

    // Optional UX: mark the searched user as "requested" after sending a request
    builder.addCase(sendRequest.fulfilled, (s, a) => {
      const id = a.payload.addresseeId as number;
      s.searchResults = s.searchResults.map(u => (u.id === id ? { ...u, requested: true } : u));
    });

    // remove from pending after respond
    builder.addCase(respondRequest.fulfilled, (s, a) => {
      s.pending = s.pending.filter(pr => pr.id !== a.payload.id);
    });

    // rejected (prefer server message via rejectWithValue)
    builder.addCase(fetchFriends.rejected, (s, a) => {
      s.loading = false; s.error = (a.payload as string) || a.error.message || "Failed to load friends";
    });
    builder.addCase(fetchPending.rejected, (s, a) => {
      s.loading = false; s.error = (a.payload as string) || a.error.message || "Failed to load requests";
    });
    builder.addCase(searchUsers.rejected, (s, a) => {
      s.loading = false; s.error = (a.payload as string) || a.error.message || "Search failed";
    });
    builder.addCase(sendRequest.rejected, (s, a) => {
      s.error = (a.payload as string) || a.error.message || "Failed to send request";
    });
    builder.addCase(respondRequest.rejected, (s, a) => {
      s.error = (a.payload as string) || a.error.message || "Failed to respond";
    });
  },
});

export const { clearSearch } = friendsSlice.actions;
export default friendsSlice.reducer;
