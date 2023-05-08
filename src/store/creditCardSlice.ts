import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { CreditCardType } from './api/creditCardApiSlice'

const creditCardAdapter = createEntityAdapter({
  selectId: (creditCard: CreditCardType) => creditCard.creditCardId
})

const initialState = creditCardAdapter.getInitialState()

const creditCardSlice = createSlice({
  name: 'creditCard',
  initialState,
  reducers: {
    setCreditCards: (state, action) => {
      creditCardAdapter.setAll(state, action.payload)
    },
    updateCreditCards: (state, action) => {
      creditCardAdapter.upsertMany(state, action.payload)
    },
    addCreditCard: (state, action) => {
      creditCardAdapter.addOne(state, action.payload)
    },
    updateCreditCard: (state, action) => {
      creditCardAdapter.upsertOne(state, action.payload)
    },
    deleteCreditCard: (state, action) => {
      creditCardAdapter.removeOne(state, action.payload)
    }
  }
})

export const { setCreditCards, addCreditCard, updateCreditCard, updateCreditCards, deleteCreditCard } =
  creditCardSlice.actions

export default creditCardSlice.reducer

export const {
  selectAll: selectAllCreditCards,
  selectById: selectCreditCardById,
  selectIds: selectCreditCardIds
} = creditCardAdapter.getSelectors((state: RootState) => state.creditCard)

export const selectCreditCardsByProfileId = createSelector(
  selectAllCreditCards,
  (_: RootState, profileId: string) => profileId,
  (creditCards, profileId) => {
    return creditCards.filter(cc => cc.profileId === profileId)
  }
)
