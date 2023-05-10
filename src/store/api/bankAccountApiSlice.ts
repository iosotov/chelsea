import { setBankAccounts } from '../bankAccountSlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType } from './sharedTypes'

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
    getBankAccounts: builder.query<BankAccountType[], string>({
      query: profileId => ({
        url: `/bankaccount/${profileId}/profile`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching bank accounts')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(setBankAccounts(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return [
          { type: 'BANKACCOUNT', id: arg },
          ...((result &&
            result.map(bankaccount => ({ type: 'BANKACCOUNT' as const, id: bankaccount.bankAccountId }))) ||
            [])
        ]
      }
    }),
    postBankAccountCreate: builder.mutation<string, BankAccountCreateType>({
      query: params => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { profileId, ...body } = params

        console.log(body)

        return {
          url: `/bankaccount/${profileId}/profile`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating bank account')
        console.log(res.data)

        return res.data
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
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'BANKACCOUNT', id: arg.profileId }] : [])
    }),
    putBankAccountUpdate: builder.mutation<string, BankAccountUpdateType>({
      query: params => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { bankAccountId, ...body } = params
        console.log(body)

        return {
          url: `/bankaccount/${bankAccountId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error updating bank account information')

        console.log(arg.bankAccountId)

        return arg.bankAccountId
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
      invalidatesTags: res => (res ? [{ type: 'BANKACCOUNT', id: res }] : [])
    }),
    deleteBankAccount: builder.mutation<string, string>({
      query: bankAccountId => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          url: `/bankaccount/${bankAccountId}`,
          method: 'DELETE'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error updating bank account information')

        return arg
      },
      async onQueryStarted(bankAccountId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'BANKACCOUNT', id: res }] : [])
    })
  })
})
