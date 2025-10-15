import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Pagination, Post } from "../../../interfaces/types";
import { tryCatch } from "../../../utils/try-catch";
import { getPosts, createPost, deletePost } from "../../../utils/posts";
import { api } from "../../../api/axios";

type PostState = {
    feed: Pagination<Post> | null;
    loading: boolean;
    error?: string | null;
}

const initialState: PostState = {
    feed: null,
    loading: false,
    error: null,
}

export const fetchPosts = createAsyncThunk<
  Pagination<Post>,               
  number | undefined,                  
  { rejectValue: string }         
>("posts/fetchPosts", async (page = 1, { rejectWithValue }) => {
  const [data, error] = await tryCatch(getPosts(page));
  if (error) return rejectWithValue("Failed to fetch posts");
  return data;
});

export const createNewPost = createAsyncThunk<Post, string, { rejectValue: string }>(
    'posts/createNewPost',
    async (content, { rejectWithValue }) => {
        const [data, error] = await tryCatch(createPost(content))
        if (error) return rejectWithValue('Failed to create post')

        return data;
    }
)

export const toggleLike = createAsyncThunk<
  { postId: number; liked: boolean },
  number,
  { rejectValue: string }
>("posts/toggleLike", async (postId, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/posts/${postId}/like-toggle`);
    return { postId, liked: !!data?.liked };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to toggle like");
  }
});

export const deletePosts = createAsyncThunk<number, number, { rejectValue: string }>(
    'posts/deletePosts',
    async (id: number, { rejectWithValue }) => {
        const [deletedId, error] = await tryCatch(deletePost(id))

        if (error || deletedId == null) return rejectWithValue('Failed to delete post')
        
        return deletedId;
    }
)

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Pagination<Post>>) => {
            state.loading = false;
            state.error = null;
            state.feed = action.payload;
        })
        builder.addCase(fetchPosts.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(fetchPosts.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        }) 

        builder.addCase(createNewPost.fulfilled, (state, action) => {
            if (!state.feed) return;
            state.feed.data = [{
                ...action.payload,
                comments_count: 0,
                likes_count: 0,
                liked_by_me: false
            }, ...state.feed.data];
        })
        builder.addCase(createNewPost.pending, (state) => {
            state.error = null;
        })
        builder.addCase(createNewPost.rejected, (state, action) => {
            state.error = action.payload as string
        })

        builder.addCase(toggleLike.fulfilled, (s, a) => {
            if (!s.feed) return;
        s.feed.data = s.feed.data.map(p => {
            if (p.id !== a.payload.postId) return p;
            const liked = a.payload.liked;
            const delta = liked ? 1 : -1;
            return { ...p, liked_by_me: liked, likes_count: (p.likes_count || 0) + delta };
      });
    });

        builder.addCase(deletePosts.fulfilled, (state, action) => {
            if (!state.feed) return;
            state.feed.data = state.feed.data.filter(p => p.id !== action.payload)
        })
        builder.addCase(deletePosts.pending, (state) => {
        state.error = null;
        })
        builder.addCase(deletePosts.rejected, (state, action) => {
        state.error = (action.payload as string) || action.error.message || "Failed to delete post";
        });
        }
    }
)

export default postSlice.reducer;