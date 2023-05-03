import { removeBudget, setBudget, updateBudget, updateProfileBudget } from '../profileBudgetSlice'
import { apiSlice } from './apiSlice'
import SolApi from './SolApi'

export type ProfileBudget = {
  profileId?: string
  budgetId: string
  amount: number
  name: string
  budgetType: BudgetEnum
  description: string
}

export enum BudgetEnum {
  'Income',
  'Expense'
}

export type ProfileBudgetObj = {
  profile: ProfileBudget[] | []
  budget: BudgetType[] | []
}

export type ProfileBudgeUpdateType = {
  profileId: string
  budgets: ProfileBudget[]
}

export type BudgetCreateType = {
  budgetId?: string
  name: string
  description: string
  budgetType: number
}

export type BudgetType = {
  budgetId: string
  name: string
  budgetType: BudgetEnum
  description: string
  active: boolean
}

export const profileBudgetApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfileBudgets: builder.query<ProfileBudgetObj, string>({
      query: profileId => ({
        url: `/profile/${profileId}/budget`,
        method: 'GET'
      }),
      transformResponse: async (res: any, meta, arg) => {
        if (!res.success) throw new Error('There was an error fetching profile budgets')

        const result = await SolApi.GetBudgets()
        const budget: BudgetType[] = result.data
        const profile: ProfileBudget[] = budget.map(budget => {
          const profileBudget = res.data.find((pb: ProfileBudget) => pb.budgetId === budget.budgetId)
          let resp = {
            profileId: arg,
            budgetId: budget.budgetId,
            name: budget.name,
            budgetType: budget.budgetType,
            description: budget.description,
            amount: 0
          }
          if (profileBudget) resp = { ...resp, amount: profileBudget.amount }

          return resp
        })

        const returnResult: ProfileBudgetObj = { budget, profile }

        console.log(returnResult)

        return returnResult
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log('dispatch')
          dispatch(updateProfileBudget(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'PROFILE-BUDGET', id: arg },
              { type: 'BUDGET', id: 'LIST' }
            ]
          : []
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

    getBudgets: builder.query<BudgetType[], undefined>({
      query: () => ({
        url: `/setting/budgets`,
        method: 'GET'
      }),
      transformResponse: async (res: any) => {
        if (!res.success) throw new Error('There was an error fetching budgets')

        return res.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
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
            result.map((budget: BudgetType) => ({
              type: 'BUDGET' as const,
              id: budget.budgetId
            }))) ||
            [])
        ]
      }
    }),

    postBudgets: builder.mutation<boolean, Record<string, any>>({
      query: body => ({
        url: `/setting/budgets`,
        method: 'POST',
        body
      }),
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error creating profile budgets')

        return res.data
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'BUDGET', id: 'LIST' }] : [])
    }),

    getBudgetInfo: builder.query<BudgetType, string>({
      query: budgetId => ({
        url: `/setting/budgets/${budgetId}/info`,
        method: 'GET'
      }),
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching budget info')

        return res.data
      },
      async onQueryStarted(budgetId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(updateBudget([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (res, error, arg) => (res ? [{ type: 'BUDGET', id: arg }] : [])
    }),

    putUpdateBudget: builder.mutation<boolean, BudgetCreateType>({
      query: params => {
        const { budgetId, ...body } = params

        return {
          url: `/setting/budgets/${budgetId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating budget')

        return res.success
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
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'BUDGET', id: arg.budgetId },
              { type: 'BUDGET', id: 'LIST' }
            ]
          : []
    }),

    putDisableBudget: builder.mutation<string, string>({
      query: budgetId => {
        return {
          url: `/setting/budgets/${budgetId}/disable`,
          method: 'PUT'
        }
      },
      transformResponse: async (res: Record<string, any>, meta, arg) => {
        if (!res.success) throw new Error('There was an error disabling budget')

        return arg
      },
      async onQueryStarted(budgetId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(removeBudget(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'BUDGET', id: arg },
              { type: 'BUDGET', id: 'LIST' }
            ]
          : []
    }),

    putEnableBudget: builder.mutation<string, string>({
      query: budgetId => {
        return {
          url: `/setting/budgets/${budgetId}/enable`,
          method: 'PUT'
        }
      },
      transformResponse: async (res: Record<string, any>, meta, arg) => {
        if (!res.success) throw new Error('There was an error disabling budget')

        return arg
      },
      async onQueryStarted(budgetId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'BUDGET', id: arg },
              { type: 'BUDGET', id: 'LIST' }
            ]
          : []
    })
  })
})
