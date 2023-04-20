import { addBankAccount, deleteBankAccount, setBankAccounts, updateBankAccount } from '../bankAccountSlice'
import { apiSlice } from './apiSlice'

const DefaultBankAccount: BankAccountType = {
  bankAccountId: '',
  bankRoutingNumber: '',
  bankName: '',
  bankAccountNumber: '',
  phoneNumber: null,
  bankAccountType: 0,
  bankAccountTypeName: 'Checking Account',
  address: null,
  address2: null,
  city: null,
  zipcode: null,
  state: null,
  accountName: null,
  createdAt: null,
  profileId: null,
  firstName: null,
  lastName: null
}

export type UpdateBankAccountType = {
  bankAccountId: string
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
  accountName: string
}

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

export type NewBankAccountType = {
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
  accountName: string
  profileId: string
  firstName: string | null
  lastName: string | null
}

export const bankAccountApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getBankAccounts: builder.query<BankAccountType[], string>({
      query: profileId => ({
        url: `/bankaccount/${profileId}/profile`,
        method: 'GET'
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching bank accounts')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(setBankAccounts(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return [
          { type: 'BANKACCOUNT', id: 'LIST' },
          ...((result &&
            result.map(bankaccount => ({ type: 'BANKACCOUNT' as const, id: bankaccount.bankAccountId }))) ||
            [])
        ]
      }
    }),
    createBankAccount: builder.mutation<string, NewBankAccountType>({
      query: params => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { profileId, firstName, lastName, ...body } = params

        console.log(body)

        return {
          url: `/bankaccount/${profileId}/profile`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error creating bank account')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data: bankAccountId } = await queryFulfilled
          const bankAccountTypeName: string = params.bankAccountType > 0 ? 'Savings Account' : 'Checking Account'
          const newBank: BankAccountType = {
            ...DefaultBankAccount,
            ...params,
            bankAccountId,
            bankAccountTypeName
          }

          dispatch(addBankAccount(newBank))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),
    updateBankAccount: builder.mutation<boolean, UpdateBankAccountType>({
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
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating bank account information')

        return res.success
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          const bankAccountTypeName: string = params.bankAccountType > 0 ? 'Checking Account' : 'Saving Account'
          const updatedBank = { ...params, bankAccountTypeName }
          dispatch(updateBankAccount(updatedBank))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),
    deleteBankAccount: builder.mutation<string, string>({
      query: bankAccountId => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          url: `/bankaccount/${bankAccountId}`,
          method: 'DELETE'
        }
      },
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating bank account information')

        return res.data
      },
      async onQueryStarted(bankAccountId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(deleteBankAccount(bankAccountId))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    })
  })
})

export const {
  useGetBankAccountsQuery,
  useDeleteBankAccountMutation,
  useCreateBankAccountMutation,
  useUpdateBankAccountMutation
} = bankAccountApiSlice
