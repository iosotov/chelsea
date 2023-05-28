import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { ProfileInfoType, ProfileStatusType } from './api/profileApiSlice'
import { RootState } from './store'

export const profileAdapter = createEntityAdapter<ProfileInfoType>({
  selectId: profile => profile.profileId
})

const initialState = profileAdapter.getInitialState()

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfiles: (state, action) => {
      profileAdapter.upsertMany(state, action.payload)
    },
    addProfile: (state, action) => {
      profileAdapter.addOne(state, action.payload)
    },
    deleteProfile: (state, action) => {
      profileAdapter.removeOne(state, action.payload)
    }
  }
})

export const profileStatusAdapter = createEntityAdapter<ProfileStatusType>({
  selectId: profile => profile.profileId
})

const initialStatusState = profileStatusAdapter.getInitialState()

export const profileStatusSlice = createSlice({
  name: 'profileStatus',
  initialState: initialStatusState,
  reducers: {
    updateStatus: (state, action) => {
      profileStatusAdapter.upsertMany(state, action.payload)
    }
  }
})

export const { updateProfiles, addProfile, deleteProfile } = profileSlice.actions

export const { updateStatus } = profileStatusSlice.actions

export const {
  selectAll: selectAllProfiles,
  selectById: selectProfileById,
  selectIds: selectProfileIds
} = profileAdapter.getSelectors((state: RootState) => state.profile)

export const selectProfilesByStatus = createSelector(
  selectAllProfiles,
  (_: RootState, status: number) => status,
  (tasks, status) => {
    return tasks.filter(t => t.status === status)
  }
)

export default profileSlice.reducer
