import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { BudgetType, ProfileBudget } from './api/profileBudgetApiSlice'
import { RootState } from './store'

const profileBudgetAdapter = createEntityAdapter({
  selectId: (budget: ProfileBudget) => budget.budgetId
})

const budgetAdapter = createEntityAdapter({
  selectId: (budget: BudgetType) => budget.budgetId
})

const initialState = {
  budget: budgetAdapter.getInitialState(),
  profileBudget: profileBudgetAdapter.getInitialState()
}

const profileBudgetSlice = createSlice({
  name: 'profileBudget',
  initialState,
  reducers: {
    updateProfileBudget: (state, action) => {
      const { profile, budget } = action.payload

      profileBudgetAdapter.upsertMany(state.profileBudget, profile)
      budgetAdapter.upsertMany(state.budget, budget)
    },
    setProfileBudget: (state, action) => {
      const { profile, budget } = action.payload

      profileBudgetAdapter.setAll(state.profileBudget, profile)
      budgetAdapter.setAll(state.budget, budget)
    },
    updateBudget: (state, action) => {
      budgetAdapter.upsertMany(state.budget, action.payload)
    },
    setBudget: (state, action) => {
      budgetAdapter.setAll(state.budget, action.payload)
    },
    removeBudget: (state, action) => {
      budgetAdapter.removeOne(state.budget, action.payload)
      profileBudgetAdapter.removeOne(state.profileBudget, action.payload)
    }
  }
})

export const { setBudget, setProfileBudget, updateBudget, updateProfileBudget, removeBudget } =
  profileBudgetSlice.actions

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

export const selectIncomeBudgetsByProfileId = createSelector(
  selectAllProfileBudgets,
  (_: RootState, profileId: string) => profileId,
  (profileBudgets, profileId) => {
    return profileBudgets.filter(
      profileBudget => profileBudget.profileId === profileId && profileBudget.budgetType === 0
    )
  }
)

export const selectExpenseBudgetsByProfileId = createSelector(
  selectAllProfileBudgets,
  (_: RootState, profileId: string) => profileId,
  (profileBudgets, profileId) => {
    return profileBudgets.filter(
      profileBudget => profileBudget.profileId === profileId && profileBudget.budgetType === 1
    )
  }
)

export const selectIncomeTotalByProfileId = createSelector(selectIncomeBudgetsByProfileId, profileBudgets => {
  return profileBudgets.reduce((totalAmount, profileBudget) => {
    return totalAmount + profileBudget.amount
  }, 0)
})

export const selectExpenseTotalByProfileId = createSelector(selectExpenseBudgetsByProfileId, profileBudgets => {
  return profileBudgets.reduce((totalAmount, profileBudget) => {
    return totalAmount + profileBudget.amount
  }, 0)
})
