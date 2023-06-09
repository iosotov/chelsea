// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { FieldErrors, UseFormClearErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { UploadFormValueType } from '../../ProfileDocumentsView'
import { FormHelperText } from '@mui/material'

interface FileProp {
  name: string
  type: string
  size: number
}

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(15.75)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 160
  }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

interface FileUploaderSingleProps {
  setValue: UseFormSetValue<UploadFormValueType>
  watch: UseFormWatch<UploadFormValueType>
  errors: FieldErrors<UploadFormValueType>
  clearErrors: UseFormClearErrors<UploadFormValueType>
}

const FileUploaderSingle = ({ setValue, watch, errors, clearErrors }: FileUploaderSingleProps) => {
  // ** State
  const files = watch("file")

  console.log(errors)

  // ** Hook
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        setValue("file", acceptedFiles.map((file: File) => Object.assign(file)))
        clearErrors("file")
      }
    }
  })

  const img = files.map((file: FileProp) => (
    <Img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} />
  ))

  return (
    <Box {...getRootProps({ className: 'dropzone' })} sx={files.length ? { height: 450 } : {}}>
      <input {...getInputProps()} />
      {files.length ? (
        img
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: ['column', 'column', 'row'],
            alignItems: 'center',
            border: 1,
            borderRadius: 1
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 'auto', py: 8 }}>
            <HeadingTypography variant='h5'>Drop files here or click to upload.</HeadingTypography>
            <Typography color='textSecondary' sx={{ '& a': { color: 'primary.main', textDecoration: 'none' } }}>
              Drop files here or click{' '}
              <Link href='/' onClick={e => e.preventDefault()}>
                browse
              </Link>{' '}
              thorough your machine
            </Typography>
          </Box>

        </Box>
      )}
      <Box sx={{ mt: 1, ml: 4 }}>
        {errors.file
          ? (
            <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
              {errors.file?.message || "Required"}
            </FormHelperText>
          )
          : null}
      </Box>
    </Box>
  )
}

export default FileUploaderSingle
