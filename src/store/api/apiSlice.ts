import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from 'src/store/store'

export const baseUrl = 'http://localhost:3001/api'

const baseQuery = fetchBaseQuery({
  baseUrl,

  // credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  }
})

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    'PROFILE',
    'PROFILE-STATUS',
    'PROFILE-BUDGET',
    'PROFILE-LABEL',
    'BUDGET',
    'BANKACCOUNT',
    'CAMPAIGN',
    'COMPANY',
    'COMPANY-SETTING-CREDITREPORT',
    'COMPANY-SETTING-ESIGN',
    'COMPANY-SETTING-STORAGE',
    'DOCUMENT',
    'DOCUMENT-LIABILITY',
    'DOCUMENT-PREVIEW'
  ],

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: builder => ({})
})
