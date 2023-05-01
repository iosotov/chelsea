import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { CompanyType } from './api/companyApiSlice'

const companyAdapter = createEntityAdapter({
  selectId: (company: CompanyType) => company.companyId
})

const initialState = companyAdapter.getInitialState()

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanies: (state, action) => {
      companyAdapter.setAll(state, action.payload)
    },
    updateCompanies: (state, action) => {
      companyAdapter.upsertMany(state, action.payload)
    },
    addCompany: (state, action) => {
      companyAdapter.addOne(state, action.payload)
    },
    updateCompany: (state, action) => {
      companyAdapter.upsertOne(state, action.payload)
    },
  }
})

export const { setCompanies, updateCompanies, addCompany, updateCompany } = companySlice.actions

export default companySlice.reducer

export const {
  selectAll: selectAllCompanies,
  selectById: selectCompanyById,
  selectIds: selectCompanyIds
} = companyAdapter.getSelectors((state: RootState) => state.company)
