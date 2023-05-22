// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { useRef } from 'react'

import { useForm, useFieldArray, Control, FieldValues } from 'react-hook-form'

// const createData = (incomeType: string, amount: number) => {
//   return { incomeType, amount }
// }

import { SubmitHandler, UseFormRegister } from 'react-hook-form'
import { DataGrid } from '@mui/x-data-grid'

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

  // submitForm: () => void

  data: any

  // ref: any
}

// type myProps = {
//   onFormSubmit: (formDataList: FormData[]) => void

//   // submitForm: () => void

//   data: any

//   ref: any
// }

// function ChildComponent({ onFormSubmit, data, ref }: Props) {
function ChildComponent({ onFormSubmit, data }: Props) {
  console.log(data)

  // const fields = data
  const myFields = data
  console.log(myFields)

  // const { register, onSubmit, data } = props
  // const { register, handleSubmit, getValues, setValue, control } = useForm<FormData>()
  const { register, handleSubmit, getValues, setValue, control } = useForm()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inputs'
  })

  // const formRef = useRef<HTMLFormElement | null>(null)

  // const formRef = useRef<any>(null)

  // const childFormRef = useRef<any>(null)

  // const handleInputChange = () => {
  //   const formData = getValues()
  //   onSubmit([formData])
  // }

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    // const inputValue = event.target.value

    // console.log(name, value)
    const { name, value } = event.target
    console.log(name, value)

    console.log(index)

    // console.log(index.target)
    // console.log(index.target.value)
    ///CREATE A FIEELDS LIST WITH BELOW ID, RENDER FIELDS AND UPDATE VALUES
    // setValue(`${budgetId}.amount`, value)
    setValue(`inputs[${index}].amount`, value)

    console.log(event)
    console.log(fields)

    // setValue(`fields[${index}].name`, value)
  }

  const onSubmit = (data: Record<string, string>) => {
    console.log('INCOME ON SUMIT')

    console.log(data)
    console.log(fields)

    // const mySubmit = () => {
    //   handleSubmit(onSubmit)
    // }

    const formDataList = myFields.map((budget, index) => {
      const formData = new FormData()

      // const formData: any = {}
      // console.log(formData)
      console.log(budget, index)

      // console.log(budget.name, budget.amount, budget.budgetId)
      // console.log(data, index)

      // formData = income
      // console.log(formData)

      // return formData
      // return income
      // console.log(data, data[income.budgetId])
      console.log(budget, Number(data.inputs[index]['amount']))

      // formData.append(budget.budgetId, budget.amount)
      formData.append(budget.budgetId, Number(data.inputs[index]['amount']))

      console.log(formDataList)

      return formData
    })
    console.log(formDataList)

    onFormSubmit(formDataList)

    // handleAddForm
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

  // const handleForm: SubmitHandler<any> = data => {
  //   console.log('hehe')

  //   // onFormSubmit();
  //   onFormSubmit(data)

  //   // handleSubmit(onSubmit)

  //   // onFormSubmit

  //   console.log('sent to parent')
  // }

  return (
    <Card>
      <CardHeader title='Income' />
      <CardContent>
        <TableContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <form onSubmit={handleSubmit(handleForm)}> */}
            {/* <form ref={formRef} onSubmit={handleSubmit(onSubmit)}> */}
            {/* <form onSubmit={handleForm} useRef={formRef}> */}
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Income Name</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {myFields.map((budget, index) => (
                  <TableRow
                    key={budget.budgetId}
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

                      // {...register(budget.name)}
                      // {...register(`${budget.name}`)}
                      // value={budget.amount}

                      // defaultValue={budget.amount}
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
                        // name={`${budget.budgetId}.amount`}
                        // name={`inputs[${index}].value`}
                        label='Amount'
                        key={budget.budgetId}
                        {...register(`inputs.${index}.amount` as const)}
                        // value={budget.amount}
                        defaultValue={budget.amount}
                        // placeholder='Amount'
                        // {...register(`${budget.budgetId}.amount`)}
                        onChange={e => handleInputChange(index, e)}

                        // {...register(`data.${index}.amount` as const)}

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
      </CardContent>
    </Card>
  )
}

export default ChildComponent
