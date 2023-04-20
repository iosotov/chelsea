import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import auth from './authSlice'
import profile from './profileSlice'
import profileBudget from './profileBudgetSlice'
import bankAccount from './bankAccountSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth,
    profile,
    profileBudget,
    bankAccount
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
