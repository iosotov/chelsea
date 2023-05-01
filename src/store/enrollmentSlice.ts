import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { EnrollmentSearchResultModel } from './api/enrollmentApiSlice'

const enrollmentAdapter = createEntityAdapter({
  selectId: (enrollment: EnrollmentSearchResultModel) => enrollment.profileId
})

const initialState = enrollmentAdapter.getInitialState()

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    setEnrollments: (state, action) => {
      console.log(action.payload)
      enrollmentAdapter.setAll(state, action.payload)
    },
    updateEnrollments: (state, action) => {
      enrollmentAdapter.upsertMany(state, action.payload)
    }
  }
})

export const { setEnrollments, updateEnrollments } = enrollmentSlice.actions

export default enrollmentSlice.reducer

export const {
  selectAll: selectAllEnrollments,
  selectById: selectEnrollmentByProfileId,
  selectIds: selectEnrollmentIds
} = enrollmentAdapter.getSelectors((state: RootState) => state.enrollment)

export const selectEnrollmentByEnrollment = createSelector(
  selectAllEnrollments,
  (_: RootState, enrollmentId: string) => enrollmentId,
  (enrollments, enrollmentId) => {
    return enrollments.filter(enrollment => enrollment.enrollmentId === enrollmentId)
  }
)
