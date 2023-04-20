import { createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { updateProfileState } from '../profileSlice'
import { RootState } from '../store'
import { apiSlice } from './apiSlice'

export type Profile = {
  profileId: string
  createdAt: string
  createdCompanyName: string
  stageName: string
  stageStatusName: string
  statusName: string
  submittedDate: string
  enrolledDate: string
  cancelledDate: string

  firstName: string
  lastName: string
  avatar: string
}

export const profileAdapter = createEntityAdapter<Profile>({
  selectId: profile => profile.profileId
})

const initialState = profileAdapter.getInitialState()

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfiles: builder.query<EntityState<Profile>, Record<string, any>>({
      query: searchParams => ({
        url: `/profile/search`,
        method: 'POST',
        body: searchParams
      }),
      transformResponse: (res: Record<string, any>) => {
        console.log(res.data)

        return profileAdapter.setAll(initialState, res.data.data)
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(updateProfileState(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return [
          { type: 'PROFILE', id: 'LIST' },
          ...((result && result.ids.map(id => ({ type: 'PROFILE' as const, id }))) || [])
        ]
      }
    })
  })
})

export const {
  selectAll: selectAllProfiles,
  selectById: selectProfileById,
  selectIds: selectProfileIds
} = profileAdapter.getSelectors((state: RootState) => state.profile)

export const { useGetProfilesQuery } = profileApiSlice
