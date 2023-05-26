import { ReactElement, useEffect } from 'react'

//MUI
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

//Dialog
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

//Forms
import { useForm } from 'react-hook-form'

//Types
import { GridRowId } from '@mui/x-data-grid'
import { SingleSelectOption } from 'src/types/forms/selectOptionTypes'

//API Hooks
import { useAppSelector } from 'src/store/hooks'
import { usePostSettingSearchQuery } from 'src/store/api/apiHooks'

//API Slices
import { selectSettingByTypeOptions } from 'src/store/settingSlice'

//Custom Components
import SingleSelect from 'src/views/shared/form-input/single-select'
import SelectDate from 'src/views/shared/form-input/date-picker'
import TextInput from 'src/views/shared/form-input/text-input'
import ToggleSwitch from 'src/views/shared/form-input/toggle-switch'

//Dropdown Options
import { stateOptions } from 'src/views/shared/options/shared'

type DebtDialogProps = {
  selected: GridRowId[]
  open: boolean
  handleClose: () => void
}

const enrolledOptions = [
  {
    label: 'Yes',
    value: true
  },
  {
    label: 'No',
    value: false
  }
]

export default function DebtsDialog({ selected, open, handleClose }: DebtDialogProps): ReactElement {
  // const liability = useAppSelector(state => selectLiabilityById(state, selected[0]))

  // console.log(liability)

  //Debt Types
  usePostSettingSearchQuery({ length: 10000, start: 0 }, { skip: !open })
  const debtOptions: SingleSelectOption[] = useAppSelector(state => selectSettingByTypeOptions(state, 4))

  const defaultValues = {}

  const debtForm = useForm(defaultValues)
  const {
    control,
    unregister,
    watch,
    getValues,
    handleSubmit,
    formState: { errors }
  } = debtForm

  const onSubmit = () => {
    console.log(getValues())
  }

  const onClose = () => {
    debtForm.reset()
    handleClose()
  }

  const legalStatus = watch('legalStatus')

  //used to toggle casenumber && courtname fields
  useEffect(() => {
    if (!legalStatus) {
      unregister(['caseNumber', 'courtName'])
    }
  }, [legalStatus])

  return (
    <Dialog open={open} maxWidth='xl' fullWidth onClose={onClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>
        Edit Debt
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container sx={{ my: 1 }} spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
            <SingleSelect name='type' label='Debt Type' control={control} options={debtOptions} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SingleSelect name='enrolled' label='Enrolled?' control={control} disabled options={enrolledOptions} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='currentCreditor' label='Current Creditor' control={control} errors={errors} required />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='name' disabled label='Original Creditor' control={control} errors={errors} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='currentAccountNumber' label='Current Account Number' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='accountNumber' label='Original Account Number' disabled control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='currentBalance' label='Current Balance' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput
              name='originalBalance'
              label='Original Balance'
              InputProps={{ readOnly: true }}
              control={control}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectDate name='currentPayment' label='Current Payment Date' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectDate name='lastPayment' label='Last Payment Date' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='currentPaymentAmount' label='Current Payment Amount' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='accountStatus' label='Account Status' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='thirdPartyAccountNumber' label='Third Party Account #' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='thirtyDaysLateCount' label='Thirty Days Late Count' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='sixtyDaysLateCount' label='Sixty Days Late Count' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='nintyDaysLateCount' label='Ninety Days Late Count' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='address1' label='Address' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='address2' label='Address 2' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='city' label='City' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='zipCode' label='Zipcode' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SingleSelect name='state' label='State' control={control} options={stateOptions} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectDate name='courtDate' label='Court Date' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectDate name='responseDate' label='Response Date' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectDate name='inquirtyDate' label='Inquiry Date' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectDate name='reportDate' label='Report Date' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectDate name='openedDate' label='Opened Date' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='term' label='Term' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='highestBalance' label='Highest Balance' control={control} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ToggleSwitch
              name='legalStatus'
              label='Active Legal File'
              control={control}
              labelBefore='No'
              labelAfter='Yes'
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ToggleSwitch
              name='summon'
              label='Court Summons Received'
              control={control}
              labelBefore='No'
              labelAfter='Yes'
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ToggleSwitch
              name='judgement'
              label='Court Judgement Received'
              control={control}
              labelBefore='No'
              labelAfter='Yes'
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ToggleSwitch
              name='garnishment'
              label='Garnishment Received'
              control={control}
              labelBefore='No'
              labelAfter='Yes'
            />
          </Grid>
          {legalStatus && (
            <>
              <Grid item xs={12} md={6} lg={3}>
                <TextInput name='caseNumber' label='Case Number' control={control} errors={errors} required />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <TextInput name='courtName' label='Court Name' control={control} errors={errors} required />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button size='small' onClick={onClose}>
          Cancel
        </Button>
        <Button size='small' variant='outlined' onClick={handleSubmit(onSubmit)}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
