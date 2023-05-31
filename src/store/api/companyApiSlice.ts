import { setCompanies, updateCompanies } from '../companySlice'
import { apiSlice } from './apiSlice'
import { ErrorResponseType, LunaResponseType, SearchFilterType } from './sharedTypes'

export type CompanyCreateType = {
  name: string
  phone: string
  email?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zipcode?: string
  parentCompanyId?: string | null
  sharedPercentage?: number | null
}

export type CompanyUpdateType = {
  companyId: string
  name: string
  phone: string
  email?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zipcode?: string
  parentCompanyId?: string | null
  sharedPercentage?: number | null
}

export type CompanyType = {
  companyId: string
  name: string
  phone: string
  email: string | null
  address1: string | null
  address2: string | null
  city: string | null
  state: string | null
  zipcode: string | null
  parentCompanyId: string | null
  parentCompanyName: string | null
}

export const companyApiSlice = apiSlice.injectEndpoints({
  // ***************************************************** GET company/companyId/info
  endpoints: builder => ({
    getCompany: builder.query<CompanyType | null, string>({
      query: companyId => ({
        url: `/company/${companyId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching company',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(companyId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          if (data) dispatch(updateCompanies([data]))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getCompany:', error.message)
        }
      },
      providesTags: result => {
        return result ? [{ type: 'COMPANY', id: result.companyId }] : []
      }
    }),

    // ************************************************ POST company/search
    getCompanies: builder.query<CompanyType[] | null, SearchFilterType>({
      query: body => ({
        url: `/company/search`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching companies',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data.data
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          if (data) dispatch(setCompanies(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getCompanies:', error.message)
        }
      },
      providesTags: result => {
        return result
          ? [
              { type: 'COMPANY', id: 'LIST' },
              ...((result && result.map(company => ({ type: 'COMPANY' as const, id: company.companyId }))) || [])
            ]
          : []
      }
    }),

    // *********************************************************** POST company
    postCompanyCreate: builder.mutation<boolean, CompanyCreateType>({
      query: body => {
        return {
          url: `/company`,
          method: 'POST',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating company',
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
          console.error('API error in postCompanyCreate:', error.message)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'COMPANY', id: 'LIST' }] : [])
    }),

    // *********************************************************** PUT company/companyId
    putCompanyUpdate: builder.mutation<boolean, CompanyUpdateType>({
      query: params => {
        const { companyId, ...body } = params

        return {
          url: `/company/${companyId}`,
          method: 'PUT',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating campaign',
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
          console.error('API error in putCompanyUpdate:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'COMPANY', id: arg.companyId }] : [])
    }),

    // *********************************************************** PUT company/companyId/enable
    putCompanyEnable: builder.mutation<boolean, string>({
      query: companyId => {
        return {
          url: `/company/${companyId}/enable`,
          method: 'PUT'
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching campaigns',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(companyId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error enabling company:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'COMPANY', id: arg }] : [])
    }),

    // *********************************************************** PUT company/companyId/disable
    putCompanyDisable: builder.mutation<boolean, string>({
      query: companyId => {
        return {
          url: `/company/${companyId}/disable`,
          method: 'PUT'
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching campaigns',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(companyId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error disabling company:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'COMPANY', id: arg }] : [])
    })
  })
})
