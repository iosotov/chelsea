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

type Props = {
  id: string | string[] | undefined
  tab: string
}

export default function UserViewLeft({ id, tab }: Props) {
  const [activeTab, setActiveTab] = useState<string>(tab)

  const router = useRouter()

  const handleChange = (e: SyntheticEvent, value: string) => {
    setActiveTab(value)
    // router.push({
    //   pathname: `/contact/${id}/${value.toLowerCase()}`
    // })
  }

  return (
    <TabContext value={activeTab}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs variant='scrollable' scrollButtons='auto' onChange={handleChange}>
          <Tab label='Credit Report' value='credit'></Tab>
          <Tab label='Debts' value='debts'></Tab>
          <Tab label='Payments' value='payments'></Tab>
          <Tab label='Billing' value='billing'></Tab>
          <Tab label='Documents' value='documents'></Tab>
          <Tab label='Notes' value='notes'></Tab>
          <Tab label='Tasks' value='tasks'></Tab>
          <Tab label='History' value='history'></Tab>
          <Tab label='Budget' value='budget'></Tab>
        </Tabs>
      </Box>
      {/* Add tab views here */}
      <TabPanel value='credit'>
        <div>Credit</div>
      </TabPanel>
      <TabPanel value='debts'>
        <div>Debts</div>
      </TabPanel>
      <TabPanel value='payments'>
        <div>Payments</div>
      </TabPanel>
      <TabPanel value='billing'>
        <div>Billing</div>
      </TabPanel>
      <TabPanel value='documents'>
        <div>Documents</div>
      </TabPanel>
      <TabPanel value='notes'>
        <div>Notes</div>
      </TabPanel>
      <TabPanel value='tasks'>
        <div>Tasks</div>
      </TabPanel>
      <TabPanel value='history'>
        <div>History</div>
      </TabPanel>
      <TabPanel value='budget'>
        <div>Budget</div>
      </TabPanel>
    </TabContext>
  )
}
