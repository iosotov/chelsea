import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'

import auth from './authSlice'
import profile, { profileStatusSlice } from './profileSlice'
import profileBudget from './profileBudgetSlice'
import bankAccount from './bankAccountSlice'
import campaign from './campaignSlice'
import company from './companySlice'
import document from './documentSlice'
import enrollment from './enrollmentSlice'
import liability from './liabilitySlice'
import payment from './paymentSlice'
import task from './taskSlice'
import setting from './settingSlice'
import creditCard from './creditCardSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    profileStatus: profileStatusSlice.reducer,
    auth,
    profile,
    profileBudget,
    bankAccount,
    campaign,
    company,
    document,
    enrollment,
    liability,
    payment,
    task,
    setting,
    creditCard
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
