import { configureStore } from '@reduxjs/toolkit';
import artistLikeReducer from './slices/artistLikeSlice';

export const store = configureStore({
  reducer: {
    artistLikes: artistLikeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;