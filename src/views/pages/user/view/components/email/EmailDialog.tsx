// ** MUI Imports

import Grid from '@mui/material/Grid'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { DataGridPro, GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid-pro'
import Typography from '@mui/material/Typography'

import { Focused } from 'react-credit-cards'

import DialogContent from '@mui/material/DialogContent'
import Card from '@mui/material/Card'

import Dialog from '@mui/material/Dialog'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
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
  usePostTemplateRenderQuery,
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

const fakeTemplate = [
  { label: 'All Tags Testing', value: 'All Tags Testing' },
  { label: 'Payment Reminder', value: 'Payment Reminder' },
  { label: 'New Login Account Created For You', value: 'New Login Account Created For You' },
  { label: 'Email Template', value: 'Email Template' }
]

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
  // const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {

  const {
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
    setValue
  } = useForm<FormValues>({ defaultValues, shouldUnregister: true })

  const { isSuccess: templateSuccess } = usePostTemplateSearchQuery({})

  const [getRender, { isSuccess: templateRenderSuccess }] = useLazyPostTemplateRenderQuery()

  const [triggerCreate, { isSuccess: triggerSuccess }] = usePostProfileEmailMutation()
  const email = useAppSelector(state => selectEmailById(state, selectedEmail[0]))

  const emailTemplates = useAppSelector(state => selectTemplatesByType(state, 1))
  console.log(emailTemplates)
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
      console.log(createData)

      const success = await triggerCreate(createData).unwrap()
      if (success) {
        toast.success('You successfully created an email')
      }
      handleClose()
    }
  }
  const handleClose = () => {
    // resetForm()

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
                      onChange={async e => {
                        const template = store.getState().template.entities[emailRef.current]
                        if (template) {
                          console.log(template.title)
                          template.title && setValue('subject', template.title)
                          const renderData: TemplateRenderRequestType = {
                            templateId: template.id
                          }
                          const { data }: { data?: any } = await getRender(renderData)
                          if (data) {
                            console.log(data)
                            data.content && setValue('body', data.content)
                          }

                          // template && template.content ? setValue('body', template.content) : setValue('body', '')
                          onChange(e)
                        }
                      }}
                      {...rest}
                    >
                      {email && <MenuItem value={email.emailId}>{email.subject}</MenuItem>}
                      {formMode === 0 && (
                        <MenuItem value='' disabled>
                          Name
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
              {/* <InputLabel>Email Template</InputLabel>
              <Select
                fullWidth
                name='email-template'
                value={template ?? ''}
                label='Email Template'
                defaultValue='select-method'
                placeholder='Select Template'
                onChange={handleSelectChange}
                disabled={formMode == 0}
                onFocus={e => setFocus(e.target.name as Focused)}
                inputProps={{ maxLength: 1000 }}
                onBlur={handleBlur}
              >
                <MenuItem value='select-method' disabled>
                  Select Template
                </MenuItem>
                {fakeTemplate.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                fullWidth
                label='Template'
                name='email-template'
                placeholder='Template'
                value={sentTo ?? ''}
                onBlur={handleBlur}
                onChange={handleInputChange}
                inputProps={{ maxLength: 1000 }}
                onFocus={e => setFocus(e.target.name as Focused)}
                disabled={dialogTitle == 'Edit'}
              /> */}
              {/* <FormControl fullWidth sx={{ mb: 6 }}>
                <InputLabel id='emailTemplate'>Email Template</InputLabel>
                <Controller
                  name="emailTemplate"
                  control={control}
                  render={({ field: { onChange, ...rest } }) => (
                    <Select
                      labelId='taskName'
                      label='Name'
                      onChange={(e) => {
                        const template = store.getState().template.entities[taskRef.current]
                        template && template.content ? setValue("notes", template.content) : setValue("notes", "")
                        onChange(e)
                      }}
                      {...rest}
                    >
                      {task && <MenuItem value={task.taskName}>{task.taskName}</MenuItem>}
                      {formMode === 0 && <MenuItem value="" disabled>Name</MenuItem>}

                      {templateSuccess && taskTemplates.map(t => {
                        return task && task.taskName === t.name ? "" : <MenuItem onClick={() => taskRef.current = t.id} key={t.id} value={t.name}>{t.name}</MenuItem>
                      })}
                    </Select>
                  )}
                />
                {errors.profileId && (
                  <FormHelperText sx={{ color: 'error.main' }} id='event-profileId-error'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl> */}
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
              {/* <TextField
                fullWidth
                name='email-subject'
                value={subject ?? ''}
                label='Subject'
                onBlur={handleBlur}
                onChange={handleInputChange}
                inputProps={{ maxLength: 1000 }}
                onFocus={e => setFocus(e.target.name as Focused)}
                disabled={dialogTitle == 'Edit'}
              /> */}
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
              EDITOR
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
                  <FormHelperText sx={{ color: 'error.main' }} id='event-notes-error'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
              {/* <TextField
                fullWidth
                name='email-body'
                value={body ?? ''}
                rows={6}
                label='Body'
                multiline
                placeholder='Message'
                onBlur={handleBlur}
                onChange={handleInputChange}
                inputProps={{ maxLength: 1000 }}
                onFocus={e => setFocus(e.target.name as Focused)}
                disabled={dialogTitle == 'Edit'}
              /> */}
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                // disabled={triggerSuccess}
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
