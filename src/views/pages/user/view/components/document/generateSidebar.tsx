import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
  Drawer,
  IconButton,
  Button
} from '@mui/material'
import { BoxProps } from '@mui/material'
import { styled } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import { usePostDocumentGenerateMutation, usePostTemplateSearchQuery } from 'src/store/api/apiHooks'
import { DocumentGenerateType } from 'src/store/api/documentApiSlice'
import { useAppSelector } from 'src/store/hooks'
import { store } from 'src/store/store'
import { selectTemplatesByType } from 'src/store/templateSlice'

type Props = {
  open: boolean
  toggle: () => void
  profileId: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

export default function GenerateSidebar({ open, toggle, profileId }: Props) {


  const { control, handleSubmit, setValue, reset } = useForm<DocumentGenerateType>({ defaultValues: { templateId: "", title: "", esignService: "", profileId } })

  const { isSuccess: templateSuccess } = usePostTemplateSearchQuery({})
  const [generateDoc, { isLoading }] = usePostDocumentGenerateMutation()
  const noteTemplates = useAppSelector(state => selectTemplatesByType(state, 3))

  async function onSubmit(data: DocumentGenerateType) {
    const { profileId, templateId, title } = data
    const success = await generateDoc({ profileId, templateId, title })
    if (success) {
      toast.success("You successfully generate a document for profile")
      handleClose()
    }
  }

  function handleClose() {
    reset({ templateId: "", title: "", esignService: "", profileId })
    toggle()

  }

  return (
    <>
      <Drawer
        anchor='right'
        open={open}
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
      >
        <Header>
          <Typography variant='h6'>Generate Document</Typography>
          <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 8 }}>
              <FormControl fullWidth>
                <Controller
                  name='title'
                  control={control}
                  render={({ field }) => {

                    return <TextField disabled={isLoading} label='Document Title' {...field} />
                  }}

                />
              </FormControl>
            </Box>
            <Box sx={{ mb: 8 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor='document-template'>Document Template</InputLabel>
                <Controller
                  name='templateId'
                  control={control}
                  render={({ field: { onChange, ...rest } }) => {
                    return (
                      <Select
                        label='Document Template'
                        labelId='document-template'
                        disabled={isLoading}
                        onChange={e => {
                          const template = store.getState().template.entities[e.target.value]
                          if (template) setValue("title", template.title, { shouldValidate: true })
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
            </Box>
            <Box sx={{ mb: 8 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor='esignService'>Esign Service</InputLabel>
                <Controller
                  name='esignService'
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        label='E-sign Service'
                        labelId='esignService'
                        disabled
                        {...field}
                      >

                        <MenuItem value={""}>BoldSign</MenuItem>
                      </Select>)
                  }}
                />
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button disabled={isLoading} variant='outlined' color='secondary' onClick={handleClose}>
                Cancel
              </Button>
              <Button disabled={isLoading} variant='outlined' type='submit' >
                Confirm
              </Button>
            </Box>
          </Box>
        </form>
      </Drawer>
    </>
  )
}
