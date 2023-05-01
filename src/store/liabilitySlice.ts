import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { LiabilityType } from './api/liabilityApiSlice'

const liabilityAdapter = createEntityAdapter({
  selectId: (liability: LiabilityType) => liability.liabilityId
})

const initialState = liabilityAdapter.getInitialState()

const liabilitySlice = createSlice({
  name: 'liability',
  initialState,
  reducers: {
    setLiabilities: (state, action) => {
      console.log(action.payload)
      liabilityAdapter.setAll(state, action.payload)
    },
    updateLiabilities: (state, action) => {
      console.log(action.payload)
      liabilityAdapter.upsertMany(state, action.payload)
    }
  }
})

export const { setLiabilities, updateLiabilities } = liabilitySlice.actions

export default liabilitySlice.reducer

export const {
  selectAll: selectAllLiabilities,
  selectById: selectLiabilityById,
  selectIds: selectLiabilityIds
} = liabilityAdapter.getSelectors((state: RootState) => state.liability)

export const selectLiabilityByProfileId = createSelector(
  selectAllLiabilities,
  (_: RootState, profileId: string) => profileId,
  (liabilities, profileId) => {
    return liabilities.filter(liability => liability.profileId === profileId)
  }
)
