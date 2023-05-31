// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import DialogContent from '@mui/material/DialogContent'
import Dialog from '@mui/material/Dialog'
import { Controller, useForm } from 'react-hook-form'
import { FormControl, FormHelperText } from '@mui/material'
import { toast } from 'react-hot-toast'
import { store } from 'src/store/store'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { EmailProfileCreateType } from 'src/store/api/emailApiSlice'

import { useAppSelector } from 'src/store/hooks'

import {
  usePostProfileEmailMutation,
  usePostTemplateSearchQuery,
  useLazyPostTemplateRenderQuery
} from 'src/store/api/apiHooks'
import { selectEmailById } from 'src/store/emailSlice'
import { selectTemplatesByType } from 'src/store/templateSlice'
import { TemplateRenderRequestType } from 'src/store/api/templateApiSlice'

import { useEffect, useRef } from 'react'

export type EmailDialogProps = {
  openEmailDialog: boolean
  setOpenEmailDialog: (state: boolean) => void
  formMode: number
  profileId?: string
  selectedEmail: string[]
}

interface FormValues {
  sentTo: string
  sentFrom: string
  subject: string
  body: string
  profileId?: string
  emailTemplate?: string
}

export const DrawerTitles = ['Create Task', 'Edit Task', 'Bulk Update Tasks']

const values: FormValues = {
  profileId: '',
  sentTo: '',
  sentFrom: '',
  subject: '',
  body: ''
}

const defaultValues = {
  profileId: '',
  sentTo: '',
  sentFrom: '',
  subject: '',
  body: ''
}

export default function EmailDialog({
  formMode,
  openEmailDialog,
  setOpenEmailDialog,
  profileId = '',
  selectedEmail
}: EmailDialogProps) {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue
  } = useForm<FormValues>({ defaultValues, shouldUnregister: true })

  const { isSuccess: templateSuccess } = usePostTemplateSearchQuery({})

  const [getRender, { isLoading: templateRenderLoading }] = useLazyPostTemplateRenderQuery()

  const [triggerCreate, { isSuccess: triggerSuccess }] = usePostProfileEmailMutation()
  const email = useAppSelector(state => selectEmailById(state, selectedEmail[0]))

  const emailTemplates = useAppSelector(state => selectTemplatesByType(state, 1))
  const emailRef = useRef<string>('')

  useEffect(() => {
    if (formMode === 1) {
      const task = store.getState().email.entities[selectedEmail[0]]
      if (task) {
        const { sentTo, sentFrom, body, subject, profileId } = task
        reset({ ...values, sentTo, sentFrom, body, subject, profileId })
      }
    } else {
      reset({ ...defaultValues })
    }
  }, [formMode, profileId, reset, selectedEmail, email])

  async function onSubmit(data: FormValues) {
    if (formMode === 0) {
      const createData: EmailProfileCreateType = { ...data, profileId: profileId }
      const success = await triggerCreate(createData).unwrap()
      if (success) {
        toast.success('You successfully created an email')
      }
      handleClose()
    }
  }
  const handleClose = () => {
    setOpenEmailDialog(false)
  }

  return (
    <Dialog
      fullWidth
      open={openEmailDialog}
      maxWidth='md'
      scroll='body'
      onClose={() => handleClose()}
      sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
    >
      <DialogContent
        sx={{
          position: 'relative',
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='emailTemplate'>Email Template</InputLabel>
                <Controller
                  name='emailTemplate'
                  control={control}
                  render={({ field: { onChange, ...rest } }) => (
                    <Select
                      labelId='emailTemplate'
                      label='Email Template'
                      disabled={templateRenderLoading}
                      onChange={async e => {
                        const template = store.getState().template.entities[emailRef.current]
                        if (template) {
                          template.title && setValue('subject', template.title)
                          const renderData: TemplateRenderRequestType = {
                            templateId: template.id
                          }
                          const { data }: { data?: any } = await getRender(renderData)
                          if (data) {
                            data.content && setValue('body', data.content)
                          }

                          onChange(e)
                        }
                      }}
                      {...rest}
                    >
                      {email && <MenuItem value={email.emailId}>{email.subject}</MenuItem>}
                      {formMode === 0 && (
                        <MenuItem value='' disabled>
                          Email Template
                        </MenuItem>
                      )}

                      {templateSuccess &&
                        emailTemplates.map(t => {
                          return email && email.emailId === t.id ? (
                            ''
                          ) : (
                            <MenuItem onClick={() => (emailRef.current = t.id)} key={t.id} value={t.name}>
                              {t.name}
                            </MenuItem>
                          )
                        })}
                    </Select>
                  )}
                />
                {errors.profileId && (
                  <FormHelperText sx={{ color: 'error.main' }} id='event-profileId-error'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='sentTo'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      label='Sent To'
                      rows={1}
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.sentTo)}
                    />
                  )}
                />
                {errors.sentTo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='event-sentTo-error'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='sentFrom'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      label='Sent From'
                      rows={1}
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.sentFrom)}
                    />
                  )}
                />
                {errors.sentFrom && (
                  <FormHelperText sx={{ color: 'error.main' }} id='event-sentFrom-error'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='subject'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      label='Subject'
                      rows={1}
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.subject)}
                    />
                  )}
                />
                {errors.subject && (
                  <FormHelperText sx={{ color: 'error.main' }} id='event-subject-error'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {/* <ReactDraftWysiwyg /> */}
              {/* <EmailEditor /> */}
            </Grid>
            <Grid item xs={12}>
              {/* ADD WISIWYG FEATURE */}
              <FormControl fullWidth>
                <Controller
                  name='body'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      label='Body'
                      multiline
                      rows={6}
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.body)}
                    />
                  )}
                />
                {errors.body && (
                  <FormHelperText sx={{ color: 'error.main' }} id='event-body-error'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                disabled={formMode === 1 || triggerSuccess}
                variant='contained'
                sx={{ mr: 4 }}

                // onClick={handleCreateEmailClick}
              >
                Send Email
              </Button>

              <Button variant='outlined' color='secondary' onClick={handleClose}>
                Discard
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}
