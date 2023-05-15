import { apiSlice } from './apiSlice'
import { LunaResponseType } from './sharedTypes'

export type HistoryType = {
  id: string
  employeeName: string
  profileId: string
  name: string
  modifiedDate: string
  fullDescription: string
}

export const historyApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getHistory: builder.query<HistoryType, string>({
      query: profileId => ({
        url: `/history/${profileId}/profile`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching profile history')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(profileId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    })
  })
})
