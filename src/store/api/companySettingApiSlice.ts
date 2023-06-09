import { setCreditReport, setEsign, setStorage } from '../companySettingSlice'
import { apiSlice } from './apiSlice'
import { ErrorResponseType } from './sharedTypes'

export type CompanySettingCreditReportType = {
  companyId: string
  token: string
  userName: string
  password: string
  endpoint: string
  loginAPIName: string
  requestAPIName: string
}
export type CompanySettingEsignType = {
  companyId: string
  apiKey: string
  callbackToken: string
  smsTemplate: string
  emailTemplate: string
  allowMethods: string
  signingUrl: string
}

export type CompanySettingStorageType = {
  companyId: string
  name: string
  configuration: {
    key: string
    secret: string
    bucketName: string
    region: string
  }
}

export const companySettingApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // GET COMPANY CREDIT REPAIR
    getCompanySettingCreditReport: builder.query<CompanySettingCreditReportType, string>({
      query: companyId => ({
        url: `/company/${companyId}/setting/creditreport`,
        method: 'GET'
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching company')

        return res.data
      },
      async onQueryStarted(companyId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const creditReportSetting: CompanySettingCreditReportType = { ...data, companyId }

          dispatch(setCreditReport(creditReportSetting))
        } catch (err) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error fetching company setting credit report:', error.message)
        }
      },
      providesTags: result => {
        return result ? [{ type: 'COMPANY-SETTING-CREDITREPORT', id: result.companyId }] : []
      }
    }),

    // POST COMPANY CREDIT REPORT
    postCompanySettingCreditReportCreate: builder.mutation<string, CompanySettingCreditReportType>({
      query: params => {
        const { companyId, ...body } = params

        return {
          url: `/company/${companyId}/setting/creditreport`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error creating company credit report')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data: companyId } = await queryFulfilled
          const newCreditReport: CompanySettingCreditReportType = {
            ...params,
            companyId
          }

          dispatch(setCreditReport(newCreditReport))
        } catch (err) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error creating company credit report:', error.message)
        }
      }
    }),

    // GET COMPANY SETTING ESIGN
    getCompanySettingEsign: builder.query<CompanySettingEsignType, string>({
      query: companyId => ({
        url: `/company/${companyId}/setting/esign`,
        method: 'GET'
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching company')

        return res.data
      },
      async onQueryStarted(companyId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const esign: CompanySettingEsignType = { ...data, companyId }

          dispatch(setEsign(esign))
        } catch (err) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error getting esign settings:', error.message)
        }
      },
      providesTags: result => {
        return result ? [{ type: 'COMPANY-SETTING-ESIGN', id: result.companyId }] : []
      }
    }),

    // POST COMPANY SETTING ESIGN
    postCompanySettingEsignCreate: builder.mutation<string, CompanySettingEsignType>({
      query: params => {
        const { companyId, ...body } = params

        return {
          url: `/company/${companyId}/setting/esign`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error creating esign setting')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data: companyId } = await queryFulfilled
          const newEsign: CompanySettingEsignType = {
            ...params,
            companyId
          }

          dispatch(setEsign(newEsign))
        } catch (err) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error creating esign setting:', error.message)
        }
      }
    }),

    // GET COMPANY SETTING STORAGE
    getCompanySettingStorage: builder.query<CompanySettingStorageType, string>({
      query: companyId => ({
        url: `/company/${companyId}/setting/storage`,
        method: 'GET'
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching company')

        return res.data
      },
      async onQueryStarted(companyId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const storage: CompanySettingStorageType = { ...data, companyId }

          dispatch(setStorage(storage))
        } catch (err) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error getting company storage:', error.message)
        }
      },
      providesTags: result => {
        return result ? [{ type: 'COMPANY-SETTING-STORAGE', id: result.companyId }] : []
      }
    }),

    // POST COMPANY SETTING STORAGE
    postCompanySettingStorageCreate: builder.mutation<string, CompanySettingStorageType>({
      query: params => {
        const { companyId, ...body } = params

        return {
          url: `/company/${companyId}/setting/storage`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error creating company')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data: companyId } = await queryFulfilled
          const newStorage: CompanySettingStorageType = {
            ...params,
            companyId
          }

          dispatch(setStorage(newStorage))
        } catch (err) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error creating storage:', error.message)
        }
      }
    })
  })
})
