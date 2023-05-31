import { setHistories } from '../historySlice'
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
    getHistory: builder.query<HistoryType[], string>({
      query: profileId => ({
        url: `/history/${profileId}/profile`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile history',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setHistories(data))
        } catch (err: any) {
          console.error('API error in getHistory:', err.error.data.message)
        }
      }
    })
  })
})
