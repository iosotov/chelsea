import { useState, SyntheticEvent } from 'react'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import TabList from '@mui/lab/TabList'
import { useRouter } from 'next/router'
import DashboardTasksView from './DashboardTasksView'

interface DashboardTabsProps {
  tab: string
}

export default function DashboardTabs({ tab }: DashboardTabsProps) {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState(tab ?? 'tasks')
  const [isLoading, setLoading] = useState(false)

  const handleChange = (e: SyntheticEvent, value: string) => {
    setLoading(true)
    setActiveTab(value)
    setTimeout(() => {
      router
        .push({
          pathname: `/dashboard/${value.toLowerCase()}`
        })
        .then(() => setLoading(false))
    }, 300)
  }

  return (
    <TabContext value={activeTab}>
      <Box>
        <TabList value={activeTab} variant='scrollable' scrollButtons='auto' onChange={handleChange}>
          <Tab label='Tasks' value='tasks' />
          <Tab label='Contacts' value='contacts' />

          {/* <Tab label='Emails' value='emails' />
          <Tab label='Notes' value='notes' />
          <Tab label='Docs' value='docs' /> */}
        </TabList>
      </Box>
      {/* Add tab views here */}
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <>
            <TabPanel value='tasks'>
              <DashboardTasksView />
            </TabPanel>
            <TabPanel value='contacts'>
              Contacts Panel
            </TabPanel>

            {/* <TabPanel value='emails'>
              Emails Panel
            </TabPanel>
            <TabPanel value='notes'>

              Notes Panel
            </TabPanel>
            <TabPanel value='docs'>
              Documents Panel
            </TabPanel> */}
          </>
        )}
      </Box>
    </TabContext>
  )
}
