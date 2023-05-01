import { setBudget, setProfileBudget } from '../profileBudgetSlice'
import { apiSlice } from './apiSlice'
import SolApi from './SolApi'

export type ProfileBudget = {
  profileId?: string
  budgetId: string
  amount: number
}

export type ProfileBudgetObj = {
  profile: ProfileBudget[] | []
  budget: Budget[] | []
}

export type ProfileBudgeUpdateType = {
  profileId: string
  budgets: ProfileBudget[]
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
      transformResponse: async (res: any, meta, arg) => {
        if (!res.success) throw new Error('There was an error fetching profile budgets')

        const result = await SolApi.GetBudgets()
        const budget: Budget[] = result.data
        const profile: ProfileBudget[] = budget.map(budget => {
          const profileBudget = res.data.find((pb: ProfileBudget) => pb.budgetId === budget.budgetId)
          let resp = { profileId: arg, budgetId: budget.budgetId, amount: 0 }
          if (profileBudget) resp = { ...resp, amount: profileBudget.amount }

          return resp
        })

        const returnResult: ProfileBudgetObj = { budget, profile }

        console.log(returnResult)

        return returnResult
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
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'PROFILE-BUDGET', id: arg }] : []
      }
    }),
    postProfileBudgets: builder.mutation<string, ProfileBudgeUpdateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/profile/${profileId}/budget`,
          method: 'PUT',
          body
        }
      },
      transformResponse: async (res: Record<string, any>, meta, arg) => {
        if (!res.success) throw new Error('There was an error fetching profile budgets')

        return arg.profileId
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'PROFILE-BUDGET', id: res }] : [])
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
