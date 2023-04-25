import { createSlice } from '@reduxjs/toolkit'

import {
  CompanySettingCreditReportType,
  CompanySettingEsignType,
  CompanySettingStorageType
} from './api/companySettingApiSlice'

const DefaultCreditReport: CompanySettingCreditReportType = {
  companyId: '',
  token: '',
  userName: '',
  password: '',
  endpoint: '',
  loginAPIName: '',
  requestAPIName: ''
}

const DefaultEsign: CompanySettingEsignType = {
  companyId: '',
  apiKey: '',
  callbackToken: '',
  smsTemplate: '',
  emailTemplate: '',
  allowMethods: '',
  signingUrl: ''
}

const DefaultStorage: CompanySettingStorageType = {
  companyId: '',
  name: '',
  configuration: {
    key: '',
    secret: '',
    bucketName: '',
    region: ''
  }
}

const initialState = {
  creditReport: DefaultCreditReport,
  esign: DefaultEsign,
  storage: DefaultStorage
}

const companySettingSlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCreditReport: (state, action) => {
      state.creditReport = action.payload
    },
    setEsign: (state, action) => {
      state.esign = action.payload
    },
    setStorage: (state, action) => {
      state.storage = action.payload
    }
  }
})

export const { setCreditReport, setEsign, setStorage } = companySettingSlice.actions

export default companySettingSlice.reducer
