import { configureStore, createSlice } from '@reduxjs/toolkit';


const appSlice = createSlice({
  name: 'app',
  initialState: {
    loaded: false,
  },
  reducers: {
    setLoaded: (state, action) => {
      state.loaded = action.payload;
    },
  },
});

export const { setLoaded } = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
