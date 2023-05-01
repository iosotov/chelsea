import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { PaymentDetailInfoModel } from './api/enrollmentApiSlice'

const paymentAdapter = createEntityAdapter({
  selectId: (payment: PaymentDetailInfoModel) => payment.profileId
})

const initialState = paymentAdapter.getInitialState()

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPayments: (state, action) => {
      console.log(action.payload)
      paymentAdapter.setAll(state, action.payload)
    },
    updatePayments: (state, action) => {
      paymentAdapter.upsertMany(state, action.payload)
    }
  }
})

export const { setPayments, updatePayments } = paymentSlice.actions

export default paymentSlice.reducer

export const {
  selectAll: selectAllPayments,
  selectById: selectPaymentById,
  selectIds: selectPaymentIds
} = paymentAdapter.getSelectors((state: RootState) => state.payment)

export const selectPaymentByProfileId = createSelector(
  selectAllPayments,
  (_: RootState, profileId: string) => profileId,
  (enrollments, profileId) => {
    return enrollments.filter(enrollment => enrollment.profileId === profileId)
  }
)
