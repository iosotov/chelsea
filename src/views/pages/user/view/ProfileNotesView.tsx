import { useState, useEffect } from 'react'
import { Divider, List, ListItem, ListItemText } from '@mui/material'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import Box from '@mui/material/Box'

import {
  useGetProfileNotesQuery,
  usePostNoteCreateMutation,
  usePutNoteUpdateMutation,
  useDeleteNoteMutation,
  usePostEmployeeSearchQuery,
  usePostTemplateSearchQuery,
  useLazyGetTemplateQuery
} from 'src/store/api/apiHooks'

import { useAppSelector } from 'src/store/hooks'
import { selectNotesByProfileId, selectPinnedNotesByProfileId } from 'src/store/noteSlice'
import { selectAllEmployees } from 'src/store/employeeSlice'

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { NoteCreateType } from 'src/store/api/noteApiSlice'
import { selectTemplatesByType } from 'src/store/templateSlice'
import { store } from 'src/store/store'
import { DataGridPro, GridColDef, GridRowId, GridValueGetterParams } from '@mui/x-data-grid-pro'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import CloseIcon from '@mui/icons-material/Close';

const defaultValues = {
  content: '',
  mentionedEmails: '',
  usedTemplate: '',
  targets: []
}
interface ProfileNotesProps {
  id: string
}

interface FormValues {
  content: string
  mentionedEmails: string
  usedTemplate: string
  targets: string[]

}

const ProfileNotes = ({ id }: ProfileNotesProps) => {
  const profileId = id

  //API CALLS
  const { isSuccess: employeeSuccess } = usePostEmployeeSearchQuery({})
  const { isSuccess: templateSuccess } = usePostTemplateSearchQuery({})
  const [triggerCreate, { isLoading: createLoading }] = usePostNoteCreateMutation()
  const [triggerUpdate, { isLoading: updateLoading }] = usePutNoteUpdateMutation()
  const [triggerDelete, { isLoading: deleteLoading }] = useDeleteNoteMutation()
  const [getTemplate] = useLazyGetTemplateQuery()
  const { isLoading, isError } = useGetProfileNotesQuery(profileId, { skip: !profileId })

  // GLOBAL STATE
  const profileNotes = useAppSelector(state => selectNotesByProfileId(state, profileId))
  const noteTemplates = useAppSelector(state => selectTemplatesByType(state, 3))
  const users = useAppSelector(state => selectAllEmployees(state))
  const pinnedNotes = useAppSelector(state => selectPinnedNotesByProfileId(state, profileId))

  // LOCAL STATE
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([])
  const [dialogMode, setDialogMode] = useState<boolean>(false)


  // USE HOOK FORM
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { }
  } = useForm<FormValues>({ defaultValues })


  // SUBMIT HANDLER
  const onSubmit = async (data: FormValues) => {
    const { targets, ...rest } = data
    const createData: NoteCreateType = { ...rest, targets: targets.map(t => ({ type: 0, value: t })), profileId }
    console.log(createData)

    const success = await triggerCreate(createData).unwrap()
    if (success) {
      toast.success("You have successfully created a note for profile")
      reset({ ...defaultValues })
    }
  }

  // AUTOMATICALLY DISABLES FORM IF NOTE SELECTED
  useEffect(() => {
    if (selectionModel.length) setDialogMode(true)
    else setDialogMode(false)
  }, [selectionModel.length])


  // UPDATES IMPORTANT STATUS = PINNING
  async function handleUpdateImportant(noteId: string) {
    const note = store.getState().note.entities[noteId]
    if (note) {
      const { data = undefined }: { data?: any, error?: any } = await triggerUpdate({ noteId: note.noteId, content: note.content, important: !note.important })
      if (data) {
        toast.success("You have updated note")
      }
    }
  }

  // HANDLE DELETE
  async function handleDeleteButton(noteId: string) {
    const { data = undefined }: { data?: any, error?: any } = await triggerDelete(noteId)
    if (data) {
      toast.success("You have successfully deleted note")
    }

  }

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
      width: 90,
      valueGetter: (params: GridValueGetterParams) => `${params.row.type || "General"}`
    },
    {
      field: 'content',
      headerName: 'Message',
      width: 190
    },
    {
      field: 'createdAt',
      headerName: 'created At',
      valueGetter: (params) => format(new Date(params.value), "MM/dd/yyyy"),
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
          disabled={updateLoading}
          value={params.row.noteId}
          onClick={() => handleUpdateImportant(params.row.noteId)}
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
          disabled={deleteLoading}
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
        <CardHeader title='Pinned Notes' />
        <CardContent>
          <List >
            <Divider />
            {pinnedNotes.map(n => {
              return (
                <>
                  <ListItem
                    key={n.noteId}
                    secondaryAction={
                      <IconButton disabled={updateLoading} onClick={() => handleUpdateImportant(n.noteId)} edge="end" aria-label="delete">
                        <CloseIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={n.content}
                      secondary={n.type || "General"}
                    />
                  </ListItem>
                  <Divider />
                </>
              )
            })}
          </List>
        </CardContent>
      </Card>

      <br></br>
      <Card>
        <CardHeader title='Create Note' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <FormControl disabled={dialogMode} fullWidth>
                  <InputLabel htmlFor='note-template'>Note Template</InputLabel>
                  <Controller
                    name='usedTemplate'
                    control={control}
                    render={({ field: { onChange, ...rest } }) => {
                      return (
                        <Select
                          label='Note Template'
                          labelId='note-template'

                          // disabled={isLoading}
                          onChange={async (e) => {
                            const { error, data } = await getTemplate(e.target.value)
                            if (data) {
                              const { content, presetNotifiedEmployees, presetCCEmails } = data
                              content && setValue("content", content, { shouldValidate: true })
                              presetCCEmails?.length && setValue("mentionedEmails", presetCCEmails.join(", "), { shouldValidate: true })
                              presetNotifiedEmployees?.length && setValue("targets", presetNotifiedEmployees.map(e => e.toUpperCase()))
                            }
                            console.log(error, data)
                            onChange(e)
                          }}
                          {...rest}
                        >
                          <MenuItem value='' disabled>
                            Select Template
                          </MenuItem>
                          {templateSuccess && noteTemplates.map(t => {
                            return (
                              <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                            )
                          })}
                        </Select>)
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={dialogMode}>
                  <InputLabel htmlFor='note-targets'>Notify Users</InputLabel>
                  <Controller
                    name='targets'
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          label='Notify Users'
                          labelId='note-targets'
                          multiple

                          // disabled={isLoading}
                          {...field}
                        >
                          {employeeSuccess && users.map(t => {
                            return (
                              <MenuItem key={t.employeeId} value={t.employeeId.toUpperCase()}>{t.employeeAlias}</MenuItem>
                            )
                          })}
                        </Select>)
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} >
                <FormControl fullWidth>
                  <Controller
                    name='mentionedEmails'
                    control={control}
                    render={({ field }) => {

                      return <TextField disabled={dialogMode} label='Mention Email' {...field} />
                    }}

                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <Controller
                    name='content'
                    control={control}
                    render={({ field }) => {

                      return <TextField disabled={dialogMode} multiline rows={4} label='content' {...field} />
                    }}

                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} textAlign={'right'}>

                <Button
                  size='large'
                  disabled={dialogMode || createLoading}
                  variant='contained'
                  sx={{ mr: 4 }}
                  type='submit'
                >
                  Create
                </Button>
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
            <DataGridPro checkboxSelection onRowSelectionModelChange={(props) => {
              setSelectionModel((state) =>
                props.filter((newId: GridRowId) => !state.includes(newId))
              );

              if (props.length) {
                const note = store.getState().note.entities[props[0]]
                if (note) reset({ content: note.content, mentionedEmails: note.mentionedEmails || "", targets: note.targets?.map(t => t.value.toUpperCase()) })
              } else {
                reset(defaultValues)
              }

              console.log(props)
            }}
              rowSelectionModel={selectionModel}
              getRowId={r => r.noteId} rows={profileNotes} columns={columns} sx={{ mt: 7 }} />
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default ProfileNotes

