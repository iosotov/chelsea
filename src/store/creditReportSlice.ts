import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { CreditReportInfoType } from './api/creditReportApiSlice'

const creditReportAdapter = createEntityAdapter({
  selectId: (creditReport: CreditReportInfoType) => creditReport.profileId
})

const initialState = creditReportAdapter.getInitialState()

const creditReportSlice = createSlice({
  name: 'creditReport',
  initialState,
  reducers: {
    setCreditReports: (state, action) => {
      creditReportAdapter.setAll(state, action.payload)
    }
  }
})

export const { setCreditReports } = creditReportSlice.actions

export default creditReportSlice.reducer

export const {
  selectAll: selectAllCreditReports,
  selectById: selectCreditReportByProfileId,
  selectIds: selectCreditReportIds
} = creditReportAdapter.getSelectors((state: RootState) => state.creditReport)
