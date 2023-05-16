import { setDocuments } from '../documentSlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType } from './sharedTypes'

export type DocumentLiabilityParamsType = {
  profileId: string
  liabilityId: string
}

export type DocumentGenerateType = {
  templateId: string
  title: string
  esignService?: string
  profileId: string
}

export type LiabilityDocumentGenerateType = {
  templateId: string
  title: string
  esignService?: string
  profileId: string
  liabilityId: string
}

export type DocumentPreviewType = {
  content: string
  title: string
  contentType: string
  fileExtension: string
  documentId: string
}

/*

FORM DATA FIELDS

title: string (required)
description: string (optional)
file: file (required)
category: string (required)

*/
export type DocumentUploadType = {
  profileId: string

  // Refer to comment above
  data: FormData
}

export type LiabilityDocumentUploadType = {
  profileId: string
  liabilityId: string

  // Refer to comment above
  data: FormData
}

export type DocumentEsignType = {
  profileId: string
  targetPhoneNumber: string
  targetEmail: string
  sendingMethod?: number
  documentId: string
}

export type LiabilityDocumentEsignType = {
  profileId: string
  liabilityId: string
  targetPhoneNumber: string
  targetEmail: string
  sendingMethod?: number
  documentId: string
}

export type DocumentType = {
  documentId: string
  name: string
  title: string
  url: string
  type: number
  typeName: string
  status: number
  statusName: string
  category: string
  description: string
  esignService: string
  liabilityId: string
  fileSize: number
  profileId: string
  createdAt: string
  createdByName: string
  signedIp: string
}
export const documentApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ***************************************************** GET document/profileId/profile
    getDocuments: builder.query<DocumentType[] | null, string>({
      query: profileId => ({
        url: `/document/${profileId}/profile`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile documents',
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
          if (data) dispatch(setDocuments(data))
        } catch (err: any) {
          console.error('API error in getDocuments:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'DOCUMENT', id: arg }] : []
      }
    }),

    // ***************************************************** GET document/profileId/profile/liability
    getDocumentByLiability: builder.query<DocumentType | null, DocumentLiabilityParamsType>({
      query: params => ({
        url: `/document/${params.profileId}/profile/${params.liabilityId}/liability`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching liability document',
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
          console.log(data)

          dispatch(setDocuments([data]))
        } catch (err: any) {
          console.error('API error in getDocumentByLiability:', err.error.data.message)
        }
      }
    }),

    // ***************************************************** GET document/documentId/preview
    getDocumentPreview: builder.query<DocumentPreviewType | null, string>({
      query: documentId => ({
        url: `/document/${documentId}/preview`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching document preview',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) return null
        const newRes = { ...res.data, documentId: arg }

        return newRes
      },
      async onQueryStarted(documentId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setDocuments([data]))
        } catch (err: any) {
          console.error('API error in getDocumentPreview:', err.error.data.message)
        }
      },
      providesTags: res => (res ? [{ type: 'DOCUMENT-PREVIEW', id: res.documentId }] : [])
    }),

    // ***************************************************** POST document/profileId/profile/generate
    postDocumentGenerate: builder.mutation<boolean, DocumentGenerateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/document/${profileId}/profile/generate`,
          method: 'POST',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error generating profile document',
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
          console.error('API error in postDocumentGenerate:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'DOCUMENT', id: arg.profileId }] : [])
    }),

    // ***************************************************** POST document/profileId/profile/liabilityId/generate
    postLiabilityDocumentGenerate: builder.mutation<boolean, LiabilityDocumentGenerateType>({
      query: params => {
        const { liabilityId, profileId, ...body } = params

        return {
          url: `/document/${profileId}/profile/${liabilityId}/liability/generate`,
          method: 'POST',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error generating liability document',
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
          console.error('API error in postLiabilityDocumentGenerate:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'DOCUMENT', id: arg.profileId }] : [])
    }),

    // ***************************************************** POST document/profileId/profile
    postDocumentUpload: builder.mutation<boolean, DocumentUploadType>({
      query: params => {
        const { profileId, data } = params

        return {
          url: `/document/${profileId}/profile/upload`,
          method: 'POST',
          body: data
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error uploading document',
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
          console.error('API error in postDocumentUpload:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'DOCUMENT', id: arg.profileId }] : [])
    }),

    // ***************************************************** POST document/profileId/profile/liabilityId/liability/upload
    postLiabilityDocumentUpload: builder.mutation<boolean, LiabilityDocumentUploadType>({
      query: params => {
        const { liabilityId, profileId, data } = params

        return {
          url: `/document/${profileId}/profile/${liabilityId}/liability/upload`,
          method: 'POST',
          body: data
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error uploading liability document',
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
          console.error('API error in postLiabilityDocumentUpload:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'DOCUMENT', id: arg.profileId }] : [])
    }),

    // ***************************************************** POST document/profileId/profile/esign/send
    postDocumentEsign: builder.mutation<boolean, DocumentEsignType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/document/${profileId}/profile/esign/send`,
          method: 'POST',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error posting document esign',
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
          console.error('API error in postDocumentEsign:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'DOCUMENT', id: arg.profileId }] : [])
    }),

    // ***************************************************** POST document/profileId/profile/liabilityId/liability/esign/send
    postLiabilityDocumentEsign: builder.mutation<boolean, LiabilityDocumentEsignType>({
      query: params => {
        const { liabilityId, profileId, ...body } = params

        return {
          url: `/document/${profileId}/profile/${liabilityId}/liability/esign/send`,
          method: 'PUT',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error posting liability document esign',
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
          console.error('API error in postLiabilityDocumentEsign:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'DOCUMENT', id: arg.profileId }] : [])
    })
  })
})
