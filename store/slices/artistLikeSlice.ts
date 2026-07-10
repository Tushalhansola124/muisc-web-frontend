import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ArtistLikeState {
  likedArtists: Record<string, boolean>;   // artistId -> isLiked
  likeCounts: Record<string, number>;      // artistId -> count
}

const initialState: ArtistLikeState = {
  likedArtists: {},
  likeCounts: {},
};

const artistLikeSlice = createSlice({
  name: 'artistLikes',
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<{ artistId: string; count: number }>) => {
      const { artistId, count } = action.payload;
      state.likedArtists[artistId] = !state.likedArtists[artistId];
      state.likeCounts[artistId] = count;
    },

    setLikeStatus: (state, action: PayloadAction<{ artistId: string; liked: boolean; count: number }>) => {
      const { artistId, liked, count } = action.payload;
      state.likedArtists[artistId] = liked;
      state.likeCounts[artistId] = count;
    },
  },
});

export const { toggleLike, setLikeStatus } = artistLikeSlice.actions;
export default artistLikeSlice.reducer;