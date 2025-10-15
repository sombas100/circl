import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Pagination, Comment } from "../../../interfaces/types";
import { tryCatch } from "../../../utils/try-catch";
import { getComments, addNewComment,updateAnComment, deleteAnComment } from "../../../utils/comments";

type CommentsState = {
  byPost: Record<number, Pagination<Comment> | null>;
  loading: boolean;
  error: string | null;
};

const initialState: CommentsState = {
  byPost: {},
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk<
  { postId: number, pageData: Pagination<Comment> },
  { postId: number, page?: number },
  { rejectValue: string }
>("comments/fetch", async ({ postId, page = 1 }, { rejectWithValue }) => {
    const [data, error] = await tryCatch(getComments(postId, page))

    if (error || !data) return rejectWithValue('Failed to fetch comments');

    return { postId, pageData: data };
});

export const addComment = createAsyncThunk<
  Comment,
  { postId: number; content: string },
  { rejectValue: string }
>("comments/add", async ({ postId, content }, { rejectWithValue }) => {
  const [data, error] = await tryCatch(addNewComment(postId, content))

  if (error) return rejectWithValue('Failed to create comment');
  return data;
});

export const updateComment = createAsyncThunk<
  Comment,
  { commentId: number; content: string },
  { rejectValue: string }
>("comments/update", async ({ commentId, content }, { rejectWithValue }) => {
  const [data, error] = await tryCatch(updateAnComment(commentId, content))

  if (error || !data) return rejectWithValue('Failed to update comment');

  return data;
});

export const deleteComment = createAsyncThunk<
  { commentId: number; postId: number },
  { commentId: number; postId: number },
  { rejectValue: string }
>("comments/delete", async ({ commentId, postId }, { rejectWithValue }) => {
  await tryCatch(deleteAnComment(commentId, postId))
    if (!commentId || !postId) return rejectWithValue('Failed to delete comment');
    return { commentId, postId}
});

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments(state, action) { delete state.byPost[action.payload as number]; },
  },
  extraReducers: (b) => {
    // fetch
    b.addCase(fetchComments.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchComments.fulfilled, (s, a) => {
      s.loading = false;
      s.byPost[a.payload.postId] = a.payload.pageData;
    });
    b.addCase(fetchComments.rejected, (s, a) => {
      s.loading = false; s.error = a.payload || a.error.message || "Failed to load comments";
    });

    // add
    b.addCase(addComment.fulfilled, (s, a) => {
      const postId = a.payload.post_id;
      const page = s.byPost[postId];
      if (page) page.data = [a.payload, ...page.data];
      else s.byPost[postId] = { data: [a.payload], current_page: 1, last_page: 1 };
    });

    // update
    b.addCase(updateComment.fulfilled, (s, a) => {
      const postId = a.payload.post_id;
      const page = s.byPost[postId];
      if (!page) return;
      page.data = page.data.map(c => (c.id === a.payload.id ? a.payload : c));
    });

    // delete
    b.addCase(deleteComment.fulfilled, (s, a) => {
      const page = s.byPost[a.payload.postId];
      if (!page) return;
      page.data = page.data.filter(c => c.id !== a.payload.commentId);
    });
  },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
