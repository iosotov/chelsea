import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { EnrollmentSearchResultModel } from './api/enrollmentApiSlice'

const enrollmentAdapter = createEntityAdapter({
  selectId: (enrollment: EnrollmentSearchResultModel) => enrollment.profileId
})

const transactionAdapter = createEntityAdapter({
  selectId: (enrollment: EnrollmentSearchResultModel) => enrollment.enrollmentDetailId
})

const initialState = {
  enrollment: enrollmentAdapter.getInitialState(),
  transaction: transactionAdapter.getInitialState()
}

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    setEnrollments: (state, action) => {
      enrollmentAdapter.setAll(state.enrollment, action.payload)
    },
    updateEnrollments: (state, action) => {
      enrollmentAdapter.upsertMany(state.enrollment, action.payload)
    },
    setTransactions: (state, action) => {
      transactionAdapter.setAll(state.transaction, action.payload)
    },
    updateTransactions: (state, action) => {
      transactionAdapter.upsertMany(state.transaction, action.payload)
    }
  }
})

export const { setEnrollments, updateEnrollments, setTransactions, updateTransactions } = enrollmentSlice.actions

export default enrollmentSlice.reducer

export const {
  selectAll: selectAllEnrollments,
  selectById: selectEnrollmentByProfileId,
  selectIds: selectEnrollmentIds
} = enrollmentAdapter.getSelectors((state: RootState) => state.enrollment.enrollment)

export const {
  selectAll: selectAllTransactions,
  selectById: selectTransactionByProfileId,
  selectIds: selectTransactionIds
} = transactionAdapter.getSelectors((state: RootState) => state.enrollment.transaction)

export const selectEnrollmentByEnrollment = createSelector(
  selectAllEnrollments,
  (_: RootState, enrollmentId: string) => enrollmentId,
  (enrollments, enrollmentId) => {
    return enrollments.filter(enrollment => enrollment.enrollmentId === enrollmentId)
  }
)

export const selectTransactionsByTypeStatus = createSelector(
  selectAllTransactions,
  (_: RootState, paymentStatus: number) => paymentStatus,
  (transactions, paymentStatus) => {
    if (paymentStatus < 0) return transactions

    return transactions.filter(t => t.paymentStatus === paymentStatus)
  }
)
