import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { HistoryType } from './api/historyApiSlice'

const historyAdapter = createEntityAdapter({
  selectId: (history: HistoryType) => history.id
})

const initialState = historyAdapter.getInitialState()

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHistories: (state, action) => {
      historyAdapter.setAll(state, action.payload)
    },
    updateHistories: (state, action) => {
      historyAdapter.upsertMany(state, action.payload)
    },
    addHistory: (state, action) => {
      historyAdapter.addOne(state, action.payload)
    },
    updateHistory: (state, action) => {
      historyAdapter.upsertOne(state, action.payload)
    },
    deleteHistory: (state, action) => {
      historyAdapter.removeOne(state, action.payload)
    }
  }
})

export const { setHistories, addHistory, updateHistory, updateHistories, deleteHistory } = historySlice.actions

export default historySlice.reducer

export const {
  selectAll: selectAllHistories,
  selectById: selectHistoryById,
  selectIds: selectHistoryIds
} = historyAdapter.getSelectors((state: RootState) => state.history)

export const selectHistoriesByProfileId = createSelector(
  selectAllHistories,
  (_: RootState, profileId: string) => profileId,
  (histories, profileId) => {
    return histories.filter(history => history.profileId === profileId)
  }
)
