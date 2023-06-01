// // ** React Imports


import React from 'react'

function index() {
  return (
    <div>index</div>
  )
}

export default index


// import React, { useState, useCallback } from 'react'

// // ** Next Imports
// import Link from 'next/link'

// // ** MUI Imports
// import Box from '@mui/material/Box'
// import Card from '@mui/material/Card'
// import Grid from '@mui/material/Grid'
// import Divider from '@mui/material/Divider'
// import { DataGridPro, GridColDef, GridFilterInputSingleSelect, GridFilterOperator, GridToolbar } from '@mui/x-data-grid-pro'
// import { styled } from '@mui/material/styles'
// import MenuItem from '@mui/material/MenuItem'
// import Typography from '@mui/material/Typography'
// import CardHeader from '@mui/material/CardHeader'
// import InputLabel from '@mui/material/InputLabel'
// import FormControl from '@mui/material/FormControl'
// import CardContent from '@mui/material/CardContent'
// import Select, { SelectChangeEvent } from '@mui/material/Select'

// // ** Custom Components Imports
// import CustomChip from 'src/@core/components/mui/chip'

// // ** Types Imports
// import { ThemeColor } from 'src/@core/layouts/types'

// // ** Custom Table Components Imports
// import { useAppSelector } from 'src/store/hooks'
// import { useGetCompaniesQuery, usePostEmployeeSearchQuery, usePostEnrollmentSearchQuery, usePostLiabilitiesSearchQuery } from 'src/store/api/apiHooks'
// import { format } from 'date-fns'
// import { selectAllCompanies } from 'src/store/companySlice';
// import { selectAllEmployeeSelectOptions } from 'src/store/employeeSlice'
// import { capitalizeWords, formatCurrency, paymentStatus, paymentStatusColor } from 'src/pages/profiles/list'
// import { store } from 'src/store/store'
// import { Stack } from '@mui/material'
// import { ProfileAssigneeType } from 'src/store/api/profileApiSlice'
// import { v4 } from 'uuid'
// import { selectTransactionsByTypeStatus } from 'src/store/enrollmentSlice'

// export const enrollmentStatusColors: ThemeColor[] = ["secondary", "primary", "success", "secondary", "success", "error", "secondary", "primary", "warning", "secondary"]
// export const enrollmentStatus = ["Pending", "Submitted", "Enrolled", "Paused", "Reenrolled", "Cancelled, Resume", "Approved", "Returned", "Created"]
// export const paymentMethods = ['ACH', "Credit", "None"]
// export const feeTypes = ['ACH', "Credit", "None"]
// export const paymentTypes = ["Monthly Payment", "Initial Down Payment", "Additional Payment"]



// //
// const LinkStyled = styled(Link)(({ theme }) => ({
//   fontWeight: 600,
//   fontSize: '1rem',
//   cursor: 'pointer',
//   textDecoration: 'none',
//   color: theme.palette.text.secondary,
//   '&:hover': {
//     color: theme.palette.primary.main
//   }
// }))

// const LiabilityList = () => {

//   // API HOOKS
//   usePostLiabilitiesSearchQuery({})

//   // LOCAL STATE
//   const [paginationModel, setPaginationModel] = useState({ pageSize: 25, page: 0 })

//   // const [status, setStatus] = useState<string>("-1")

//   // HANDLE FILTER CHANGE
//   // const handleStatusChange = useCallback((e: SelectChangeEvent) => {
//   //   setStatus(e.target.value)
//   // }, [])

//   // GLOBAL STATE
//   const employees = useAppSelector(state => selectAllEmployeeSelectOptions(state))
//   const companies = useAppSelector(selectAllCompanies)

//   // DATA GRID COLUMNS DEFINITION
//   const columns: GridColDef[] = [
//     {
//       minWidth: 350,
//       field: 'enrollmentId',
//       headerName: ' Enrollment ID',
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' sx={{}}>{value}</Typography>
//       }
//     },
//     {
//       minWidth: 350,
//       field: 'enrollmentDetailId',
//       headerName: 'Payment ID',
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' sx={{}}>{value}</Typography>
//       }
//     },
//     {
//       minWidth: 175,
//       field: 'profileId',
//       headerName: 'Profile ID',
//       renderCell: ({ value }) => {
//         return (
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <LinkStyled href={`/profiles/${value}/debts`}>{value}</LinkStyled>
//           </Box>
//         )
//       }
//     },
//     {
//       minWidth: 250,
//       field: 'profileName',
//       headerName: 'Profile Name',
//       valueGetter: ({ row }) => {
//         const { firstName, lastName } = row

//         return `${firstName} ${lastName}`
//       },
//       renderCell: ({ value }) => {

//         return <Typography>{capitalizeWords(value)}</Typography>
//       }
//     },
//     {
//       minWidth: 175,
//       field: 'paymentStatus',
//       headerName: 'Payment Status',
//       type: 'singleSelect',
//       valueOptions: paymentStatus.map((p, i) => ({ label: p, value: i })),
//       renderCell: ({ value }) => {
//         return (
//           <CustomChip
//             skin='light'
//             label={paymentStatus[value]}
//             color={paymentStatusColor[value]}
//             sx={{ textTransform: 'capitalize', padding: 1, width: '80%' }}
//           />
//         )
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'paymentAmount',
//       headerName: 'Payment Amount',
//       type: "number",
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value && formatCurrency(value)}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'paymentType',
//       headerName: 'Payment Type',
//       type: 'singleSelect',
//       valueOptions: paymentTypes.map((p, i) => ({ label: p, value: i })),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{paymentTypes[value]}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'paymentMethod',
//       headerName: 'Payment Method',
//       type: 'singleSelect',
//       valueOptions: paymentMethods.map((p, i) => ({ label: p, value: i })),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{paymentMethods[value]}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'enrollmentFee',
//       headerName: 'Enrollment Fee',
//       type: "number",
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value && formatCurrency(value)}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       type: 'date',
//       field: 'processedDate',
//       headerName: 'Processed Date',
//       valueGetter: (({ value }) => {
//         return value ? new Date(value) : null
//       }),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       type: 'date',
//       field: 'clearedDate',
//       headerName: 'Cleared Date',
//       valueGetter: (({ value }) => {
//         return value ? new Date(value) : null
//       }),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
//       }
//     },
//     {
//       minWidth: 200,
//       field: 'status',
//       type: 'singleSelect',
//       headerAlign: 'center',
//       align: 'center',
//       valueOptions: enrollmentStatus.map((e, i) => ({ label: e, value: i })),
//       headerName: 'Enrollment Status',
//       renderCell: ({ value }) => {
//         return (
//           <CustomChip
//             skin='light'
//             label={enrollmentStatus[value]}
//             color={enrollmentStatusColors[value]}
//             sx={{ textTransform: 'capitalize', padding: 1, width: '80%' }}
//           />
//         )
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'enrolledBalance',
//       type: "number",
//       headerName: 'Enrolled Balance',
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{+value > 0 && formatCurrency(value)}</Typography>
//       }
//     },
//     {
//       minWidth: 175,
//       field: 'basePlan',
//       headerName: 'Base Plan',
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value}</Typography>
//       }
//     },
//     {
//       minWidth: 200,
//       field: 'transactionId',
//       headerName: 'Transaction ID',
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'dayToProcess',
//       headerName: 'Day To Process',
//       type: "number",
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'processor',
//       headerName: 'Processor',
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value}</Typography>
//       }
//     },

//     {
//       minWidth: 125,
//       field: 'programLength',
//       headerName: 'Program Length',
//       type: "number",
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       type: 'date',
//       field: 'firstPaymentDate',
//       headerName: 'First Payment Date',
//       valueGetter: (({ value }) => {
//         return value ? new Date(value) : null
//       }),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       type: 'date',
//       field: 'firstPaymentClearedDate',
//       headerName: 'First Payment Cleared Date',
//       valueGetter: (({ value }) => {
//         return value ? new Date(value) : null
//       }),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       type: 'date',
//       field: 'recurringPaymentDate',
//       headerName: 'Recurring Payment Date',
//       valueGetter: (({ value }) => {
//         return value ? new Date(value) : null
//       }),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       type: 'date',
//       field: 'nextPaymentDate',
//       headerName: 'Next Payment Date',
//       valueGetter: (({ value }) => {
//         return value ? new Date(value) : null
//       }),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       type: 'date',
//       field: 'lastPaymentDate',
//       headerName: 'Last Payment Date',
//       valueGetter: (({ value }) => {
//         return value ? new Date(value) : null
//       }),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       type: 'date',
//       field: 'cancelledDate',
//       headerName: 'Cancelled Date',
//       valueGetter: (({ value }) => {
//         return value ? new Date(value) : null
//       }),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       type: 'date',
//       field: 'pausedDate',
//       headerName: 'Paused Date',
//       valueGetter: (({ value }) => {
//         return value ? new Date(value) : null
//       }),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       type: 'date',
//       field: 'submittedDate',
//       headerName: 'Submitted Date',
//       valueGetter: (({ value }) => {
//         return value ? new Date(value) : null
//       }),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       type: 'date',
//       field: 'enrolledDate',
//       headerName: 'Enrolled Date',
//       valueGetter: (({ value }) => {
//         return value ? new Date(value) : null
//       }),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       type: 'date',
//       field: 'statusDate',
//       headerName: 'Status Date',
//       valueGetter: (({ value }) => {
//         return value ? new Date(value) : null
//       }),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'firstPaymentAmount',
//       headerName: 'First Payment Amount',
//       type: "number",
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'firstPaymentClearedAmount',
//       headerName: 'First Payment Cleared Amount',
//       type: "number",
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'nextPaymentAmount',
//       headerName: 'Next Payment Amount',
//       type: "number",
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'initialFeeAmount',
//       headerName: 'Initial Fee Amount',
//       type: "number",
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'lastPaymentAmount',
//       headerName: 'Last Payment Amount',
//       type: "number",
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'lastPaymentStatus',
//       headerName: 'Last Payment Status',
//       type: 'singleSelect',
//       valueOptions: paymentStatus.map((p, i) => ({ label: p, value: i })),
//       renderCell: ({ value }) => {
//         return value && (
//           <CustomChip
//             skin='light'
//             label={paymentStatus[value]}
//             color={paymentStatusColor[value]}
//             sx={{ textTransform: 'capitalize', padding: 1, width: '80%' }}
//           />
//         )
//       }
//     },
//     {
//       minWidth: 200,
//       field: 'cancelDisposition',
//       headerName: 'Cancel Disposition',
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value}</Typography>
//       }
//     },
//     {
//       minWidth: 200,
//       field: 'cancelledBy',
//       headerName: 'Cancelled By',
//       type: "singleSelect",
//       valueOptions: employees,
//       renderCell: ({ value }) => {
//         const employee = store.getState().employee.entities[value]

//         return <Typography variant='body2' >{employee?.employeeAlias}</Typography>
//       }
//     },
//     {
//       minWidth: 200,
//       field: 'pausedBy',
//       headerName: 'Paused By',
//       type: "singleSelect",
//       valueOptions: employees,
//       renderCell: ({ value }) => {
//         const employee = store.getState().employee.entities[value]

//         return <Typography variant='body2' >{employee?.employeeAlias}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'feeType',
//       headerName: 'Fee Type',
//       type: "singleSelect",
//       valueOptions: feeTypes.map((f, i) => ({ label: f, value: i })),
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{feeTypes[value]}</Typography>
//       }
//     },

//     {
//       minWidth: 125,
//       field: 'clearedAmount',
//       headerName: 'Cleared Amount',
//       type: "number",
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value}</Typography>
//       }
//     },
//     {
//       minWidth: 125,
//       field: 'totalPayments',
//       headerName: 'Total Payments',
//       type: "number",
//       renderCell: ({ value }) => {
//         return <Typography variant='body2' >{value}</Typography>
//       }
//     },
//     {
//       minWidth: 200,
//       field: 'createdCompany',
//       headerName: 'Created Company',
//       type: 'singleSelect',
//       valueOptions: companies.map(c => ({ label: c.name, value: c.companyId })),
//       renderCell: ({ row }) => {
//         return <Typography variant='body2' sx={{ textTransform: 'capitalize', whiteSpace: 'normal', wordWrap: 'normal' }}>{row.createdCompanyName}</Typography>
//       }
//     },
//     {
//       minWidth: 200,
//       field: 'profileAssignees',
//       headerName: 'Assignees',
//       type: 'singleSelect',
//       valueOptions: employees,
//       filterOperators: [arrayContainsFilterOperator],
//       renderCell: ({ row }) => {
//         return (
//           <Stack>
//             {row.profileAssignees && row.profileAssignees.map((a: ProfileAssigneeType) => {
//               const employee = store.getState().employee.entities[a.employeeId]
//               console.log(employee)

//               return (
//                 <Typography key={v4()} variant='body2' sx={{ textTransform: 'capitalize', whiteSpace: 'normal', wordWrap: 'normal' }}>{employee ? capitalizeWords(employee.employeeAlias) : ""}</Typography>
//               )
//             })}
//           </Stack>
//         )
//       }
//     },
//   ]


//   // FOR DYNAMIC RENDERING OF PRESET LIST FILTERS
//   const transactions = useAppSelector(state => selectTransactionsByTypeStatus(state, +status))

//   return (
//     <Grid container spacing={6}>
//       <Grid item xs={12}>
//         <Card>
//           <CardHeader title='Preset List' />
//           <CardContent>
//             <Grid container spacing={6}>
//               <Grid item sm={6} xs={12}>
//                 <FormControl fullWidth>
//                   <InputLabel htmlFor='status'>Task Status</InputLabel>
//                   <Select
//                     fullWidth
//                     value={status}
//                     id='status'
//                     label='Task Status'
//                     labelId='status'
//                     onChange={handleStatusChange}
//                   >
//                     <MenuItem value={"-1"}>All</MenuItem>
//                     {paymentStatus.map((s, i) => (
//                       <MenuItem key={`${s}-${i}`} value={i}>{s}</MenuItem>
//                     ))}

//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>
//           </CardContent>
//           <Divider />
//         </Card>
//       </Grid>
//       <Grid item xs={12}>
//         <Card>
//           <CardContent>
//             <DataGridPro
//               disableRowSelectionOnClick
//               rowHeight={75}
//               slots={{
//                 toolbar: GridToolbar,
//               }}
//               slotProps={{
//                 toolbar: {
//                   showQuickFilter: true,
//                   quickFilterProps: { debounceMs: 500 },
//                   sx: { padding: 2 }
//                 },
//               }}
//               sx={{
//                 height: 600,

//               }}
//               columns={columns}
//               pagination
//               paginationModel={paginationModel}
//               hideFooterSelectedRowCount
//               onPaginationModelChange={setPaginationModel}
//               pageSizeOptions={[25, 50, 100]}
//               getRowId={row => row.enrollmentDetailId}
//               rows={transactions}

//               componentsProps={{
//                 baseButton: {
//                   variant: 'outlined'
//                 },
//               }}
//               initialState={{
//                 sorting: {
//                   sortModel: [{ field: 'status', sort: 'asc' }, { field: 'dueDate', sort: 'asc' }]
//                 },
//                 pagination: {
//                   paginationModel: { pageSize: 25 }
//                 },
//                 columns: {
//                   columnVisibilityModel: {
//                     // Hide columns status and traderName, the other columns will remain visible

//                     enrollmentId: false,
//                     enrollmentDetailId: false,
//                     programLength: false,
//                     basePlan: false,
//                     processor: false,
//                     enrollmentFee: false,
//                     firstPaymentDate: false,
//                     firstAmount: false,
//                     firstPaymentClearedDate: false,
//                     recurringPaymentDate: false,
//                     cancelledDate: false,
//                     pausedDate: false,
//                     submittedDate: false,
//                     enrolledDate: false,
//                     firstPaymentClearedAmount: false,
//                     initialFeeAmount: false,
//                     cancelDisposition: false,
//                     cancelledBy: false,
//                     pausedBy: false,
//                     createdBy: false,
//                     createdCompany: false,
//                     profileAssignees: false,
//                   },
//                 }
//               }}
//             />
//           </CardContent>
//         </Card>
//       </Grid>
//     </Grid>
//   )
// }

// export default LiabilityList




