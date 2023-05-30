import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { UserActivityType, UserPermissionsType, UserType } from './api/userApiSlice'
import { defaultSuggestionsData } from 'src/layouts/components/vertical/Autocomplete'

const userAdapter = createEntityAdapter({
  selectId: (user: UserType) => user.userId
})

const userPermissionAdapter = createEntityAdapter({
  selectId: (user: UserPermissionsType) => user.userId
})

const userActivityAdapter = createEntityAdapter({
  selectId: (user: UserActivityType) => user.userActivityId
})

const initialState = {
  user: userAdapter.getInitialState(),
  permission: userPermissionAdapter.getInitialState(),
  activity: userActivityAdapter.getInitialState()
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      userAdapter.setAll(state.user, action.payload)
    },
    updateUsers: (state, action) => {
      userAdapter.upsertMany(state.user, action.payload)
    },
    addUser: (state, action) => {
      userAdapter.addOne(state.user, action.payload)
    },
    updateUser: (state, action) => {
      userAdapter.upsertOne(state.user, action.payload)
    },
    deleteUser: (state, action) => {
      userAdapter.removeOne(state.user, action.payload)
    },
    setUserPermissions: (state, action) => {
      userPermissionAdapter.setAll(state.permission, action.payload)
    },
    updateUserPermissions: (state, action) => {
      userPermissionAdapter.upsertMany(state.permission, action.payload)
    },
    addUserPermission: (state, action) => {
      userPermissionAdapter.addOne(state.permission, action.payload)
    },
    updateUserPermission: (state, action) => {
      userPermissionAdapter.upsertOne(state.permission, action.payload)
    },
    deleteUserPermission: (state, action) => {
      userPermissionAdapter.removeOne(state.permission, action.payload)
    },
    setUserActivitys: (state, action) => {
      userActivityAdapter.setAll(state.activity, action.payload)
    },
    updateUserActivitys: (state, action) => {
      userActivityAdapter.upsertMany(state.activity, action.payload)
    },
    addUserActivity: (state, action) => {
      userActivityAdapter.addOne(state.activity, action.payload)
    },
    updateUserActivity: (state, action) => {
      userActivityAdapter.upsertOne(state.activity, action.payload)
    },
    deleteUserActivity: (state, action) => {
      userActivityAdapter.removeOne(state.activity, action.payload)
    }
  }
})

export const {
  setUsers,
  addUser,
  updateUser,
  updateUsers,
  deleteUser,
  setUserPermissions,
  addUserPermission,
  updateUserPermission,
  updateUserPermissions,
  deleteUserPermission,
  setUserActivitys,
  addUserActivity,
  updateUserActivity,
  updateUserActivitys,
  deleteUserActivity
} = userSlice.actions

export default userSlice.reducer

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds
} = userAdapter.getSelectors((state: RootState) => state.user.user)

export const {
  selectAll: selectAllUserPermissions,
  selectById: selectUserPermissionById,
  selectIds: selectUserPermissionIds
} = userPermissionAdapter.getSelectors((state: RootState) => state.user.permission)

export const {
  selectAll: selectAllUserActivitys,
  selectById: selectUserActivityById,
  selectIds: selectUserActivityIds
} = userActivityAdapter.getSelectors((state: RootState) => state.user.activity)

export const selectQuickSearchLinks = createSelector(selectAllUserActivitys, activities => {
  const recentSearch = {
    category: 'Recent Searches',
    suggestions: activities.map(r => ({
      icon: 'mdi:account-group',
      suggestion: `${r.description}`,
      link: `/profiles/${r.objectId}/debts/`
    }))
  }

  return [...defaultSuggestionsData, recentSearch]
})
