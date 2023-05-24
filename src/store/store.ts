import { configureStore, isRejectedWithValue } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'
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
import creditReport from './creditReportSlice'
import employee from './employeeSlice'
import email from './emailSlice'
import note from './noteSlice'
import group from './groupSlice'
import permission from './permissionSlice'
import role from './roleSlice'
import user from './userSlice'
import { toast } from 'react-hot-toast'

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware = () => next => action => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!

  if (isRejectedWithValue(action)) {
    console.log(action)
    toast.error(`API Error: ${action.payload.message}`)
  }

  return next(action)
}

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
    creditCard,
    creditReport,
    employee,
    email,
    note,
    group,
    permission,
    role,
    user
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([apiSlice.middleware, rtkQueryErrorLogger]),
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
