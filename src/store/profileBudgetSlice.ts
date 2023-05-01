import { createEntityAdapter, createSelector, createSlice, EntityState } from '@reduxjs/toolkit'

import { Budget, ProfileBudget } from './api/profileBudgetApiSlice'
import { RootState } from './store'

const profileBudgetAdapter = createEntityAdapter({
  selectId: (budget: ProfileBudget) => budget.budgetId
})

const budgetAdapter = createEntityAdapter({
  selectId: (budget: Budget) => budget.budgetId
})

const initialState = {
  budget: budgetAdapter.getInitialState(),
  profileBudget: profileBudgetAdapter.getInitialState()
}

const profileBudgetSlice = createSlice({
  name: 'profileBudget',
  initialState,
  reducers: {
    setProfileBudget: (state, action) => {
      const { profile, budget } = action.payload

      profileBudgetAdapter.setAll(state.profileBudget, profile)
      budgetAdapter.setAll(state.budget, budget)
    },
    setBudget: (state, action) => {
      budgetAdapter.setAll(state.budget, action.payload)
    }

    // profileBudget reducers
  }
})

export const { setBudget, setProfileBudget } = profileBudgetSlice.actions

export default profileBudgetSlice.reducer

export const {
  selectAll: selectAllBudgets,
  selectById: selectBudgetById,
  selectIds: selectBudgetIds
} = budgetAdapter.getSelectors((state: RootState) => state.profileBudget.budget)

export const {
  selectAll: selectAllProfileBudgets,
  selectById: selectProfileBudgetById,
  selectIds: selectProfileBudgetIds
} = profileBudgetAdapter.getSelectors((state: RootState) => state.profileBudget.profileBudget)

export const selectProfileBudgetsByProfileId = createSelector(
  selectAllProfileBudgets,
  (_: RootState, profileId: string) => profileId,
  (profileBudgets, profileId) => {
    return profileBudgets.filter(profileBudget => profileBudget.profileId === profileId)
  }
)
