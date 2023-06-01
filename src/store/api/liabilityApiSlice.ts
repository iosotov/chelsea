import { updateLiabilities } from '../liabilitySlice'
import { apiSlice } from './apiSlice'
import { ErrorResponseType, LunaResponseType, SearchFilterType } from './sharedTypes'

export type LiabilityType = {
  liabilityId: string
  name: string
  originalBalance: number
  type: string
  accountNumber: string
  currentPayment: number
  accountStatus: string
  openedDate: string
  term: number
  highestBalance: number
  lastPayment: string
  inquiryDate: string
  reportDate: string
  thirtyDaysLateCount: string
  sixtyDaysLateCount: string
  nintyDaysLateCount: string
  enrolled: true
  profileId: string
  profileFirstName: string
  profileLastName: string
  currentBalance: number
  currentCreditor: string
  currentAccountNumber: string
  thirdPartyAccountNumber: string
  currentPaymentAmount: number
  legalStatus: true
  summon: true
  judgement: true
  garnishment: true
  address1: string
  address2: string
  city: string
  zipCode: string
  state: string
  caseNumber: string
  courtName: string
  courtDate: string
  responseDate: string
}

export type LiabilityCreateType = {
  name: string
  originalBalance?: number
  type: string
  accountNumber: string
  currentPayment?: number
  accountStatus?: string
  openedDate?: string
  term?: number
  highestBalance?: number
  lastPayment?: string
  inquiryDate?: string
  reportDate?: string
  thirtyDaysLateCount?: string
  sixtyDaysLateCount?: string
  nintyDaysLateCount?: string
  enrolled?: boolean
  profileId: string
  currentCreditor?: string
  currentAccountNumber?: string
  thirdPartyAccountNumber?: string
  currentPaymentAmount?: number
  legalStatus?: boolean
  summon?: boolean
  judgement?: boolean
  garnishment?: boolean
  address1?: string
  address2?: string
  city?: string
  zipCode?: string
  state?: string
  caseNumber?: string
  courtName?: string
}

export type LiabilityUpdateType = {
  liabilityId: string
  name: string
  originalBalance?: number
  type: string
  currentPayment?: number
  currentBalance?: number
  accountStatus?: string
  openedDate?: string
  term?: number
  highestBalance?: number
  lastPayment?: Date
  inquiryDate?: Date
  reportDate?: Date
  thirtyDaysLateCount?: string
  sixtyDaysLateCount?: string
  nintyDaysLateCount?: string
  enrolled?: boolean
  profileId: string
  currentCreditor?: string
  currentAccountNumber?: string
  thirdPartyAccountNumber?: string
  currentPaymentAmount?: number
  legalStatus?: boolean
  summon?: boolean
  judgement?: boolean
  garnishment?: boolean
  address1?: string
  address2?: string
  city?: string
  zipCode?: string
  state?: string
  caseNumber?: string
  courtName?: string
  courtDate?: Date
  responseDate?: Date
}

export type LiabilityEnrollType = {
  profileId: string
  ids: string[]
}

export const liabilityApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ***************************************************** GET liability/liabilityId/basic
    getLiability: builder.query<LiabilityType | null, string>({
      query: liabilityId => ({
        url: `/liability/${liabilityId}/basic`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching liability',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateLiabilities([data]))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getLiability:', error.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'LIABILITY', id: arg }] : []
      }
    }),

    // ***************************************************** GET liability/profileId/profile
    getProfileLiabilities: builder.query<LiabilityType[] | null, string>({
      query: profileId => ({
        url: `/liability/${profileId}/profile`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile liabilities',
          data: baseQueryReturnValue.data
        }
      },

      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateLiabilities(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getEnrollment:', error.message)
        }
      },
      providesTags: (res, error, arg) => (res ? [{ type: 'LIABILITY', id: arg }] : [])
    }),

    // ***************************************************** POST liability/profileId/profile
    postLiabilityCreate: builder.mutation<boolean, LiabilityCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/liability/${profileId}/profile`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating liability',
          data: baseQueryReturnValue.data
        }
      },

      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in  postLiabilityCreate:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'LIABILITY', id: arg.profileId }] : [])
    }),

    // ***************************************************** POST liability/search
    postLiabilitiesSearch: builder.query<LiabilityType[] | null, SearchFilterType>({
      query: body => {
        return {
          url: `/liability/search`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching liabilities',
          data: baseQueryReturnValue.data
        }
      },

      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data.data
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) updateLiabilities(data)
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postLiabilitiesSearch:', error.message)
        }
      },
      providesTags: res => (res ? res.map(liability => ({ type: 'LIABILITY', id: liability.liabilityId })) : [])
    }),

    // ***************************************************** PUT liability/liabilityId
    putLiabilityUpdate: builder.mutation<boolean, LiabilityUpdateType>({
      query: params => {
        const { liabilityId, ...body } = params

        return {
          url: `/liability/${liabilityId}`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating liability',
          data: baseQueryReturnValue.data
        }
      },

      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in putLiabilityUpdate:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'LIABILITY', id: arg.profileId },
              { type: 'LIABILITY', id: arg.liabilityId }
            ]
          : []
    }),

    // ***************************************************** PUT liability/withdraw
    putLiabilitiesWithdraw: builder.mutation<boolean, LiabilityEnrollType>({
      query: params => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { profileId, ...body } = params

        return {
          url: `/liability/withdraw`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error withdrawing liabilities',
          data: baseQueryReturnValue.data
        }
      },

      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in putLiabilitiesWithdraw:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [{ type: 'LIABILITY', id: arg.profileId }, ...arg.ids.map(id => ({ type: 'LIABILITY' as const, id }))]
          : []
    }),

    // ***************************************************** PUT liability/enroll
    putLiabilitiesEnroll: builder.mutation<boolean, LiabilityEnrollType>({
      query: params => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { profileId, ...body } = params

        return {
          url: `/liability/enroll`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching enrolling liabilities',
          data: baseQueryReturnValue.data
        }
      },

      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in putLiabilitiesEnroll:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [{ type: 'LIABILITY', id: arg.profileId }, ...arg.ids.map(id => ({ type: 'LIABILITY' as const, id }))]
          : []
    })
  })
})
