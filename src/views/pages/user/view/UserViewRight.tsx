import { useState, SyntheticEvent } from 'react'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'
import TabList from '@mui/lab/TabList/TabList'
import { useRouter } from 'next/router'
import { Tabs } from '@mui/material'

// Profile View Imports
import ProfileCredit from './ProfileCreditView'
import ProfilePayments from './ProfilePaymentsView'
import ProfileBilling from './ProfileBillingView'
import ProfileDocuments from './ProfileDocumentsView'
import ProfileNotes from './ProfileNotesView'
import ProfileTasks from './ProfileTasksView'
import ProfileHistory from './ProfileHistoryView'
import ProfileBudget from './ProfileBudgetView'

type Props = {
  id: string | string[] | undefined
  tab: string
}

export default function UserViewLeft({ id, tab }: Props) {
  const [activeTab, setActiveTab] = useState(tab ?? 'credit')
  const router = useRouter()

  const handleChange = (e: SyntheticEvent, value: string) => {
    setActiveTab(value)
    router.push({
      pathname: `/contact/${id}/${value.toLowerCase()}`
    })
  }

  return (
    <TabContext value={activeTab}>
      <Box>
        <Tabs value={activeTab} variant='scrollable' scrollButtons='auto' onChange={handleChange}>
          <Tab label='Credit & Debts' value='credit' />
          <Tab label='Payments' value='payments' />
          <Tab label='Billing' value='billing' />
          <Tab label='Documents' value='documents' />
          <Tab label='Notes' value='notes' />
          <Tab label='Tasks' value='tasks' />
          <Tab label='History' value='history' />
          <Tab label='Budget' value='budget' />
        </Tabs>
      </Box>
      {/* Add tab views here */}
      <TabPanel value='credit'>
        <ProfileCredit />
      </TabPanel>
      <TabPanel value='payments'>
        <ProfilePayments />
      </TabPanel>
      <TabPanel value='billing'>
        <ProfileBilling />
      </TabPanel>
      <TabPanel value='documents'>
        <ProfileDocuments />
      </TabPanel>
      <TabPanel value='notes'>
        <ProfileNotes />
      </TabPanel>
      <TabPanel value='tasks'>
        <ProfileTasks />
      </TabPanel>
      <TabPanel value='history'>
        <ProfileHistory />
      </TabPanel>
      <TabPanel value='budget'>
        <ProfileBudget />
      </TabPanel>
    </TabContext>
  )
}
