import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { PermissionType } from './api/permissionApiSlice'

const permissionAdapter = createEntityAdapter({
  selectId: (permission: PermissionType) => permission.permissionId
})

const initialState = permissionAdapter.getInitialState()

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setPermissions: (state, action) => {
      permissionAdapter.setAll(state, action.payload)
    },
    updatePermissions: (state, action) => {
      permissionAdapter.upsertMany(state, action.payload)
    },
    addPermission: (state, action) => {
      permissionAdapter.addOne(state, action.payload)
    },
    updatePermission: (state, action) => {
      permissionAdapter.upsertOne(state, action.payload)
    },
    deletePermission: (state, action) => {
      permissionAdapter.removeOne(state, action.payload)
    }
  }
})

export const { setPermissions, addPermission, updatePermission, updatePermissions, deletePermission } =
  permissionSlice.actions

export default permissionSlice.reducer

export const {
  selectAll: selectAllPermissions,
  selectById: selectPermissionById,
  selectIds: selectPermissionIds
} = permissionAdapter.getSelectors((state: RootState) => state.permission)
