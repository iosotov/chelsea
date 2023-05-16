// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { useForm, useFieldArray } from 'react-hook-form'

// const createData = (incomeType: string, amount: number) => {
//   return { incomeType, amount }
// }

import { SubmitHandler, UseFormRegister } from 'react-hook-form'

// interface Props {
//   register: UseFormRegister<FormValues>
//   onSubmit: SubmitHandler<FormValues>
//   data: any
// }

// interface FormValues {
//   name: string
//   amount: number
// }
// interface FormList {
//   data: [FormValues]
// }

interface Field {
  name: string
  amount: string
}

interface Props {
  onFormSubmit: (formDataList: FormData[]) => void
  data: any
}

function ChildComponent({ onFormSubmit, data }: Props) {
  console.log(data)

  // const { register, onSubmit, data } = props
  const { register, handleSubmit } = useForm()

  // const fields: Field[] = data
  // console.log(fields)

  const onSubmit = () => {
    // console.log(fields)
    // const formDataList = fields.map(field => {
    //   const formData = new FormData()
    //   console.log(field.name, field.amount)
    //   formData.append(field.name, field.amount)
    //   console.log(formData)

    //   return formData
    // })
    const formDataList = data.map(income => {
      const formData = new FormData()

      // const formData: any = {}
      // console.log(formData)
      // console.log(income.name, income.amount)

      // formData = income
      // console.log(formData)

      // return formData
      // return income

      formData.append(income.budgetId, income.name)
      console.log(formData)

      // formData.append('amount', income.amount)

      // formData.get

      return formData
    })
    console.log(formDataList)
    onFormSubmit(formDataList)
  }

  // console.log(data)

  // const onSubmit = (income) => {
  //   const formDataList = data.map((income) => {
  //     const formData = new FormData();
  //     formData.append(income.id, income.amount);
  //     return formData;
  //   });
  //   props.onFormSubmit(formDataList);
  // };
  // const dataSource = data.income
  // console.log(dataSource)

  return (
    // <TableContainer>
    //   <h3>Child Component</h3>
    //   <form onSubmit={onSubmit}>
    //     <label htmlFor='name'>Name:</label>
    //     <input type='text' id='name' {...register('name')} />
    //     <br />
    //     <label htmlFor='amount'>Email:</label>
    //     <input type='text' id='amount' {...register('amount')} />
    //     <br />
    //     <button type='submit'>Submit</button>
    //   </form>
    // </div>
    <TableContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Income Name</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((budget, index) => (
              <TableRow
                key={budget.id}
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                {/* <TableCell component='th' scope='row' {...register(`${budget.name}`)}> */}
                <TableCell
                  component='th'
                  scope='row'
                  // key={budget.budgetId}
                  {...register(`data.${index}.name` as const)}
                >
                  {/* {getBudgetById(budget.budgetId)} */}
                  {budget.name}
                </TableCell>
                <TableCell align='right'>
                  {/* sets to load default value */}
                  {/* <TextField fullWidth label='Amount' defaultValue={getBudgetById(budget.budgetId)} placeholder='Amount'>
                  {' '}
                </TextField> */}
                  <TextField
                    fullWidth
                    // name='income-amount'
                    label='Amount'
                    value={budget.amount}
                    placeholder='Amount'
                    // {...register(`${budget.amount}`)}
                    {...register(`data.${index}.amount` as const)}

                    // {...register(`items.${index}.amount`)}
                  ></TextField>
                  {/* <input {...register(`items.${index}.amount`)} defaultValue={budget.amount}></input> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <input type='submit'></input>
        </Table>
      </form>
    </TableContainer>
  )
}

export default ChildComponent
