import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { BankAccountType } from './api/bankAccountApiSlice'
import { selectAllCreditCards } from './creditCardSlice'

import { RootState } from './store'
import { CreditCardTypeEnum } from './api/creditCardApiSlice'

const bankAccountAdapter = createEntityAdapter({
  selectId: (bankAccount: BankAccountType) => bankAccount.bankAccountId
})

const initialState = bankAccountAdapter.getInitialState()

const bankAccountSlice = createSlice({
  name: 'bankAccount',
  initialState,
  reducers: {
    setBankAccounts: (state, action) => {
      bankAccountAdapter.setAll(state, action.payload)
    },
    addBankAccount: (state, action) => {
      bankAccountAdapter.addOne(state, action.payload)
    },
    updateBankAccount: (state, action) => {
      bankAccountAdapter.upsertOne(state, action.payload)
    },
    deleteBankAccount: (state, action) => {
      bankAccountAdapter.removeOne(state, action.payload)
    }
  }
})

export const { setBankAccounts, addBankAccount, updateBankAccount, deleteBankAccount } = bankAccountSlice.actions

export default bankAccountSlice.reducer

export const {
  selectAll: selectAllBankAccounts,
  selectById: selectBankAccountById,
  selectIds: selectBankAccountIds
} = bankAccountAdapter.getSelectors((state: RootState) => state.bankAccount)

export const selectBankAccountsByProfileId = createSelector(
  selectAllBankAccounts,
  (_: RootState, profileId: string) => profileId,
  (bankaccounts, profileId) => {
    return bankaccounts.filter(bank => bank.profileId === profileId)
  }
)

export type BankingOrCreditCardType = {
  bankAccountId?: string
  bankRoutingNumber?: string
  bankName?: string
  bankAccountNumber?: string
  phoneNumber?: string | null
  bankAccountType?: number
  bankAccountTypeName?: string
  accountName?: string | null
  createdAt?: string | null
  creditCardId?: string
  name?: string
  type?: CreditCardTypeEnum
  creditCardTypeName?: string
  cardNumber?: string
  expirationMonth?: string
  expirationYear?: string
  securityCode?: string
  address?: string
  address2?: string
  city?: string
  state?: string
  zipcode?: string
  profileId?: string
  firstName?: string
  lastName?: string
  expYear?: string
  paymentType?: 'card'
}

export const selectPaymentsByProfileId = createSelector(
  selectAllBankAccounts,
  selectAllCreditCards,
  (_: RootState, profileId: string) => profileId,
  (bankaccounts, creditcards, profileId) => {
    return [
      ...bankaccounts.filter(b => b.profileId === profileId),
      ...creditcards.filter(c => c.profileId === profileId)
    ]
  }
)
