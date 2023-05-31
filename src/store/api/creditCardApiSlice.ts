import { setCreditCards } from '../creditCardSlice'
import { apiSlice } from './apiSlice'
import { ErrorResponseType, LunaResponseType } from './sharedTypes'

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
  accountType?: 'card'
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
  // ***************************************************** GET creditcard/profileId/profile
  endpoints: builder => ({
    getCreditCards: builder.query<CreditCardType[] | null, string>({
      query: profileId => ({
        url: `/creditcard/${profileId}/profile`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile credit cards',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null
        const data = res.data.map((card: CreditCardType) => {
          return { ...card, accountType: 'card' }
        })

        return data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setCreditCards(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getCreditCards:', error.message)
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

    // ***************************************************** POST creditcard/profileId/profile
    postCreditCardCreate: builder.mutation<boolean, CreditCardCreateType>({
      query: body => {
        return {
          url: `/creditcard/${body.profileId}/profile`,
          method: 'POST',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error adding credit card to profile',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postCreditCardCreate:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'CREDITCARD', id: arg.profileId }] : [])
    }),

    // ***************************************************** PUT creditcard/creditcardId
    putCreditCardUpdate: builder.mutation<boolean, CreditCardUpdateType>({
      query: params => {
        const { creditCardId, ...body } = params

        return {
          url: `/creditcard/${creditCardId}`,
          method: 'PUT',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating credit card',
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
          console.error('API error in putCreditCardUpdate:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'CREDITCARD', id: arg.creditCardId }] : [])
    }),

    // ***************************************************** DELETE creditcard/creditcardId
    deleteCreditCard: builder.mutation<boolean, string>({
      query: creditCardId => {
        return {
          url: `/creditcard/${creditCardId}`,
          method: 'DELETE'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error deleting credit card',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(creditCardId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in deleteCreditCard:', error.message)
        }
      },
      invalidatesTags: (res, meta, arg) => (res ? [{ type: 'CREDITCARD', id: arg }] : [])
    })
  })
})
