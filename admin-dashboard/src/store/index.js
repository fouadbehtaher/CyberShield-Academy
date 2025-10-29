import { configureStore } from '@reduxjs/toolkit';

export const createAdminStore = (reducers = {}) =>
  configureStore({
    reducer: {
      ...reducers,
    },
  });

export default createAdminStore;
