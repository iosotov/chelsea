import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { RolePermissionsType, RoleType } from './api/roleApiSlice'

const roleAdapter = createEntityAdapter({
  selectId: (role: RoleType) => role.roleId
})

const rolePermissionAdapter = createEntityAdapter({
  selectId: (rolePermission: RolePermissionsType) => rolePermission.roleId
})

const initialState = {
  role: roleAdapter.getInitialState(),
  rolePermission: rolePermissionAdapter.getInitialState()
}

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRoles: (state, action) => {
      roleAdapter.setAll(state.role, action.payload)
    },
    updateRoles: (state, action) => {
      roleAdapter.upsertMany(state.role, action.payload)
    },
    setRolePermissions: (state, action) => {
      rolePermissionAdapter.setAll(state.rolePermission, action.payload)
    },
    updateRolePermissions: (state, action) => {
      rolePermissionAdapter.upsertMany(state.rolePermission, action.payload)
    },
    removeRolePermission: (state, action) => {
      rolePermissionAdapter.removeOne(state.rolePermission, action.payload)
    }
  }
})

export const { setRoles, setRolePermissions, updateRoles, updateRolePermissions, removeRolePermission } =
  roleSlice.actions

export default roleSlice.reducer

export const {
  selectAll: selectAllRoles,
  selectById: selectRoleById,
  selectIds: selectRoleIds
} = roleAdapter.getSelectors((state: RootState) => state.role.role)

export const {
  selectAll: selectAllRolePermissions,
  selectById: selectRolePermissionById,
  selectIds: selectRolePermissionIds
} = rolePermissionAdapter.getSelectors((state: RootState) => state.role.rolePermission)

export const selectAllRoleSelectOptions = createSelector(selectAllRoles, roles => {
  return roles.map(r => ({ label: r.name, value: r.roleId }))
})
