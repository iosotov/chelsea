import { setCampaigns, updateCampaigns } from '../campaignSlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType, SearchFilterType } from './sharedTypes'

export type CampaignCreateType = {
  campaignName: string
  description?: string
  phone: string
  email?: string
  displayName?: string
  companyId: string
}

export type CampaignUpdateType = {
  campaignId: string
  campaignName: string
  description?: string
  phone: string
  email?: string
  displayName?: string
  companyId: string
}

export type CampaignType = {
  campaignId: string
  campaignName: string
  description: string
  phone: string
  email: string
  displayName: string
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
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching campaign')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(campaignId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateCampaigns([data]))
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
    getCampaigns: builder.query<CampaignType[], SearchFilterType>({
      query: body => ({
        url: `/campaign/search`,
        method: 'POST',
        body
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching campaigns')
        console.log(res.data)

        return res.data.data
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
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
    createCampaign: builder.mutation<string, CampaignCreateType>({
      query: body => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        console.log(body)

        return {
          url: `/campaign`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating campaign')
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
      invalidatesTags: res => (res ? [{ type: 'CAMPAIGN', id: 'LIST' }] : [])
    }),
    updateCampaign: builder.mutation<boolean, CampaignUpdateType>({
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
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error updating campaign')

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
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'CAMPAIGN', id: arg.campaignId }] : [])
    }),
    deleteCampaign: builder.mutation<string, string>({
      query: campaignId => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          url: `/campaign/${campaignId}`,
          method: 'DELETE'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error deleting campaign')

        return arg
      },
      async onQueryStarted(campaignId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'CAMPAIGN', id: arg }] : [])
    })
  })
})
