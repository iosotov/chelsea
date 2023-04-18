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

const ProfileNotes = () => {
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor='payment-method'>Choose..</InputLabel>
              <Select
                label='Select Template'
                labelId='payment-method'
                id='payment-method-select'
                defaultValue='select-method'
              >
                <MenuItem value='select-method' disabled>
                  Select Template
                </MenuItem>
                <MenuItem value='Cash'>Credit Card Template</MenuItem>
                <MenuItem value='Bank Transfer'>Test Template</MenuItem>
                <MenuItem value='Credit'>Test 2</MenuItem>
                <MenuItem value='Debit'>Debit</MenuItem>
                <MenuItem value='Paypal'>Paypal</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select label='Type' defaultValue='General'>
                <MenuItem value='australia'>General</MenuItem>
                <MenuItem value='canada'>New</MenuItem>
                <MenuItem value='france'>France</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Notify to Users</InputLabel>
              <Select label='Notify to Users' defaultValue='User1'>
                <MenuItem value='australia'>User1</MenuItem>
                <MenuItem value='canada'>Joe TEst</MenuItem>
                <MenuItem value='france'>Admin</MenuItem>
                <MenuItem value='united-kingdom'>United Kingdom</MenuItem>
                <MenuItem value='united-states'>United States</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='CC Emails' placeholder='Emails' />
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField rows={6} multiline fullWidth label='Note' placeholder='Note' />
          </Grid>

          <Grid item xs={12} textAlign={'right'}>
            <Button type='submit' variant='contained' sx={{ mr: 4 }}>
              Create Note
            </Button>
            <Button variant='outlined' color='secondary'>
              Clear Form
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* <Box sx={{ height: 50, width: '100%' }}>
        {' '}
        <Button
          size='medium'
          type='submit'
          variant='contained'
          color='secondary'
          sx={{ mb: 7, position: 'absolute', right: '8%' }}
        >
          Create Task
        </Button>
      </Box> */}

      <br></br>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} checkboxSelection sx={{ mt: 7 }} />
      </Box>
    </>
  )
}

export default ProfileNotes
