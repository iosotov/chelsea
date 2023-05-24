import { MouseEvent, SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

import AddressSetting from './addresses'
import AssigneeSetting from './assignees'
import BudgetSetting from './budget'
import ContactsSetting from './contacts'
import LabelSetting from './label'

const ProfileSetting = () => {
  // ** State
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label='nav tabs example'>
        <Tab
          value='1'
          component='a'
          label='Addresses'
          href='/profileSetting/addresses'
          onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
        />
        <Tab
          value='2'
          component='a'
          label='Contacts'
          href='/profileSetting/contacts'
          onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
        />
        <Tab
          value='3'
          component='a'
          label='Assignees'
          href='/profileSetting/assignees'
          onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
        />
        <Tab
          value='4'
          component='a'
          label='Budgets'
          href='/profileSetting/budget'
          onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
        />
        <Tab
          value='5'
          component='a'
          label='Labels'
          href='/profileSetting/label'
          onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
        />
      </TabList>
      <Divider sx={{ my: theme => `${theme.spacing(5)} !important` }}></Divider>
      <TabPanel value='1'>
        <Box sx={{ height: 400, width: '100%' }}>
          <AddressSetting />
        </Box>
      </TabPanel>
      <TabPanel value='2'>
        <Box sx={{ height: 400, width: '100%' }}>
          <ContactsSetting />
        </Box>
      </TabPanel>
      <TabPanel value='3'>
        <Box sx={{ height: 400, width: '100%' }}>
          <AssigneeSetting />
        </Box>
      </TabPanel>
      <TabPanel value='4'>
        <Box sx={{ height: 400, width: '100%' }}>
          <BudgetSetting />
        </Box>
      </TabPanel>
      <TabPanel value='5'>
        <Box sx={{ height: 400, width: '100%' }}>
          <LabelSetting />
        </Box>
      </TabPanel>
    </TabContext>
  )
}

export default ProfileSetting
