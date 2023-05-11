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
    'CREDITCARD',
    'CREDITREPORT',
    'DOCUMENT',
    'DOCUMENT-LIABILITY',
    'DOCUMENT-PREVIEW',
    'EMAIL',
    'EMPLOYEE',
    'ENROLLMENT',
    'ENROLLMENT-PAYMENT',
    'GROUP',
    'LIABILITY',
    'NOTE',
    'TASK',
    'SETTING',
    'SETTING-ADDRESS',
    'SETTING-ASSIGNEE',
    'SETTING-CONTACT',
    'SETTING-CUSTOMFIELD',
    'SETTING-LABEL',
    'SETTING'
  ],

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: builder => ({})
})
