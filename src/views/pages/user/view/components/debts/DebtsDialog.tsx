import { ReactElement, useEffect, useRef } from 'react'

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
import { LiabilityUpdateType } from 'src/store/api/liabilityApiSlice'

//API Hooks
import { useAppSelector } from 'src/store/hooks'
import { useGetLiabilityQuery, usePostSettingSearchQuery, usePutLiabilityUpdateMutation } from 'src/store/api/apiHooks'

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

type ViewDebtValues = {
  name: string
  originalBalance?: number
  type: string
  accountNumber?: string
  currentPayment?: string | number
  accountStatus?: string
  openedDate?: Date
  term?: number
  highestBalance?: number
  lastPayment?: Date
  inquiryDate?: Date
  reportDate?: Date
  thirtyDaysLateCount?: string
  sixtyDaysLateCount?: string
  nintyDaysLateCount?: string
  enrolled?: boolean
  profileId: string
  profileFirstName?: string
  profileLastName?: string
  currentBalance?: number
  currentCreditor?: string
  currentAccountNumber?: string
  thirdPartyAccountNumber?: string
  currentPaymentAmount?: number
  legalStatus?: boolean
  summon?: boolean
  judgement?: boolean
  garnishment?: boolean
  address1?: string
  address2?: string
  city?: string
  zipCode?: string
  state?: string
  caseNumber?: string
  courtName?: string
  courtDate?: Date
  responseDate?: Date
}

const baseValues: ViewDebtValues = {
  name: '',
  originalBalance: undefined,
  type: '',
  accountNumber: undefined,
  currentPayment: undefined,
  accountStatus: undefined,
  openedDate: undefined,
  term: undefined,
  highestBalance: undefined,
  lastPayment: undefined,
  inquiryDate: undefined,
  reportDate: undefined,
  thirtyDaysLateCount: undefined,
  sixtyDaysLateCount: undefined,
  nintyDaysLateCount: undefined,
  enrolled: false,
  profileId: '',
  profileFirstName: undefined,
  profileLastName: undefined,
  currentBalance: undefined,
  currentCreditor: undefined,
  currentAccountNumber: undefined,
  thirdPartyAccountNumber: undefined,
  currentPaymentAmount: undefined,
  legalStatus: false,
  summon: false,
  judgement: false,
  garnishment: false,
  address1: undefined,
  address2: undefined,
  city: undefined,
  zipCode: undefined,
  state: undefined,
  caseNumber: undefined,
  courtName: undefined,
  courtDate: undefined,
  responseDate: undefined
}

export default function DebtsDialog({ selected, open, handleClose }: DebtDialogProps): ReactElement {
  const { data: liability } = useGetLiabilityQuery(selected[0] as string, { skip: !open })

  //Debt Types
  usePostSettingSearchQuery({ length: 10000, start: 0 }, { skip: !open })
  const debtOptions: SingleSelectOption[] = useAppSelector(state => selectSettingByTypeOptions(state, 4))

  const [editLiability, { isLoading }] = usePutLiabilityUpdateMutation()

  const defaultValues = useRef<ViewDebtValues>(baseValues)

  const debtForm = useForm({ defaultValues: defaultValues.current })
  const {
    control,
    unregister,
    watch,
    getValues,
    handleSubmit,
    reset,
    formState: { errors }
  } = debtForm

  useEffect(() => {
    if (liability) {
      const { openedDate, lastPayment, inquiryDate, reportDate, courtDate, responseDate } = liability
      reset({
        ...liability,
        openedDate: openedDate ? new Date(openedDate) : undefined,
        lastPayment: lastPayment ? new Date(lastPayment) : undefined,
        inquiryDate: inquiryDate ? new Date(inquiryDate) : undefined,
        reportDate: reportDate ? new Date(reportDate) : undefined,
        courtDate: courtDate ? new Date(courtDate) : undefined,
        responseDate: responseDate ? new Date(responseDate) : undefined
      })
    }
  }, [liability, reset])

  const onSubmit = () => {
    if (!liability) return

    const editData: LiabilityUpdateType = {
      liabilityId: liability.liabilityId,
      name: getValues('name'),
      originalBalance: getValues('originalBalance'),
      type: getValues('type'),
      lastPayment: getValues('lastPayment'),
      profileId: liability.profileId,
      currentBalance: getValues('currentBalance'),
      currentCreditor: getValues('currentCreditor'),
      currentAccountNumber: getValues('currentAccountNumber'),
      legalStatus: getValues('legalStatus'),
      summon: getValues('summon'),
      judgement: getValues('judgement'),
      garnishment: getValues('garnishment'),
      address1: getValues('address1'),
      address2: getValues('address2'),
      city: getValues('city'),
      zipCode: getValues('zipCode'),
      state: getValues('state'),
      caseNumber: getValues('caseNumber'),
      courtName: getValues('courtName'),
      courtDate: getValues('courtDate'),
      responseDate: getValues('responseDate')
    }

    editLiability(editData)
      .unwrap()
      .then(res => {
        if (res) {
          onClose()
        }
      })
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
  }, [legalStatus, unregister])

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
            <ToggleSwitch
              name='enrolled'
              label='Enrolled?'
              control={control}
              labelBefore='No'
              labelAfter='Yes'
              disabled
            />
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
            <TextInput name='accountNumber' label='Original Account Number' control={control} disabled />
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
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectDate name='currentPayment' label='Current Payment Date' control={control} isClearable disabled />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectDate name='lastPayment' label='Last Payment Date' control={control} isClearable />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='currentPaymentAmount' label='Current Payment Amount' control={control} disabled />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='accountStatus' label='Account Status' control={control} disabled />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='thirdPartyAccountNumber' label='Third Party Account #' control={control} disabled />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='thirtyDaysLateCount' label='Thirty Days Late Count' control={control} disabled />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='sixtyDaysLateCount' label='Sixty Days Late Count' control={control} disabled />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='nintyDaysLateCount' label='Ninety Days Late Count' control={control} disabled />
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
            <SelectDate name='courtDate' label='Court Date' control={control} isClearable />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectDate name='responseDate' label='Response Date' control={control} isClearable />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectDate name='inquiryDate' label='Inquiry Date' control={control} isClearable disabled />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectDate name='reportDate' label='Report Date' control={control} isClearable disabled />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectDate name='openedDate' label='Opened Date' control={control} isClearable disabled />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='term' label='Term' control={control} disabled />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextInput name='highestBalance' label='Highest Balance' control={control} disabled />
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
        <Button disabled={isLoading} size='small' variant='outlined' onClick={handleSubmit(onSubmit)}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
