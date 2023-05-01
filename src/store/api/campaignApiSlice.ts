import { addCampaign, deleteCampaign, setCampaigns, updateCampaign } from '../campaignSlice'
import { apiSlice } from './apiSlice'

const DefaultCampaign: CampaignType = {
  campaignId: '',
  campaignName: '',
  description: '',
  phone: '',
  email: '',
  displayName: '',
  companyId: '',
  companyName: ''
}

export type UpdateCampaignType = {
  campaignId?: string
  campaignName: string
  description: string
  phone: string
  email?: string
  displayName?: string
  companyId?: string
  companyName: string
}

export type CampaignType = {
  campaignId: string
  campaignName: string
  description: string
  phone: string
  email?: string
  displayName?: string
  companyId: string
  companyName: string
}

export const campaignApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCampaign: builder.query<CampaignType, string>({
      query: campaignId => ({
        url: `/campaign/${campaignId}/info`,
        method: 'GET'
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching bank accounts')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(setCampaigns([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return result ? [{ type: 'CAMPAIGN', id: result.campaignId }] : []
      }
    }),
    getCampaigns: builder.query<CampaignType[], Record<string, any>>({
      query: body => ({
        url: `/campaign/search`,
        method: 'POST',
        body
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching bank accounts')
        console.log(res.data)

        return res.data.data
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(setCampaigns(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return [
          { type: 'CAMPAIGN', id: 'LIST' },
          ...((result && result.map(campaign => ({ type: 'CAMPAIGN' as const, id: campaign.campaignId }))) || [])
        ]
      }
    }),
    createCampaign: builder.mutation<string, UpdateCampaignType>({
      query: body => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        console.log(body)

        return {
          url: `/campaign`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error creating bank account')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data: campaignId } = await queryFulfilled
          const newCampaign: CampaignType = {
            ...DefaultCampaign,
            ...params,
            campaignId
          }

          dispatch(addCampaign(newCampaign))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),
    updateCampaign: builder.mutation<boolean, UpdateCampaignType>({
      query: params => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { campaignId, ...body } = params
        console.log(body)

        return {
          url: `/campaign/${campaignId}`,
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
          dispatch(updateCampaign(params))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),
    deleteCampaign: builder.mutation<string, string>({
      query: campaignId => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          url: `/campaign/${campaignId}`,
          method: 'DELETE'
        }
      },
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating bank account information')

        return res.data
      },
      async onQueryStarted(campaignId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled

          dispatch(deleteCampaign(campaignId))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    })
  })
})
