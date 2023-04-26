import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from 'src/store/store'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  }
})

export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: [
    'PROFILE',
    'PROFILE-BUDGET',
    'BUDGET',
    'BANKACCOUNT',
    'CAMPAIGN',
    'COMPANY',
    'COMPANY-SETTING-CREDITREPORT',
    'COMPANY-SETTING-ESIGN',
    'COMPANY-SETTING-STORAGE'
  ],

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: builder => ({})
})
