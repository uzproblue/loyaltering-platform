import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import userReducer from '@/store/slices/userSlice';
import locationsReducer from '@/store/slices/locationsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      locations: locationsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

