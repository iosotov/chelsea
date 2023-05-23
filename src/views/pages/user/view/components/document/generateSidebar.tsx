import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
  Drawer,
  IconButton,
  Button
} from '@mui/material'
import { BoxProps } from '@mui/material'
import { styled } from '@mui/material'

import Icon from 'src/@core/components/icon'

type Props = {
  open: boolean
  toggle: () => void
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

export default function GenerateSidebar({ open, toggle }: Props) {
  return (
    <>
      <Drawer
        anchor='right'
        open={open}
        onClose={toggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
      >
        <Header>
          <Typography variant='h6'>Generate Document</Typography>
          <IconButton size='small' onClick={toggle} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 4 }}>
          <Box sx={{ mb: 8 }}>
            <FormControl fullWidth>
              <TextField label='Document Title' />
            </FormControl>
          </Box>
          <Box sx={{ mb: 8 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor='document-tempalte'>Document Template</InputLabel>
              <Select
                label='Document Template'
                labelId='document-tempalte'
                id='documentTemplate'
                defaultValue='select-template'
              >
                <MenuItem value='select-template' disabled>
                  Select Template
                </MenuItem>
                <MenuItem value='Cash'>POA(Debt)</MenuItem>
                <MenuItem value='Bank Transfer'>Debt Change Addendum</MenuItem>
                <MenuItem value='Credit'>Creditor Dispute</MenuItem>
                <MenuItem value='Debit'>EFT Form</MenuItem>
                <MenuItem value='Paypal'>Debit Card Only - Retainer Agreement</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ mb: 8 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor='e-sign'>E-sign Service</InputLabel>
              <Select label='E-sign Service' labelId='e-sign' id='esign' defaultValue='select-service'>
                <MenuItem value='select-service' disabled>
                  Select Service
                </MenuItem>
                <MenuItem value='Cash'>BoldSign</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant='outlined' color='secondary' onClick={toggle}>
              Cancel
            </Button>
            <Button variant='outlined' onClick={toggle}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
