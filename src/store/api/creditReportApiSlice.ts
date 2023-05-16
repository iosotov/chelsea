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
    // ***************************************************** GET creditreport/profileId/profile
    getCreditReports: builder.query<CreditReportInfoType | null, string>({
      query: profileId => ({
        url: `/creditreport/${profileId}/profile`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile credit report',
          data: baseQueryReturnValue.data
        }
      },
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

          if (data) dispatch(setCreditReports([data]))
        } catch (err: any) {
          console.error('API error in getCreditReports:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'CREDITREPORT', id: arg }] : []
      }
    }),

    // ***************************************************** POST creditreport/profileId/profile/request
    postProfileCreditReport: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/creditreport/${profileId}/profile/request`,
          method: 'POST',
          params: { testMode: false }
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error posting profile credit report',
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
          console.error('API error in postProfileCreditReport:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'CREDITREPORT', id: arg }] : [])
    }),

    // ***************************************************** POST creditreport/request
    postCreditReport: builder.mutation<boolean, CreditReportRequestType>({
      query: body => {
        return {
          url: `/creditreport/request`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error posting credit report',
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
          console.error('API error in postCreditReport:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (arg.profileId ? [{ type: 'CREDITREPORT', id: arg.profileId }] : [])
    })
  })
})
