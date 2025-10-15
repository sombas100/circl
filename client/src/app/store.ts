import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import postReducer from './features/posts/postSlice'
import commentReducer from './features/comments/commentSlice';
import friendshipReducer from './features/friendship/friendsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
        comment: commentReducer,
        friend: friendshipReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch