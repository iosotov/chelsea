import { updateEmails } from '../emailSlice'
import { apiSlice } from './apiSlice'
import { ErrorResponseType, LunaResponseType } from './sharedTypes'

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
    // ***************************************************** GET email/emailId/info
    getEmail: builder.query<EmailType | null, string>({
      query: emailId => ({
        url: `/email/${emailId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching email',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(emailId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateEmails([data]))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getEmail:', error.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'EMAIL', id: arg }] : []
      }
    }),

    // ***************************************************** GET email/profileId/profile
    getProfileEmails: builder.query<EmailType[] | null, string>({
      query: profileId => ({
        url: `/email/${profileId}/profile`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile email',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateEmails(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getProfileEmails:', error.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'EMAIL', id: arg }] : []
      }
    }),

    // ***************************************************** GET email/profileId/profile/liabilityId/liability
    getProfileLiabilityEmails: builder.query<EmailType[] | null, EmailProfileLiabilitySearchType>({
      query: params => {
        const { profileId, liabilityId } = params

        return {
          url: `/email/${profileId}/profile/${liabilityId}/liability`,
          method: 'GET'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching liability email',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateEmails(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getProfileLiabilityEmails:', error.message)
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

    // ***************************************************** POST email/profileId/profile/send
    postProfileEmail: builder.mutation<boolean, EmailProfileCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/email/${profileId}/profile/send`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error posting email',
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
          console.error('API error in postProfileEmail:', error.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'EMAIL', id: arg.profileId }] : []
      }
    }),

    // ***************************************************** POST email/profileId/profile/liabilityId/liability/send
    postProfileLiabilityEmail: builder.mutation<boolean, EmailProfileLiabilityCreateType>({
      query: params => {
        const { profileId, liabilityId, ...body } = params

        return {
          url: `/email/${profileId}/profile/${liabilityId}/liability/send`,
          method: 'POST',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error posting liability email',
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
          console.error('API error in postProfileLiabilityEmail:', error.message)
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

    // ***************************************************** POST email/profileId/profile/send-attachment
    postEmailAttachment: builder.mutation<boolean, EmailSendAttachmentType>({
      query: params => {
        const { profileId, body } = params

        return {
          url: `/email/${profileId}/profile/send-attachment`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error posting email/attachment',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled

          // dispatch(updateEmails([data]))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in  postEmailAttachment:', error.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'EMAIL', id: arg.profileId }] : []
      }
    })
  })
})
