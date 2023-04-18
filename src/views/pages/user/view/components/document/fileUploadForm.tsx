import { Box, FormControl, InputLabel, Select, MenuItem, Typography, Grid, TextField } from '@mui/material'

export default function FileUploadForm() {
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <FormControl fullWidth>
            <TextField label='Document Title' />
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor='document-type'>Document Type</InputLabel>
            <Select label='Document Type' labelId='document-type' id='documentType' defaultValue='select-type'>
              <MenuItem value='select-type' disabled>
                Select Type
              </MenuItem>
              <MenuItem value='Cash'>120 Day</MenuItem>
              <MenuItem value='Bank Transfer'>test</MenuItem>
              <MenuItem value='Credit'>Name of Task</MenuItem>
              <MenuItem value='Debit'>Task1</MenuItem>
              <MenuItem value='Paypal'>Paypal</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextField rows={5} multiline label='Document Description' />
          </FormControl>
        </Grid>
      </Grid>
    </>
  )
}
