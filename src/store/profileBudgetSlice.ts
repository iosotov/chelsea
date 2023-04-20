import { createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit'

import { Budget, ProfileBudget } from './api/profileBudgetApiSlice'
import { RootState } from './store'

const profileBudgetAdapter = createEntityAdapter({
  selectId: (budget: ProfileBudget) => budget.budgetId
})

const budgetAdapter = createEntityAdapter({
  selectId: (budget: Budget) => budget.budgetId
})

const profileBudgetInit = profileBudgetAdapter.getInitialState()
const budgetInit = budgetAdapter.getInitialState()

interface ProfileBudgetState {
  budget: EntityState<Budget>
  profileBudget: EntityState<ProfileBudget>
}

const initialState: ProfileBudgetState = {
  budget: budgetInit,
  profileBudget: profileBudgetInit
}

const profileBudgetSlice = createSlice({
  name: 'profileBudget',
  initialState,
  reducers: {
    setProfileBudget: (state, action) => {
      const { profile, budget } = action.payload

      const profileBudgets = budget.map((budget: Budget) => {
        const profileBudget = profile.filter(
          (profileBudget: ProfileBudget) => profileBudget.budgetId === budget.budgetId
        )

        return profileBudget.length
          ? {
              budgetId: budget.budgetId,
              amount: profileBudget[0].amount
            }
          : {
              budgetId: budget.budgetId,
              amount: 0
            }
      })
      profileBudgetAdapter.setAll(state.profileBudget, profileBudgets)
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
