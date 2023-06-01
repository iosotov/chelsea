import { FormControl, InputLabel, Select, MenuItem, Grid, TextField, FormHelperText } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { UploadFormValueType } from '../../ProfileDocumentsView'
import { usePostSettingSearchQuery } from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectSettingByType } from 'src/store/settingSlice'

interface FileUploadedFormProps {
  control: Control<UploadFormValueType, any>,
  errors: FieldErrors<UploadFormValueType>,
}

export default function FileUploadForm({ control, errors }: FileUploadedFormProps) {

  usePostSettingSearchQuery({})
  const categories = useAppSelector(state => selectSettingByType(state, 8))

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <FormControl fullWidth>
            <Controller
              name='title'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Required"
                }
              }}
              render={({ field }) => (
                <TextField label='Title' error={Boolean(errors.title)} {...field} />
              )}
            />
            {errors.title && (
              <FormHelperText sx={{ color: 'error.main' }} >
                This field is required
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor='category'>Category</InputLabel>
            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  label="Category"
                  labelId='category'
                  id='category'
                  error={Boolean(errors.category)}
                  {...field}
                >
                  <MenuItem value={""} disabled>
                    Select Category
                  </MenuItem>
                  {categories.map(c => {

                    return (
                      <MenuItem key={c.id} value={c.value}>{c.name}</MenuItem>
                    )
                  })}

                </Select>
              )}
            />
            {errors.category && (
              <FormHelperText sx={{ color: 'error.main' }}>
                This field is required
              </FormHelperText>
            )}

          </FormControl>
        </Grid>
        <Grid item xs={12} lg={12}>
          <FormControl fullWidth>
            <Controller
              name='description'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Required"
                }
              }}
              render={({ field }) => (
                <TextField label='Description' multiline rows={4} error={Boolean(errors.description)} {...field} />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }} >
                This field is required
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </>
  )
}
