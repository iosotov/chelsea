import { ReactElement, useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import EditPaymentDialog from './EditPaymentDialog'

import { ThemeColor } from 'src/@core/layouts/types'

interface CardDataType {
  name: string
  type: number
  securityCode: string
  expirationDate: string
  cardNumber: string
  status?: string
  badgeColor?: ThemeColor
  paymentType: 'card'
  address: string
  address2?: string
  city: string
  state: string
  zipCode: string
}
interface BankDataType {
  bankAccountNumber: string
  bankName: string
  bankRoutingNumber: string
  bankAccountName: string
  bankAccountType: number
  status?: string
  badgeColor?: ThemeColor
  paymentType: 'ach'
  address: string
  address2?: string
  city: string
  state: string
  zipCode: string
}

const PaymentCard = ({
  item,
  index,
  paymentData
}: {
  item: BankDataType | CardDataType
  index: number
  paymentData: (BankDataType | CardDataType)[]
}): ReactElement => {
  const [editModal, setEditModal] = useState<boolean>(false)
  const [paymentModal, setPaymentModal] = useState<boolean>(false)
  const [dialogData, setDialogData] = useState<(BankDataType | CardDataType)[]>(paymentData)

  const toggleEdit = () => setEditModal(!editModal)

  const handleEdit = (index: number) => {
    setDialogData(paymentData[index])
    toggleEdit()
  }

  return (
    <>
      <Box
        key={'payments ' + index}
        sx={{
          p: 5,
          display: 'flex',
          borderRadius: 1,
          flexDirection: ['column', 'row'],
          justifyContent: ['space-between'],
          alignItems: ['flex-start', 'center'],
          mb: index !== paymentData.length - 1 ? 4 : undefined,
          border: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Icon icon={item.paymentType === 'card' ? 'material-symbols:credit-card-outline' : 'mdi:bank-outline'} />
            <Typography component='h6'>
              {item.paymentType === 'card' ? 'Card' : `Bank - ${item.bankAccountType ? 'Checking' : 'Savings'} Account`}
            </Typography>
          </Box>
          <Box sx={{ mt: 1, mb: 2.5, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 600 }}>
              {item.paymentType === 'card' ? item.name : item.bankAccountName}
            </Typography>
            {item.status ? (
              <CustomChip skin='light' size='small' sx={{ ml: 4 }} label={item.status} color={item.badgeColor} />
            ) : null}
          </Box>
          <Typography variant='body2'>
            {item.paymentType === 'card'
              ? '**** **** **** ' + item.cardNumber.substring(item.cardNumber.length - 4)
              : '*********' + item.bankAccountNumber.substring(item.bankAccountNumber.length - 4)}
          </Typography>
        </Box>
        <Box sx={{ mt: [3, 0], textAlign: ['start', 'end'] }}>
          <Button variant='outlined' sx={{ mr: 4 }} onClick={() => handleEdit(index)}>
            Edit
          </Button>
          <Button variant='outlined' color='secondary'>
            Delete
          </Button>
          <Typography variant='caption' sx={{ mt: 4, display: 'block' }}>
            {item.paymentType === 'card' ? `Card expires at ${item.expirationDate}` : null}
          </Typography>
        </Box>
      </Box>
      <EditPaymentDialog open={editModal} handleClose={toggleEdit} data={dialogData} />
    </>
  )
}

export default PaymentCard
