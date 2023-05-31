import { setBankAccounts } from '../bankAccountSlice'
import { apiSlice } from './apiSlice'
import { ErrorResponseType, LunaResponseType } from './sharedTypes'

export type BankAccountType = {
  bankAccountId: string
  bankRoutingNumber: string
  bankName: string
  bankAccountNumber: string
  phoneNumber: string | null
  bankAccountType: number
  bankAccountTypeName: string
  address: string | null
  address2: string | null
  city: string | null
  zipcode: string | null
  state: string | null
  accountName: string | null
  createdAt: string | null
  profileId: string | null
  firstName: string | null
  lastName: string | null
  accountType?: 'ach'
}

export type BankAccountCreateType = {
  bankRoutingNumber: string
  bankName: string
  bankAccountNumber: string
  phoneNumber?: string
  bankAccountType: number
  address?: string
  address2?: string
  city?: string
  zipcode?: string
  state?: string
  accountName?: string
  profileId: string
}

export type BankAccountUpdateType = {
  bankAccountId: string
  bankRoutingNumber: string
  bankName: string
  bankAccountNumber: string
  phoneNumber?: string
  bankAccountType: BankAccountType
  address?: string
  address2?: string
  city?: string
  zipcode?: string
  state?: string
  accountName?: string
}

export const bankAccountApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ******************************************* GET bankaccount/bankaccount/profileId/profile
    getBankAccounts: builder.query<BankAccountType[] | null, string>({
      query: profileId => ({
        url: `/bankaccount/${profileId}/profile`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching bank account information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null
        const data = res.data.map((account: BankAccountType) => {
          return { ...account, accountType: 'ach' }
        })

        return data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setBankAccounts(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getBankAccounts:', error.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'BANKACCOUNT', id: arg },
              ...result.map(bankaccount => ({ type: 'BANKACCOUNT' as const, id: bankaccount.bankAccountId }))
            ]
          : []
      }
    }),

    // ************************************************ POST bankaccount/profileId/profile
    postBankAccountCreate: builder.mutation<boolean, BankAccountCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/bankaccount/${profileId}/profile`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating bank account',
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
          console.error('API error in postBankAccountCreate:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'BANKACCOUNT', id: arg.profileId }] : [])
    }),

    // ******************************************************* PUT bankaccount/bankaccountId
    putBankAccountUpdate: builder.mutation<boolean, BankAccountUpdateType>({
      query: params => {
        const { bankAccountId, ...body } = params

        return {
          url: `/bankaccount/${bankAccountId}`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating bank account',
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
          console.error('API error in putBankAccountUpdate:', error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'BANKACCOUNT', id: arg.bankAccountId }] : [])
    }),

    // ************************************************ DELETE bankaccount/bankaccountId/
    deleteBankAccount: builder.mutation<boolean, string>({
      query: bankAccountId => {
        return {
          url: `/bankaccount/${bankAccountId}`,
          method: 'DELETE'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error deleting bank account',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(bankAccountId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in deleteBankAccount:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'BANKACCOUNT', id: arg }] : [])
    })
  })
})
