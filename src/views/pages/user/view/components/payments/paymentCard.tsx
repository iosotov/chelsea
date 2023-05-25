import { ReactElement, useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import Icon from 'src/@core/components/icon'
import EditPaymentDialog from './EditPaymentDialog'

import { BankingOrCreditCardType } from 'src/store/bankAccountSlice'


const PaymentCard = ({
  item,
  index,
  paymentData
}: {
  item: BankingOrCreditCardType
  index: number
  paymentData: (BankingOrCreditCardType)[]
}): ReactElement => {
  const [editModal, setEditModal] = useState<boolean>(false)
  const [dialogData, setDialogData] = useState<(BankingOrCreditCardType)>(paymentData[index])

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
              {item.paymentType === 'card' ? item.name : item.bankName}
            </Typography>
            {/* {item.status ? (
              <CustomChip skin='light' size='small' sx={{ ml: 4 }} label={item.status} color={item.badgeColor} />
            ) : null} */}
          </Box>
          <Typography variant='body2'>
            {item.cardNumber && '**** **** **** ' + item.cardNumber.substring(item.cardNumber.length - 4)}
            {item.bankAccountNumber && '*********' + item.bankAccountNumber.substring(item.bankAccountNumber.length - 4)}
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
            {item.paymentType === 'card' ? `Card expires at ${item.expirationMonth}/${item.expYear}` : null}
          </Typography>
        </Box>
      </Box>
      <EditPaymentDialog open={editModal} handleClose={toggleEdit} data={dialogData} />
    </>
  )
}

export default PaymentCard
