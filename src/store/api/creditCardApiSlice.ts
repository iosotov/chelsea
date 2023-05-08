import { setCreditCards } from '../creditCardSlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType } from './sharedTypes'

export type CreditCardType = {
  creditCardId: string
  name: string
  type: CreditCardTypeEnum
  creditCardTypeName: string
  cardNumber: string
  expirationMonth: string
  expirationYear: string
  securityCode: string
  address: string
  address2: string
  city: string
  state: string
  zipcode: string
  profileId: string
  firstName: string
  lastName: string
  expYear: string
}

export enum CreditCardTypeEnum {
  'Credit Card',
  'Debit Card'
}

export type CreditCardCreateType = {
  profileId: string
  name: string
  type: CreditCardTypeEnum | null
  cardNumber: string
  expirationMonth: string
  expirationYear: string
  securityCode: string
  address: string
  address2?: string
  city: string
  state: string
  zipcode: string
}

export type CreditCardUpdateType = {
  creditCardId: string
  name?: string
  type: CreditCardType | null
  cardNumber: string
  expirationMonth: string
  expirationYear: string
  securityCode: string
  address: string
  address2?: string
  city: string
  state: string
  zipcode: string
}

export const creditCardApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCreditCards: builder.query<CreditCardType[], string>({
      query: profileId => ({
        url: `/creditcard/${profileId}/profile`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching credit cards for this profile')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCreditCards(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return [
          { type: 'CREDITCARD', id: arg },
          ...((result && result.map(creditcard => ({ type: 'CREDITCARD' as const, id: creditcard.creditCardId }))) ||
            [])
        ]
      }
    }),
    createCreditCard: builder.mutation<string, CreditCardCreateType>({
      query: body => {
        return {
          url: `/creditcard/${body.profileId}/profile`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error adding credit card to profile')
        console.log(res.data)

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
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'CREDITCARD', id: arg.profileId }] : [])
    }),
    updateCreditCard: builder.mutation<string, CreditCardUpdateType>({
      query: params => {
        const { creditCardId, ...body } = params
        console.log(body)

        return {
          url: `/creditcard/${creditCardId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error updating credit card information')

        console.log(arg.creditCardId)

        return arg.creditCardId
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
      invalidatesTags: res => (res ? [{ type: 'CREDITCARD', id: res }] : [])
    }),
    deleteCreditCard: builder.mutation<string, string>({
      query: creditCardId => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          url: `/creditcard/${creditCardId}`,
          method: 'DELETE'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error deleting credit card information')

        return arg
      },
      async onQueryStarted(creditCardId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'CREDITCARD', id: res }] : [])
    })
  })
})
