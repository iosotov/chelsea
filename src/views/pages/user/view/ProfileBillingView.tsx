// ** React Imports
import { useState, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LinearProgress from '@mui/material/LinearProgress'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import Payment from 'payment'
import Cards, { Focused } from 'react-credit-cards'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Styled Component Imports
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

interface DataType {
  name: string
  imgSrc: string
  imgAlt: string
  cardCvc: string
  expiryDate: string
  cardNumber: string
  cardStatus?: string
  badgeColor?: ThemeColor
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

const data: DataType[] = [
  {
    cardCvc: '587',
    name: 'Tom McBride',
    expiryDate: '12/24',
    imgAlt: 'Mastercard',
    badgeColor: 'primary',
    cardStatus: 'Primary',
    cardNumber: '5577 0000 5577 9865',
    imgSrc: '/images/logos/mastercard.png'
  },
  {
    cardCvc: '681',
    imgAlt: 'Visa card',
    expiryDate: '02/24',
    name: 'Mildred Wagner',
    cardNumber: '4532 3616 2070 5678',
    imgSrc: '/images/logos/visa.png'
  },
  {
    cardCvc: '3845',
    expiryDate: '08/20',
    badgeColor: 'error',
    cardStatus: 'Expired',
    name: 'Lester Jennings',
    imgAlt: 'American Express card',
    cardNumber: '3700 000000 00002',
    imgSrc: '/images/logos/american-express.png'
  }
]

const ProfileBilling = () => {
  // ** States
  const [cvc, setCvc] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [focus, setFocus] = useState<Focused>()
  const [cardId, setCardId] = useState<number>(0)
  const [expiry, setExpiry] = useState<string>('')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [dialogTitle, setDialogTitle] = useState<string>('Add')
  const [openEditCard, setOpenEditCard] = useState<boolean>(false)
  const [openAddressCard, setOpenAddressCard] = useState<boolean>(false)

  // const [openUpgradePlans, setOpenUpgradePlans] = useState<boolean>(false)
  // const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)

  // Handle Edit Card dialog and get card ID
  const handleEditCardClickOpen = (id: number) => {
    setDialogTitle('Edit')
    setCardId(id)
    setCardNumber(data[id].cardNumber)
    setName(data[id].name)
    setCvc(data[id].cardCvc)
    setExpiry(data[id].expiryDate)
    setOpenEditCard(true)
  }

  const handleAddCardClickOpen = () => {
    setDialogTitle('Add')
    setCardNumber('')
    setName('')
    setCvc('')
    setExpiry('')
    setOpenEditCard(true)
  }

  const handleEditCardClose = () => {
    setDialogTitle('Add')
    setCardNumber('')
    setName('')
    setCvc('')
    setExpiry('')
    setOpenEditCard(false)
  }

  // Handle Upgrade Plan dialog
  // const handleUpgradePlansClickOpen = () => setOpenUpgradePlans(true)
  // const handleUpgradePlansClose = () => setOpenUpgradePlans(false)

  const handleBlur = () => setFocus(undefined)

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value, Payment)
      setCardNumber(target.value)
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value)
      setExpiry(target.value)
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value, cardNumber, Payment)
      setCvc(target.value)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ mt: 1, mb: 2.5, display: 'flex', alignItems: 'center', width: 1, gap: 3 }}>
          {/* <Card sx={{ width: 1 / 3, mr: 'auto' }}>
            <CardHeader title='Enrolled Debts'></CardHeader>
            <CardContent>
              <Typography variant='body2'>2 of 10</Typography>
            </CardContent>

          </Card> */}
          <Card sx={{ width: 1 / 3, mr: 'auto' }}>
            <CardContent>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='body2'>{`Enrolled Debts`}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography variant='h6'>1 of 10 Enrolled</Typography>
                  {/* <Typography variant='body2' sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    Edit Role
                  </Typography> */}
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ width: 1 / 3, mr: 'auto' }}>
            <CardContent>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='body2'>{`Enrolled Debts`}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography variant='h6'>1 of 10 Enrolled</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ width: 1 / 3, mr: 'auto' }}>
            <CardContent>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='body2'>{`Total Enrolled Balance`}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography variant='h6'>$999,999,999</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Payment Methods'
            action={
              <Button variant='contained' onClick={handleAddCardClickOpen} sx={{ '& svg': { mr: 1 } }}>
                <Icon icon='mdi:plus' fontSize='1.125rem' />
                Add Card
              </Button>
            }
          />
          <CardContent>
            {data.map((item: DataType, index: number) => (
              <Box
                key={index}
                sx={{
                  p: 5,
                  display: 'flex',
                  borderRadius: 1,
                  flexDirection: ['column', 'row'],
                  justifyContent: ['space-between'],
                  alignItems: ['flex-start', 'center'],
                  mb: index !== data.length - 1 ? 4 : undefined,
                  border: theme => `1px solid ${theme.palette.divider}`
                }}
              >
                <div>
                  <img height='25' alt={item.imgAlt} src={item.imgSrc} />
                  <Box sx={{ mt: 1, mb: 2.5, display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                    {item.cardStatus ? (
                      <CustomChip
                        skin='light'
                        size='small'
                        sx={{ ml: 4 }}
                        label={item.cardStatus}
                        color={item.badgeColor}
                      />
                    ) : null}
                  </Box>
                  <Typography variant='body2'>
                    **** **** **** {item.cardNumber.substring(item.cardNumber.length - 4)}
                  </Typography>
                </div>

                <Box sx={{ mt: [3, 0], textAlign: ['start', 'end'] }}>
                  <Button variant='outlined' sx={{ mr: 4 }} onClick={() => handleEditCardClickOpen(index)}>
                    Edit
                  </Button>
                  <Button variant='outlined' color='secondary'>
                    Delete
                  </Button>
                  <Typography variant='caption' sx={{ mt: 4, display: 'block' }}>
                    Card expires at {item.expiryDate}
                  </Typography>
                </Box>
              </Box>
            ))}
          </CardContent>

          <Dialog
            open={openEditCard}
            onClose={handleEditCardClose}
            aria-labelledby='user-view-billing-edit-card'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            aria-describedby='user-view-billing-edit-card-description'
          >
            <DialogTitle
              id='user-view-billing-edit-card'
              sx={{
                textAlign: 'center',
                fontSize: '1.5rem !important',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              {dialogTitle} Card
            </DialogTitle>
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(5)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
              }}
            >
              <DialogContentText
                variant='body2'
                id='user-view-billing-edit-card-description'
                sx={{ textAlign: 'center', mb: 7 }}
              >
                {dialogTitle} card for future billing
              </DialogContentText>
              <form>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <CardWrapper sx={{ '& .rccs': { m: '0 auto' } }}>
                      <Cards cvc={cvc} focused={focus} expiry={expiry} name={name} number={cardNumber} />
                    </CardWrapper>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={6}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name='number'
                          value={cardNumber}
                          autoComplete='off'
                          label='Card Number'
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                          placeholder='0000 0000 0000 0000'
                          onFocus={e => setFocus(e.target.name as Focused)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          fullWidth
                          name='name'
                          value={name}
                          autoComplete='off'
                          onBlur={handleBlur}
                          label='Name on Card'
                          placeholder='John Doe'
                          onChange={e => setName(e.target.value)}
                          onFocus={e => setFocus(e.target.name as Focused)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          name='expiry'
                          label='Expiry'
                          value={expiry}
                          onBlur={handleBlur}
                          placeholder='MM/YY'
                          onChange={handleInputChange}
                          inputProps={{ maxLength: '5' }}
                          onFocus={e => setFocus(e.target.name as Focused)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <FormControl fullWidth>
                          <InputLabel id='user-view-billing-edit-card-status-label'>Card Status</InputLabel>
                          <Select
                            label='Card Status'
                            id='user-view-billing-edit-card-status'
                            labelId='user-view-billing-edit-card-status-label'
                            defaultValue={data[cardId].cardStatus ? data[cardId].cardStatus : ''}
                          >
                            <MenuItem value='Primary'>Primary</MenuItem>
                            <MenuItem value='Expired'>Expired</MenuItem>
                            <MenuItem value='Active'>Active</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          name='cvc'
                          label='CVC'
                          value={cvc}
                          autoComplete='off'
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                          onFocus={e => setFocus(e.target.name as Focused)}
                          placeholder={Payment.fns.cardType(cardNumber) === 'amex' ? '1234' : '123'}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label='Save Card for future billing?'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditCardClose}>
                Submit
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleEditCardClose}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Billing Address'
            action={
              <Button variant='contained' onClick={() => setOpenAddressCard(true)}>
                Edit Address
              </Button>
            }
          />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} lg={6}>
                <TableContainer>
                  <Table size='small' sx={{ width: '95%' }}>
                    <TableBody
                      sx={{
                        '& .MuiTableCell-root': {
                          border: 0,
                          pt: 2,
                          pb: 2.5,
                          pl: '0 !important',
                          pr: '0 !important',
                          '&:first-of-type': {
                            width: 148
                          }
                        }
                      }}
                    >
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Company Name:
                          </Typography>
                        </TableCell>
                        <TableCell>ThemeSelection</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Billing Email:
                          </Typography>
                        </TableCell>
                        <TableCell>gertrude@gmail.com</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Tax ID:
                          </Typography>
                        </TableCell>
                        <TableCell>TAX-875623</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            VAT Number:
                          </Typography>
                        </TableCell>
                        <TableCell>SDF754K77</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Billing Address:
                          </Typography>
                        </TableCell>
                        <TableCell>100 Water Plant Avenue, Building 1303 Wake Island</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} lg={6}>
                <TableContainer>
                  <Table size='small'>
                    <TableBody
                      sx={{
                        '& .MuiTableCell-root': {
                          border: 0,
                          pt: 2,
                          pb: 2.5,
                          pl: '0 !important',
                          pr: '0 !important',
                          '&:first-of-type': {
                            width: 148
                          }
                        }
                      }}
                    >
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Contact:
                          </Typography>
                        </TableCell>
                        <TableCell>+1(609) 933-44-22</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Country:
                          </Typography>
                        </TableCell>
                        <TableCell>Australia</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            State:
                          </Typography>
                        </TableCell>
                        <TableCell>Queensland</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Zip Code:
                          </Typography>
                        </TableCell>
                        <TableCell>403114</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </CardContent>

          <Dialog
            open={openAddressCard}
            onClose={() => setOpenAddressCard(false)}
            aria-labelledby='user-address-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            aria-describedby='user-address-edit-description'
          >
            <DialogTitle
              id='user-address-edit'
              sx={{
                textAlign: 'center',
                fontSize: '1.5rem !important',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              Edit Address
            </DialogTitle>
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
              }}
            >
              <DialogContentText variant='body2' id='user-address-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                Edit Address for future billing
              </DialogContentText>
              <form>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth defaultValue='ThemeSelection' label='Company Name' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth type='email' defaultValue='gertrude@gmail.com' label='Email' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth defaultValue='TAX-875623' label='Tax ID' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth defaultValue='SDF754K77' label='VAT Number' />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      label='Billing Address'
                      defaultValue='100 Water Plant Avenue, Building 1303 Wake Island'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth defaultValue='+1(609) 933-44-22' label='Contact' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id='country-select'>Country</InputLabel>
                      <Select labelId='country-select' defaultValue='usa' label='Country'>
                        <MenuItem value='usa'>USA</MenuItem>
                        <MenuItem value='uk'>UK</MenuItem>
                        <MenuItem value='france'>France</MenuItem>
                        <MenuItem value='germany'>Germany</MenuItem>
                        <MenuItem value='japan'>Japan</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth defaultValue='Capholim' label='State' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth type='number' defaultValue='403114' label='Zip Code' />
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' sx={{ mr: 2 }} onClick={() => setOpenAddressCard(false)}>
                Submit
              </Button>
              <Button variant='outlined' color='secondary' onClick={() => setOpenAddressCard(false)}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ProfileBilling
