import { addCompany, setCompanies, updateCompany } from '../companySlice'
import { apiSlice } from './apiSlice'

const DefaultComany: CompanyType = {
  companyId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: '',
  phone: '',
  email: null,
  address1: null,
  address2: null,
  city: null,
  state: null,
  zipcode: null,
  parentCompanyId: null,
  parentCompanyName: null
}

export type UpdateCompanyType = {
  companyId?: string
  name: string
  phone: string
  email?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zipcode?: string
  parentCompanyId?: string
  sharedPercentage?: string
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
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching company')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(setCompanies([data]))
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
    getCompanies: builder.query<CompanyType[], Record<string, any>>({
      query: body => ({
        url: `/company/search`,
        method: 'POST',
        body
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching companies')
        console.log(res.data)

        return res.data.data
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
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
    createCompany: builder.mutation<string, UpdateCompanyType>({
      query: body => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        console.log(body)

        return {
          url: `/company`,
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
          const newCompany: CompanyType = {
            ...DefaultComany,
            ...params,
            companyId
          }

          dispatch(addCompany(newCompany))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),
    updateCompany: builder.mutation<boolean, UpdateCompanyType>({
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
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating bank account information')

        return res.success
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(updateCompany(params))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),
    enableCompany: builder.mutation<string, string>({
      query: companyId => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          url: `/company/${companyId}/enable`,
          method: 'PUT'
        }
      },
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error enabling company')

        return res.data
      },
      async onQueryStarted(companyId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          const data = { companyId, active: true }

          dispatch(updateCompany(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),
    disableCompany: builder.mutation<string, string>({
      query: companyId => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          url: `/company/${companyId}/disable`,
          method: 'PUT'
        }
      },
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error disabling company')

        return res.data
      },
      async onQueryStarted(companyId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          const data = { companyId, active: false }

          dispatch(updateCompany(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    })
  })
})

export const {
  useGetCompaniesQuery,
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useEnableCompanyMutation,
  useDisableCompanyMutation
} = companyApiSlice
