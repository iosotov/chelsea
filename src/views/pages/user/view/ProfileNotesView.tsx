import { useState, useEffect } from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { toast } from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import { v4 as uuid } from 'uuid'

import {
  useGetProfileNotesQuery,
  usePostNoteCreateMutation,
  usePutNoteUpdateMutation,
  useDeleteNoteMutation,
  usePostEmployeeSearchQuery
} from 'src/store/api/apiHooks'

import { useAppSelector } from 'src/store/hooks'
import { selectNoteById, selectNotesByProfileId } from 'src/store/noteSlice'
import { selectAllEmployeeSelectOptions } from 'src/store/employeeSlice'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { NoteCreateType, NoteUpdateType, NoteReferenceTypeEnum } from 'src/store/api/noteApiSlice'

interface ProfileNotesProps {
  id: string
}

interface FilteredOptionsType {
  label: string
  value: string
}

interface FormValues {
  content: string
  parentNoteId?: string
  important?: boolean
  mentionedEmails?: string
  noteReferenceId?: string
  referenceType?: NoteReferenceTypeEnum
  type?: string
  usedTemplate?: string
  targets?: string
  profileId: string
}
export const DrawerTitles = ['Create', 'Edit']

const noteTemplates = ['Credit Card', 'Address Template', 'Debt Template', 'Payment Template']

// const assignTypes = ['Employees', 'Groups', 'Roles']

const defaultValues: FormValues = {
  profileId: '',
  content: '',
  type: '',
  mentionedEmails: '',
  usedTemplate: '',
  targets: ''
}

const ProfileNotes = ({ id }: ProfileNotesProps) => {
  const profileId = id
  const [selectedNote, setSelectedNote] = useState<string>('')
  const [formMode, setFormMode] = useState<number>(0)
  const { isLoading, isError } = useGetProfileNotesQuery(profileId)
  const profileNotes = useAppSelector(state => selectNotesByProfileId(state, profileId))

  usePostEmployeeSearchQuery({})
  const employees: FilteredOptionsType[] = useAppSelector(state => selectAllEmployeeSelectOptions(state))

  // const [noteType, setNoteType] = useState<string>('')
  const note = useAppSelector(state => selectNoteById(state, selectedNote))
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<FormValues>({ defaultValues, shouldUnregister: true })

  useEffect(() => {
    if (formMode === 1 && note) {
      const { content, mentionedEmails } = note
      reset({ content, mentionedEmails: mentionedEmails || '' })
    } else {
      reset({ ...defaultValues })
    }
  }, [formMode, note, reset])

  let rows = []

  const dataWithIndex = profileNotes.map((obj, index) => {
    return { ...obj, id: index }
  })
  rows = dataWithIndex

  //API CALLS
  const [createNote, { isLoading: createLoading }] = usePostNoteCreateMutation()
  const [updateNote, { isLoading: updateLoading }] = usePutNoteUpdateMutation()
  const [deleteNote, { isLoading: deleteLoading }] = useDeleteNoteMutation()

  //LOAD DATA

  async function onSubmit(data: FormValues) {
    if (formMode === 0) {
      const createData: NoteCreateType = { ...data, targets: [], profileId }
      const success = await createNote(createData)
      if (success) {
        toast.success('You successfully created a task')
        handleClose()
      }
    }

    if (formMode === 1 && note) {
      const updateData: NoteUpdateType = { ...data, noteId: note.noteId, targets: [] }
      const success = await updateNote(updateData)
      if (success) {
        toast.success('You successfully updated a task')
        handleClose()
      }
    }
  }

  function handleClose() {
    console.log('closing')
  }

  const RenderSidebarFooter = () => {
    return (
      <Box sx={{ mb: 6 }}>
        <Button disabled={createLoading} size='medium' variant='contained' sx={{ mr: 4 }} type='submit'>
          Create
        </Button>
      </Box>
    )
  }

  async function handleEditButtonById(params: string) {
    setSelectedNote(params)
    setFormMode(1)
    console.log(updateLoading)
  }

  async function handleDeleteButton(params: string) {
    setSelectedNote(params)
    setFormMode(1)
    if (note) {
      const deleteData: string = note.noteId

      const success = await deleteNote(deleteData)
      if (success) {
        toast.success('You successfully created a task')
        handleClose()
      }
    }
    console.log(deleteLoading)
  }

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
      width: 90,
      valueGetter: (params: GridValueGetterParams) => `${params.row.type || 'null'}`
    },
    {
      field: 'content',
      headerName: 'Message',
      width: 190
    },
    {
      field: 'createdAt',
      headerName: 'created At',
      width: 150
    },
    {
      field: 'createdByName',
      headerName: 'created By Name',
      width: 150
    },
    {
      field: 'important',
      headerName: 'Important',
      width: 110
    },

    {
      field: 'Pin Note',

      width: 70,
      renderCell: params => (
        <IconButton
          size='small'
          sx={{ color: 'text.primary' }}
          value={params.row.noteId}
          onClick={() => handleEditButtonById(params.row.noteId)}
        >
          <Icon icon='mdi:pin' />
        </IconButton>
      )
    },
    {
      field: 'Delete',

      width: 70,
      renderCell: params => (
        <IconButton
          size='small'
          sx={{ color: 'text.primary' }}
          value={params.row.noteId}
          onClick={() => handleDeleteButton(params.row.noteId)}
        >
          <Icon icon='mdi:delete' />
        </IconButton>
      )
    }
  ]

  if (isError) return <div>An error occured</div>

  if (isLoading) return <div>Loading</div>

  return (
    <>
      <Card>
        <CardHeader title='Create Note' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel htmlFor='type'>Select Note Template...</InputLabel>
                  <Controller
                    name='type'
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <Select
                        disabled
                        label='Select Template'
                        labelId='type'
                        id='type'
                        error={Boolean(errors.type)}
                        {...field}
                      >
                        <MenuItem value={undefined} disabled>
                          Select Note Template
                        </MenuItem>
                        {noteTemplates.map((e, i) => (
                          <MenuItem key={uuid()} value={i}>
                            {e}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.type && (
                    <FormHelperText sx={{ color: 'error.main' }} id='event-status-error'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel htmlFor='usedTemplate'>Select Note Template Type...</InputLabel>
                  <Controller
                    name='usedTemplate'
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <Select
                        disabled
                        label='Select Note Template Type'
                        labelId='usedTemplate'
                        id='usedTemplate'
                        error={Boolean(errors.usedTemplate)}
                        {...field}
                      >
                        <MenuItem value={undefined} disabled>
                          Select Note Type
                        </MenuItem>
                        {noteTemplates.map((e, i) => (
                          <MenuItem key={uuid()} value={i}>
                            {e}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.type && (
                    <FormHelperText sx={{ color: 'error.main' }} id='event-status-error'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel htmlFor='targets'>Notify To Users</InputLabel>
                  <Controller
                    name='targets'
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <Select
                        disabled
                        label='Select Users to Notify'
                        labelId='targets'
                        id='targets'
                        error={Boolean(errors.targets)}
                        {...field}
                      >
                        <MenuItem value={undefined} disabled>
                          Select Users to Notify
                        </MenuItem>
                        {employees.map(employee => (
                          <MenuItem key={employee.label} value={employee.value}>
                            {employee.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.targets && (
                    <FormHelperText sx={{ color: 'error.main' }} id='event-status-error'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Controller
                    name='mentionedEmails'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Email'
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.mentionedEmails)}
                      />
                    )}
                  />
                  {errors.mentionedEmails && (
                    <FormHelperText sx={{ color: 'error.main' }} id='event-content-error'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='content'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        rows={6}
                        label='Content'
                        multiline
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.content)}
                      />
                    )}
                  />
                  {errors.content && (
                    <FormHelperText sx={{ color: 'error.main' }} id='event-content-error'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>{formMode == 0 && <RenderSidebarFooter />}</Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <br></br>
      <Card>
        <CardHeader title='Notes' />
        <CardContent>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} sx={{ mt: 7 }} />
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default ProfileNotes
