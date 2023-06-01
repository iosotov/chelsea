import { ReactElement } from 'react'
import Box from '@mui/material/Box'
import HistoryTable from 'src/views/pages/user/view/components/history/HistoryTable'

import { useGetHistoryQuery } from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectHistoriesByProfileId } from 'src/store/historySlice'
import { HistoryType } from 'src/store/api/historyApiSlice'

export default function ProfileActivity({ id }: { id: string }): ReactElement {
  const profileId = id
  console.log(profileId)

  const {
    isSuccess: historySuccess,
    isError: historyError,
    isLoading: historyLoading
  } = useGetHistoryQuery(profileId, { refetchOnMountOrArgChange: true })
  const profileHistory: HistoryType[] = useAppSelector(state => selectHistoriesByProfileId(state, profileId))
  const data = profileHistory

  return (
    <>
      {historyError && <div>An error occured</div>}
      {historyLoading && <div>Loading</div>}
      {historySuccess && (
        <Box sx={{ height: 800, width: '100%' }}>
          <HistoryTable data={data} />
        </Box>
      )}
    </>
  )
}
