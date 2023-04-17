// import { MouseEvent, SyntheticEvent, useState } from 'react';

import { Ref, useState, forwardRef, ReactElement } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'

import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'

// import DialogActions from '@mui/material/DialogActions'
// import FormControlLabel from '@mui/material/FormControlLabel'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

const defaultValues = {
  companyName: '',
  billingEmail: ''
}

const ModalView = () => {
  // const Transition = forwardRef(function Transition(
  //   props: FadeProps & { children?: ReactElement<any, any> },
  //   ref: Ref<unknown>
  // ) {
  //   return <Fade ref={ref} {...props} />
  // })

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })
  const [show, setShow] = useState<boolean>(false)

  const onSubmit = () => {
    return
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: true
    },
    {
      field: 'createdBy',
      headerName: 'Created By ',
      width: 150,
      editable: true
    },
    {
      field: 'description',
      headerName: 'Age',

      // type: 'text',
      width: 110,
      editable: true
    }

    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
    // }
  ]

  const rows = [
    { id: 1, type: 'Snow', createdBy: 'Jon', description: 35 },
    { id: 2, type: 'Lannister', createdBy: 'Cersei', description: 42 },
    { id: 3, type: 'Lannister', createdBy: 'Jaime', description: 45 },
    { id: 4, type: 'Stark', createdBy: 'Arya', description: 16 },
    { id: 5, type: 'Targaryen', createdBy: 'Daenerys', description: null },
    { id: 6, type: 'Melisandre', createdBy: null, description: 150 },
    { id: 7, type: 'Clifford', createdBy: 'Ferrara', description: 44 },
    { id: 8, type: 'Frances', createdBy: 'Rossini', description: 36 },
    { id: 9, type: 'Roxie', createdBy: 'Harvey', description: 65 }
  ]

  return (
    <>
      <Dialog fullWidth open={show} maxWidth='md' scroll='body' onClose={() => setShow(false)}>
        <DialogContent
          sx={{
            position: 'relative',
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Card>
            <CardHeader title='Create Task' />
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <Controller
                        name='companyName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label='Task Name'
                            onChange={onChange}
                            placeholder='ThemeSelection'
                            error={Boolean(errors.companyName)}
                          />
                        )}
                      />
                      {errors.companyName && (
                        <FormHelperText sx={{ color: 'error.main' }}>This field is required</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <Controller
                        control={control}
                        name='billingEmail'
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            type='email'
                            value={value}
                            onChange={onChange}
                            label='Due Date'
                            placeholder='john.doe@example.com'
                            error={Boolean(errors.billingEmail)}
                          />
                        )}
                      />
                      {errors.billingEmail && (
                        <FormHelperText sx={{ color: 'error.main' }}>This field is required</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='TAX ID' placeholder='Enter TAX ID' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='VAT Number' placeholder='Enter VAT Number' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type='number'
                      label='Phone Number'
                      placeholder='202 555 0111'
                      InputProps={{ startAdornment: <InputAdornment position='start'>US (+1)</InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Country</InputLabel>
                      <Select label='Country' defaultValue='australia'>
                        <MenuItem value='australia'>Australia</MenuItem>
                        <MenuItem value='canada'>Canada</MenuItem>
                        <MenuItem value='france'>France</MenuItem>
                        <MenuItem value='united-kingdom'>United Kingdom</MenuItem>
                        <MenuItem value='united-states'>United States</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label='Billing Address' placeholder='Billing Address' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='State' placeholder='California' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth type='number' label='Zip Code' placeholder='231465' />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type='submit' variant='contained' sx={{ mr: 4 }}>
                      Save Changes
                    </Button>
                    <Button variant='outlined' color='secondary'>
                      Discard
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
      <Box sx={{ height: 50, width: '100%' }}>
        {' '}
        <Button
          size='medium'
          type='submit'
          variant='contained'
          color='secondary'
          sx={{ mb: 7, position: 'absolute', right: '8%' }}
          onClick={() => setShow(true)}
        >
          Create Task
        </Button>
      </Box>

      <br></br>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} checkboxSelection sx={{ mt: 7 }} />
      </Box>
    </>
  )
}

export default ModalView
