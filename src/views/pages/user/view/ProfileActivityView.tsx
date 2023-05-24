import Box from '@mui/material/Box'
import HistoryTable from 'src/views/pages/user/view/components/history/HistoryTable'

export default function ProfileHistory() {
  return (
    <>
      <Box sx={{ height: 400, width: '100%' }}>
        <HistoryTable></HistoryTable>
      </Box>
    </>
  )
}

