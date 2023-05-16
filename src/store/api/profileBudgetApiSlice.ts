import { removeBudget, setBudget, updateBudget, updateProfileBudget } from '../profileBudgetSlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType } from './sharedTypes'
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
  budget: BudgetSettingType[] | []
}

export type ProfileBudgeUpdateType = {
  profileId: string
  budgets: ProfileBudget[]
}

export type BudgetCreateType = {
  name: string
  description?: string
  budgetType: number
}

export type BudgetUpdateType = {
  budgetId: string
  name: string
  description?: string
  budgetType?: number
}

export type BudgetSettingType = {
  budgetId: string
  name: string
  budgetType: BudgetEnum
  description: string
  active: boolean
}

export const profileBudgetApiSlice = apiSlice.injectEndpoints({
  // ****************************************************************** GET profile/profileId/budget
  endpoints: builder => ({
    getProfileBudgets: builder.query<ProfileBudgetObj | null, string>({
      query: profileId => ({
        url: `/profile/${profileId}/budget`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile budgets',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType, meta, arg) => {
        if (!res.success) return null

        const result = await SolApi.GetBudgets()
        const budget: BudgetSettingType[] = result.data
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
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateProfileBudget(data))
        } catch (err: any) {
          console.error('API error in getProfileBudgets:', err.error.data.message)
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

    // ****************************************************************** PUT profile/profileId/budget
    putProfileBudgetsUpdate: builder.mutation<boolean, ProfileBudgeUpdateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/profile/${profileId}/budget`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating profile budget',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putProfileBudgetsUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'PROFILE-BUDGET', id: arg.profileId }] : [])
    }),

    // ****************************************************************** GET setting/budgets
    getBudgets: builder.query<BudgetSettingType[] | null, undefined>({
      query: () => ({
        url: `/setting/budgets`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching budgets',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setBudget(data))
        } catch (err: any) {
          console.error('API error in getBudgets:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result
          ? [
              { type: 'BUDGET', id: 'LIST' },
              ...result.map((budget: BudgetSettingType) => ({ type: 'BUDGET' as const, id: budget.budgetId }))
            ]
          : []
      }
    }),

    // ****************************************************************** POST setting/budgets
    postBudgetCreate: builder.mutation<boolean, BudgetCreateType>({
      query: body => ({
        url: `/setting/budgets`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching enrollment enrollment',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postBudgetCreate:', err.error.data.message)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'BUDGET', id: 'LIST' }] : [])
    }),

    // ****************************************************************** GET setting/budgets/budgetId/info
    getBudgetInfo: builder.query<BudgetSettingType | null, string>({
      query: budgetId => ({
        url: `/setting/budgets/${budgetId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching budget information ',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(budgetId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateBudget([data]))
        } catch (err: any) {
          console.error('API error in getBudgetInfo:', err.error.data.message)
        }
      },
      providesTags: (res, error, arg) => (res ? [{ type: 'BUDGET', id: arg }] : [])
    }),

    // ****************************************************************** PUT setting/budgets/budgetId
    putBudgetUpdate: builder.mutation<boolean, BudgetUpdateType>({
      query: params => {
        const { budgetId, ...body } = params

        return {
          url: `/setting/budgets/${budgetId}`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating budget',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putBudgetUpdate:', err.error.data.message)
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

    // ****************************************************************** PUT setting/budgets/budgetId/disable
    putBudgetDisable: builder.mutation<boolean, string>({
      query: budgetId => {
        return {
          url: `/setting/budgets/${budgetId}/disable`,
          method: 'PUT'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error disabling budget',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(budgetId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(removeBudget(budgetId))
        } catch (err: any) {
          console.error('API error in putBudgetDisable:', err.error.data.message)
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

    // ****************************************************************** PUT setting/budgets/budgetId/enable
    putBudgetEnable: builder.mutation<boolean, string>({
      query: budgetId => {
        return {
          url: `/setting/budgets/${budgetId}/enable`,
          method: 'PUT'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching enrollment enrollment',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(budgetId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putBudgetEnable:', err.error.data.message)
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
