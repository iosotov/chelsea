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

export default function CreateBudgetDrawer({ open, toggle }: Props) {
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
          <Typography variant='h6'>Create Budget</Typography>
          <IconButton size='small' onClick={toggle} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 4 }}>
          <Box sx={{ mb: 8 }}>
            <FormControl fullWidth>
              <TextField label='Budget Name' />
            </FormControl>
          </Box>
          <Box sx={{ mb: 8 }}>
            <FormControl fullWidth>
              <TextField label='Description' />
            </FormControl>
          </Box>
          <Box sx={{ mb: 8 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor='document-tempalte'>Budget Type</InputLabel>
              <Select
                label='Budget Type'
                labelId='document-tempalte'
                id='documentTemplate'
                defaultValue='select-template'
              >
                <MenuItem value='select-template' disabled>
                  Choose
                </MenuItem>
                <MenuItem value='0'>Income</MenuItem>
                <MenuItem value='1'>Expense</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant='outlined' color='secondary' onClick={toggle}>
              Cancel
            </Button>
            <Button variant='outlined' onClick={toggle}>
              Create
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
