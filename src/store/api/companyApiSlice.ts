import { setCompanies, updateCompanies } from '../companySlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType, SearchFilterType } from './sharedTypes'

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
  endpoints: builder => ({
    getCompany: builder.query<CompanyType, string>({
      query: companyId => ({
        url: `/company/${companyId}/info`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching company')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(companyId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateCompanies([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return result ? [{ type: 'COMPANY', id: result.companyId }] : []
      }
    }),
    getCompanies: builder.query<CompanyType[], SearchFilterType>({
      query: body => ({
        url: `/company/search`,
        method: 'POST',
        body
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching companies')
        console.log(res.data)

        return res.data.data
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(setCompanies(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return [
          { type: 'COMPANY', id: 'LIST' },
          ...((result && result.map(company => ({ type: 'COMPANY' as const, id: company.companyId }))) || [])
        ]
      }
    }),
    createCompany: builder.mutation<string, CompanyCreateType>({
      query: body => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        console.log(body)

        return {
          url: `/company`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating company')
        console.log(res.data)

        return res.data
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
      invalidatesTags: res => (res ? [{ type: 'COMPANY', id: 'LIST' }] : [])
    }),
    updateCompany: builder.mutation<boolean, CompanyUpdateType>({
      query: params => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { companyId, ...body } = params
        console.log(body)

        return {
          url: `/company/${companyId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error updating company')

        return res.success
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
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'COMPANY', id: arg.companyId }] : [])
    }),
    enableCompany: builder.mutation<string, string>({
      query: companyId => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          url: `/company/${companyId}/enable`,
          method: 'PUT'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error enabling company')

        return arg
      },
      async onQueryStarted(companyId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'COMPANY', id: arg }] : [])
    }),
    disableCompany: builder.mutation<string, string>({
      query: companyId => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          url: `/company/${companyId}/disable`,
          method: 'PUT'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error disabling company')

        return arg
      },
      async onQueryStarted(companyId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'COMPANY', id: arg }] : [])
    })
  })
})
