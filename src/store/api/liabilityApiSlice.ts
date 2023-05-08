import { updateLiabilities } from '../liabilitySlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType, SearchFilterType } from './sharedTypes'

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

export type LiabilityEnrollType = {
  profileId: string
  ids: string[]
}

export const liabilityApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getLiability: builder.query<LiabilityType, string>({
      query: liabilityId => ({
        url: `/liability/${liabilityId}/basic`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching liability')

        return res.data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(updateLiabilities([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'LIABILITY', id: arg }] : []
      }
    }),
    getProfileLiabilities: builder.query<LiabilityType[], string>({
      query: profileId => ({
        url: `/liability/${profileId}/profile/`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching liabilities')

        return res.data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(updateLiabilities(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (res, error, arg) => (res ? [{ type: 'LIABILITY', id: arg }] : [])
    }),
    postCreateLiability: builder.mutation<string, LiabilityCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/liability/${profileId}/profile`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating liability')

        return res.data
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'LIABILITY', id: arg.profileId }] : [])
    }),
    postSearchLiabilities: builder.query<LiabilityType[], SearchFilterType>({
      query: body => {
        return {
          url: `/liability/search`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error searching liability')

        return res.data.data
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
      providesTags: res => (res ? res.map(liability => ({ type: 'LIABILITY', id: liability.liabilityId })) : [])
    }),
    putUpdateLiability: builder.mutation<boolean, LiabilityUpdateType>({
      query: params => {
        const { liabilityId, ...body } = params

        return {
          url: `/liability/${liabilityId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error updating liability')
        console.log(res.data)

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
              { type: 'LIABILITY', id: arg.profileId },
              { type: 'LIABILITY', id: arg.liabilityId }
            ]
          : []
    }),
    putWithdrawLiabilities: builder.mutation<boolean, LiabilityEnrollType>({
      query: params => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { profileId, ...body } = params

        return {
          url: `/liability/withdraw`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error withdrawing liability')

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
          ? [{ type: 'LIABILITY', id: arg.profileId }, ...arg.ids.map(id => ({ type: 'LIABILITY' as const, id }))]
          : []
    }),
    putEnrollLiabilities: builder.mutation<boolean, LiabilityEnrollType>({
      query: params => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { profileId, ...body } = params

        return {
          url: `/liability/enroll`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error enrolling liability')

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
          ? [{ type: 'LIABILITY', id: arg.profileId }, ...arg.ids.map(id => ({ type: 'LIABILITY' as const, id }))]
          : []
    })
  })
})
