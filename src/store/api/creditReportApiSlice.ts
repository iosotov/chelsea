import { setCreditReports } from '../creditReportSlice'
import { apiSlice } from './apiSlice'
import { CreditReportInfoModel } from './defaultValues'
import { LunaResponseType } from './sharedTypes'

export type CreditScoreType = {
  scoreValue: string
  scoreName: string
  evaluation: CreditScoreEvaluation
  creditScoreCodes: CreditScoreCodeType[]
}

export type CreditScoreCodeType = {
  scoreFactorCode: string
  scoreFactorText: string
}

export type CreditReportRequestType = {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  ssn: string
  birthDate: string
  testMode: boolean
  servicer: string
  profileId?: string
}

export enum CreditScoreEvaluation {
  poor,
  fair,
  good,
  exellent
}

export type CreditReportInfoType = {
  profileId: string
  creditScores: CreditScoreType[]
  referenceFile: string
  fileType: string
}

export const creditReportApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCreditReports: builder.query<CreditReportInfoType, string>({
      query: profileId => ({
        url: `/creditreport/${profileId}/profile`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error fetching credit report for this profile')
        const result: CreditReportInfoType = res.data
          ? { ...res.data, profileId: arg }
          : { ...CreditReportInfoModel, profileId: arg }

        return result
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(setCreditReports([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return [{ type: 'CREDITREPORT', id: arg }]
      }
    }),
    postProfileCreditReport: builder.mutation<string, string>({
      query: profileId => {
        return {
          url: `/creditreport/${profileId}/profile/request`,
          method: 'POST',
          params: { testMode: false }
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error posting credit report to profile')
        console.log(res.data)

        return arg
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
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'CREDITREPORT', id: arg }] : [])
    }),
    postCreditReport: builder.mutation<string, CreditReportRequestType>({
      query: body => {
        return {
          url: `/creditreport/request`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error posting credit report information')
        console.log(res.data)

        return arg.firstName
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
      invalidatesTags: (res, error, arg) => (arg.profileId ? [{ type: 'CREDITREPORT', id: arg.profileId }] : [])
    })
  })
})
