import Box from '@mui/material/Box'

import HistoryTable from 'src/views/table/custom/HistoryTable'

export default function ProfileHistory() {
  return (
    <>
      <Box sx={{ height: 400, width: '100%' }}>
        {/* <DataGrid rows={rows} columns={columns} checkboxSelection /> */}
        <HistoryTable></HistoryTable>
      </Box>
    </>
  )
}

// import Box from '@mui/material/Box'
// import { CardContent, Card, CardHeader } from '@mui/material'

// // ** MUI Imports
// import Paper from '@mui/material/Paper'
// import Table from '@mui/material/Table'
// import TableRow from '@mui/material/TableRow'
// import TableHead from '@mui/material/TableHead'
// import TableBody from '@mui/material/TableBody'
// import TableCell from '@mui/material/TableCell'
// import TableContainer from '@mui/material/TableContainer'
// import { width } from '@mui/system'

// const rows = [
//   {
//     id: 1,
//     type: 'NOTE',
//     createdBy: 'Jon Favreau',
//     description: 'New Monthly Fee Payment added. Amount: $304.14. Processed Date: 04/18/2027'
//   },
//   { id: 2, type: 'ENROLLMENT', createdBy: 'Cersei', description: 'Enrollment updated' },
//   { id: 3, type: 'ENROLLMENT', createdBy: 'Jaime', description: 'Enrollment updated' },
//   {
//     id: 4,
//     type: 'ENROLLMENTDETAIL',
//     createdBy: 'Arya',
//     description: 'New Monthly Fee Payment added. Amount: $304.14. Processed Date: 04/18/2027'
//   },
//   {
//     id: 7,
//     type: 'ENROLLMENTDETAIL',
//     createdBy: 'Ferrara',
//     description: 'New Monthly Fee Payment added. Amount: $304.14. Processed Date: 04/18/2027'
//   },
//   {
//     id: 8,
//     type: 'ENROLLMENTDETAIL',
//     createdBy: 'Rossini',
//     description: 'New Monthly Fee Payment added. Amount: $304.14. Processed Date: 04/18/2027'
//   },
//   {
//     id: 9,
//     type: 'ENROLLMENTDETAIL',
//     createdBy: 'Harvey',
//     description: 'New Monthly Fee Payment added. Amount: $304.14. Processed Date: 04/18/2027'
//   },
//   {
//     id: 10,
//     type: 'ENROLLMENTDETAIL',
//     createdBy: 'Jon',
//     description: 'New Monthly Fee Payment added. Amount: $304.14. Processed Date: 04/18/2027'
//   },
//   {
//     id: 11,
//     type: 'ENROLLMENTDETAIL',
//     createdBy: 'Cersei',
//     description: 'New Monthly Fee Payment added. Amount: $304.14. Processed Date: 04/18/2027'
//   },
//   {
//     id: 12,
//     type: 'ENROLLMENTDETAIL',
//     createdBy: 'Jaime',
//     description: 'New Monthly Fee Payment added. Amount: $304.14. Processed Date: 04/18/2027'
//   },
//   {
//     id: 13,
//     type: 'ENROLLMENTDETAIL',
//     createdBy: 'Arya',
//     description: 'New Monthly Fee Payment added. Amount: $304.14. Processed Date: 04/18/2027'
//   },
//   {
//     id: 16,
//     type: 'ENROLLMENTDETAIL',
//     createdBy: 'Ferrara',
//     description: 'New Monthly Fee Payment added. Amount: $304.14. Processed Date: 04/18/2027'
//   },
//   {
//     id: 17,
//     type: 'ENROLLMENTDETAIL',
//     createdBy: 'Rossini',
//     description: 'New Monthly Fee Payment added. Amount: $304.14. Processed Date: 04/18/2027'
//   },
//   {
//     id: 18,
//     type: 'ENROLLMENTDETAIL',
//     createdBy: 'Harvey',
//     description: 'New Monthly Fee Payment added. Amount: $304.14. Processed Date: 04/18/2027'
//   }
// ]

// import HistoryTable from 'src/views/table/custom/HistoryTable'

// const ProfileHistory = () => {
//   return (
//     <>
//       <Card>
//         <CardHeader title='History' />
//         <CardContent>
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: 650 }} aria-label='simple table'>
//               <TableHead>
//                 <TableRow>
//                   <TableCell size='small'>Type</TableCell>
//                   <TableCell size='small'>Created By</TableCell>
//                   <TableCell size='medium'>Description</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {rows.map(row => (
//                   <TableRow
//                     key={row.id}
//                     sx={{
//                       '&:last-of-type td, &:last-of-type th': {
//                         border: 0
//                       }
//                     }}
//                   >
//                     <TableCell size='small'>{row.type}</TableCell>
//                     <TableCell size='small'>{row.createdBy}</TableCell>
//                     <TableCell size='medium'>{row.description}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </CardContent>
//       </Card>
//     </>
//   )
// }

// export default ProfileHistory
