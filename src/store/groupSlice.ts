import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { GroupType } from './api/groupApiSlice'

const groupAdapter = createEntityAdapter({
  selectId: (group: GroupType) => group.groupId
})

const initialState = groupAdapter.getInitialState()

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setGroups: (state, action) => {
      groupAdapter.setAll(state, action.payload)
    },
    updateGroups: (state, action) => {
      groupAdapter.upsertMany(state, action.payload)
    },
    addGroup: (state, action) => {
      groupAdapter.addOne(state, action.payload)
    },
    updateGroup: (state, action) => {
      groupAdapter.upsertOne(state, action.payload)
    },
    deleteGroup: (state, action) => {
      groupAdapter.removeOne(state, action.payload)
    }
  }
})

export const { setGroups, addGroup, updateGroup, updateGroups, deleteGroup } = groupSlice.actions

export default groupSlice.reducer

export const {
  selectAll: selectAllGroups,
  selectById: selectGroupById,
  selectIds: selectGroupIds
} = groupAdapter.getSelectors((state: RootState) => state.group)

export const selectAllGroupSelectOptions = createSelector(selectAllGroups, groups => {
  return groups.map(g => ({ label: g.name, value: g.groupId }))
})
