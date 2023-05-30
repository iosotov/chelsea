import Box from '@mui/material/Box'
import ActivityTable from 'src/views/pages/user/view/components/history/ActivityTable'

export default function ProfileActivity({ id }: { id: string }) {
  const profileId = id
  console.log(profileId)

  //API CALLS
  const data = [
    {
      employeeName: 'Long Luna',
      fullDescription: 'Due date changed: 06/02/2023. Task completed: 5/30/2023. Status changed: Completed',
      id: 'c85aae08-58ee-4531-b35d-db1e53de3868',
      modifiedDate: '2023-05-30T16:23:26.1237909',
      name: 'Task',
      profileId: 'c85aae08-58ee-4531-b35d-db1e53de3868'
    },
    {
      employeeName: 'Long Luna',
      fullDescription: 'Auto Loan',
      id: 'c85aae08-58ee-4531-b35d-db1e53de3868',
      modifiedDate: '2023-05-30T16:23:26.1237909',
      name: 'Document',
      profileId: 'c85aae08-58ee-4531-b35d-db1e53de3868'
    },
    {
      employeeName: 'Long Luna',
      fullDescription: 'Auto Loan',
      id: 'c85aae08-58ee-4531-b35d-db1e53de3868',
      modifiedDate: '2023-05-30T16:23:26.1237909',
      name: 'Note',
      profileId: 'c85aae08-58ee-4531-b35d-db1e53de3868'
    }
  ]

  //GLOBAL STATE
  //LOCAL STATE
  //

  return (
    <>
      <Box sx={{ height: 600, width: '100%' }}>
        <ActivityTable data={data}></ActivityTable>
      </Box>
    </>
  )
}
