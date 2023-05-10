import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { EmailType } from './api/emailApiSlice'

const emailAdapter = createEntityAdapter({
  selectId: (email: EmailType) => email.emailId
})

const initialState = emailAdapter.getInitialState()

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setEmails: (state, action) => {
      emailAdapter.setAll(state, action.payload)
    },
    updateEmails: (state, action) => {
      emailAdapter.upsertMany(state, action.payload)
    }
  }
})

export const { setEmails, updateEmails } = emailSlice.actions

export default emailSlice.reducer

export const {
  selectAll: selectAllEmails,
  selectById: selectEmailById,
  selectIds: selectEmailIds
} = emailAdapter.getSelectors((state: RootState) => state.email)

export const selectEmailByProfileId = createSelector(
  selectAllEmails,
  (_: RootState, profileId: string) => profileId,
  (emails, profileId) => {
    return emails.filter(email => email.profileId === profileId)
  }
)
