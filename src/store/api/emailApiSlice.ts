import { updateEmails } from '../emailSlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType } from './sharedTypes'

export type EmailType = {
  emailId: string
  subject: string
  body: string
  sentFrom: string
  sentTo: string
  status: EmailStatusEnum
  notifiedCCs: string
  attachments: string
  profileId: string
  liabilityId: string | null
  createdAt: string
}

export type EmailProfileCreateType = {
  profileId: string
  subject: string
  body: string
  sentFrom: string
  sentTo: string
}

export type EmailProfileLiabilityCreateType = {
  liabilityId: string
  profileId: string
  subject: string
  body: string
  sentFrom: string
  sentTo: string
}

export type EmailProfileLiabilitySearchType = {
  profileId: string
  liabilityId: string
}

export type EmailSendAttachmentType = {
  profileId: string
  body: FormData
}

export enum EmailStatusEnum {
  'Sent'
}

export const emailApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getEmail: builder.query<EmailType, string>({
      query: emailId => ({
        url: `/email/${emailId}/info`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching email')

        return res.data
      },
      async onQueryStarted(emailId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(updateEmails([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'EMAIL', id: arg }] : []
      }
    }),
    getProfileEmails: builder.query<EmailType[], string>({
      query: profileId => ({
        url: `/email/${profileId}/profile`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching profile emails')

        return res.data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(updateEmails(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'EMAIL', id: arg }] : []
      }
    }),
    getProfileLiabilityEmails: builder.query<EmailType[], EmailProfileLiabilitySearchType>({
      query: params => {
        const { profileId, liabilityId } = params

        return {
          url: `/email/${profileId}/profile/${liabilityId}/liability`,
          method: 'GET'
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching liability email')

        return res.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(updateEmails(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'EMAIL', id: arg.liabilityId },
              { type: 'EMAIL', id: arg.profileId }
            ]
          : []
      }
    }),
    postProfileEmail: builder.mutation<string, EmailProfileCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/email/${profileId}/profile/send`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error sending email')

        return res.data
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled

          // dispatch(updateEmails([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'EMAIL', id: arg.profileId }] : []
      }
    }),
    postProfileLiabilityEmail: builder.mutation<string, EmailProfileLiabilityCreateType>({
      query: params => {
        const { profileId, liabilityId, ...body } = params

        return {
          url: `/email/${profileId}/profile/${liabilityId}/liability/send`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error sending liability email')

        return res.data
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
      invalidatesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'EMAIL', id: arg.profileId },
              { type: 'EMAIL', id: arg.liabilityId }
            ]
          : []
      }
    }),
    postEmailAttachment: builder.mutation<string, EmailSendAttachmentType>({
      query: params => {
        const { profileId, body } = params

        return {
          url: `/email/${profileId}/profile/send-attachment`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error sending email with attachment')

        return res.data
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled

          // dispatch(updateEmails([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'EMAIL', id: arg.profileId }] : []
      }
    })
  })
})
