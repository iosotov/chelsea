import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { EmployeeInfoType } from './api/employeeApiSlice'

const employeeAdapter = createEntityAdapter({
  selectId: (employee: EmployeeInfoType) => employee.employeeId
})

const initialState = employeeAdapter.getInitialState()

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      employeeAdapter.setAll(state, action.payload)
    },
    updateEmployees: (state, action) => {
      employeeAdapter.upsertMany(state, action.payload)
    },
    addEmployee: (state, action) => {
      employeeAdapter.addOne(state, action.payload)
    },
    updateEmployee: (state, action) => {
      employeeAdapter.upsertOne(state, action.payload)
    },
    deleteEmployee: (state, action) => {
      employeeAdapter.removeOne(state, action.payload)
    }
  }
})

export const { setEmployees, addEmployee, updateEmployee, updateEmployees, deleteEmployee } = employeeSlice.actions

export default employeeSlice.reducer

export const {
  selectAll: selectAllEmployees,
  selectById: selectEmployeeById,
  selectIds: selectEmployeeIds
} = employeeAdapter.getSelectors((state: RootState) => state.employee)

export const selectAllEmployeeSelectOptions = createSelector(selectAllEmployees, employees => {
  return employees.map(e => ({ label: e.employeeAlias, value: e.employeeId }))
})
