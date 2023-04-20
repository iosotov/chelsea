import ProfileBudget from 'src/views/pages/user/view/ProfileBudgetView'
import { setBudget, setProfileBudget } from '../profileBudgetSlice'
import { apiSlice } from './apiSlice'
import SolApi from './SolApi'

export type ProfileBudget = {
  budgetId: string
  amount: number
}

export type ProfileBudgetObj = {
  profile: ProfileBudget[] | []
  budget: Budget[] | []
}

export type Budget = {
  budgetId: string
  name: string
  budgetType: string
  description: string
  active: boolean
}

export const profileBudgetApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfileBudgets: builder.query<ProfileBudgetObj, string>({
      query: (id: string) => ({
        url: `/profile/${id}/budget`,
        method: 'GET'
      }),
      transformResponse: async (res: any) => {
        const profile: ProfileBudget[] = res.data
        try {
          const result = await SolApi.GetBudgets()
          const budget: Budget[] = result.data
          const returnResult: ProfileBudgetObj = { budget, profile }

          console.log(returnResult)

          return returnResult
        } catch (e) {
          // SET UP ERROR HANDLING
          console.log(e)
        }

        return { profile, budget: {} } as ProfileBudgetObj
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log('dispatch')
          dispatch(setProfileBudget(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return [
          { type: 'PROFILE-BUDGET', id: 'LIST' },
          ...((result &&
            result.profile.map((profileBudget: ProfileBudget) => ({
              type: 'PROFILE-BUDGET' as const,
              id: profileBudget.budgetId
            }))) ||
            []),
          { type: 'BUDGET', id: 'LIST' },
          ...((result &&
            result.budget.map((budget: Budget) => ({
              type: 'BUDGET' as const,
              id: budget.budgetId
            }))) ||
            [])
        ]
      }
    }),
    getBudgets: builder.query<Budget[], Record<string, any>>({
      query: () => ({
        url: `/setting/budgets`,
        method: 'GET'
      }),
      transformResponse: async (res: any) => {
        const budgets: Budget[] = res.data

        return budgets
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setBudget(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return [
          { type: 'BUDGET', id: 'LIST' },
          ...((result &&
            result.map((budget: Budget) => ({
              type: 'BUDGET' as const,
              id: budget.budgetId
            }))) ||
            [])
        ]
      }
    })
  })
})

export const { useGetProfileBudgetsQuery, useGetBudgetsQuery } = profileBudgetApiSlice
