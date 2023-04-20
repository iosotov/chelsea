import { createSlice, EntityState } from '@reduxjs/toolkit'
import { Profile } from './api/profileApiSlice'

const initialState: EntityState<Profile> = {
  ids: [],
  entities: {}
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileState: (state, action) => {
      const { ids, entities } = action.payload
      state.ids = ids
      state.entities = entities
    }
  }
})

export const { updateProfileState } = profileSlice.actions

export default profileSlice.reducer
