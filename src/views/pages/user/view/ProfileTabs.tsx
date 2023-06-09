import { useState, SyntheticEvent } from 'react'

import { useRouter } from 'next/router'

//MUI
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Typography from '@mui/material/Typography'

// Profile View Imports
import ProfileDebts from './ProfileDebtsView'
import ProfilePayments from './ProfilePaymentsView'
import ProfileDocuments from './ProfileDocumentsView'
import ProfileNotes from './ProfileNotesView'
import ProfileTasks from './ProfileTasksView'
import ProfileActivity from './ProfileActivityView'
import ProfileBudget from './ProfileBudgetView'
import ProfileEmail from './ProfileEmailView'
import PinnedNotes from './components/notes/PinnedNotes'

type Props = {
  id: string
  tab: string
}

export default function ProfileTabs({ id, tab }: Props) {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState(tab ?? 'debts')
  const [isLoading, setLoading] = useState(false)

  const handleChange = (e: SyntheticEvent, value: string) => {
    setLoading(true)
    setActiveTab(value)
    setTimeout(() => {
      router
        .push({
          pathname: `/profiles/${id}/${value.toLowerCase()}`
        })
        .then(() => setLoading(false))
    }, 300)
  }

  return (
    <TabContext value={activeTab}>
      <Box>
        <TabList value={activeTab} variant='scrollable' scrollButtons='auto' onChange={handleChange}>
          <Tab label='Debts' value='debts' />
          <Tab label='Payments' value='payments' />
          <Tab label='Documents' value='documents' />
          <Tab label='Notes' value='notes' />
          <Tab label='Tasks' value='tasks' />
          <Tab label='Budget' value='budget' />
          <Tab label='Email' value='email' />
          <Tab label='Activity' value='activity' />
        </TabList>
      </Box>
      {/* Add tab views here */}

      <Box sx={{ mt: 4 }}>
        <PinnedNotes profileId={id} />
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <>
            <TabPanel value='debts'>
              <ProfileDebts id={id} />
            </TabPanel>
            <TabPanel value='payments'>
              <ProfilePayments id={id} />
            </TabPanel>
            <TabPanel value='documents'>
              <ProfileDocuments id={id} />
            </TabPanel>
            <TabPanel value='notes'>
              <ProfileNotes id={id} />
            </TabPanel>
            <TabPanel value='tasks'>
              <ProfileTasks id={id} />
            </TabPanel>
            <TabPanel value='budget'>
              <ProfileBudget id={id} />
            </TabPanel>
            <TabPanel value='email'>
              <ProfileEmail id={id} />
            </TabPanel>
            <TabPanel value='activity'>
              <ProfileActivity id={id} />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  )
}
