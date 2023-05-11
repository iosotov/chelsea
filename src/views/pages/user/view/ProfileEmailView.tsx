import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Card from '@mui/material/Card'

import Dialog from '@mui/material/Dialog'

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

import { Ref, useState, ChangeEvent, useEffect, forwardRef, ReactElement, ForwardedRef } from 'react'

import HistoryTable from 'src/views/pages/user/view/components/history/HistoryTable'

export default function ProfileEmail({ id }: any) {
  console.log(id)
  const profileId = id

  const [template, setTemplate] = useState<any>(null)
  const [sendTo, setSendTo] = useState<any>(null)
  const [sendFrom, setSendFrom] = useState<any>(null)
  const [subject, setSubject] = useState<any>(null)
  const [message, setMessage] = useState<any>(null)
  const [showDialog, setShowDialog] = useState<any>(false)
  const rows = []

  return (
    // <>
    //   <Box sx={{ height: 400, width: '100%' }}>
    //     <Typography variant='h5'> Email</Typography>
    //     {/* <DataGrid rows={rows} columns={columns} checkboxSelection /> */}
    //     <HistoryTable></HistoryTable>
    //   </Box>
    // </>
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <Box sx={{ height: 50, width: '100%' }}> */}
        <Typography variant='h5'>Emails</Typography>

        <Button
          size='medium'
          type='submit'
          variant='contained'
          color='secondary'
          sx={{ mb: 7, position: 'absolute', right: '12%' }}
          onClick={() => setShowDialog(true)}

          // disabled={checkedValues.length > 1}
        >
          Compose Email
        </Button>
      </Grid>
      <Grid item xs={12}>
        <HistoryTable></HistoryTable>
      </Grid>
      <Dialog fullWidth open={showDialog} maxWidth='md' scroll='body' onClose={() => setShowDialog(false)}>
        <DialogContent
          sx={{
            position: 'relative',
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Card>
            <CardHeader title='Create Email' />
            <CardContent>
              <form onSubmit={''}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField fullWidth label='Template' placeholder='Template' />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <TextField label='To' placeholder='Send To...' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label='From' placeholder='Recieve from...' />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label='Subject' placeholder='Recieve from...' />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth rows={6} multiline label='' placeholder='Message' />
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
    </Grid>
  )
}
