import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { BankAccountType } from './api/bankAccountApiSlice'

import { RootState } from './store'

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
