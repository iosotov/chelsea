import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import {
  AddressSettingType,
  AssigneeSettingType,
  ContactSettingType,
  CustomFieldSettingType,
  LabelSettingType
} from './api/settingApiSlice'

const addressAdapter = createEntityAdapter({
  selectId: (address: AddressSettingType) => address.addressId
})

const assigneeAdapter = createEntityAdapter({
  selectId: (assignee: AssigneeSettingType) => assignee.assigneeId
})

const contactAdapter = createEntityAdapter({
  selectId: (contact: ContactSettingType) => contact.contactId
})

const customFieldAdapter = createEntityAdapter({
  selectId: (customField: CustomFieldSettingType) => customField.customFieldId
})

const labelAdapter = createEntityAdapter({
  selectId: (label: LabelSettingType) => label.labelId
})

const initialState = {
  address: addressAdapter.getInitialState(),
  assignee: assigneeAdapter.getInitialState(),
  contact: contactAdapter.getInitialState(),
  customField: customFieldAdapter.getInitialState(),
  label: labelAdapter.getInitialState()
}

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setAddresses: (state, action) => {
      addressAdapter.setAll(state.address, action.payload)
    },
    updateAddresses: (state, action) => {
      addressAdapter.upsertMany(state.address, action.payload)
    },
    setAssignees: (state, action) => {
      assigneeAdapter.setAll(state.assignee, action.payload)
    },
    updateAssignees: (state, action) => {
      assigneeAdapter.upsertMany(state.assignee, action.payload)
    },
    removeAssignee: (state, action) => {
      assigneeAdapter.removeOne(state.assignee, action.payload)
    },
    setContacts: (state, action) => {
      contactAdapter.setAll(state.contact, action.payload)
    },
    updateContacts: (state, action) => {
      contactAdapter.upsertMany(state.contact, action.payload)
    },
    setCustomFields: (state, action) => {
      customFieldAdapter.setAll(state.customField, action.payload)
    },
    updateCustomFields: (state, action) => {
      customFieldAdapter.upsertMany(state.customField, action.payload)
    },
    setLabels: (state, action) => {
      labelAdapter.setAll(state.label, action.payload)
    },
    updateLabels: (state, action) => {
      labelAdapter.upsertMany(state.label, action.payload)
    }
  }
})

export const {
  setAddresses,
  setAssignees,
  setContacts,
  setCustomFields,
  setLabels,
  updateAddresses,
  updateAssignees,
  updateContacts,
  updateCustomFields,
  updateLabels,
  removeAssignee
} = settingSlice.actions

export default settingSlice.reducer

export const {
  selectAll: selectAllAddresses,
  selectById: selectAddressById,
  selectIds: selectAddressIds
} = addressAdapter.getSelectors((state: RootState) => state.setting.address)

export const {
  selectAll: selectAllAssignees,
  selectById: selectAssigneeById,
  selectIds: selectAssigneeIds
} = assigneeAdapter.getSelectors((state: RootState) => state.setting.assignee)

export const {
  selectAll: selectAllContacts,
  selectById: selectContactById,
  selectIds: selectContactIds
} = contactAdapter.getSelectors((state: RootState) => state.setting.contact)

export const {
  selectAll: selectAllCustomFields,
  selectById: selectCustomFieldById,
  selectIds: selectCustomFieldIds
} = customFieldAdapter.getSelectors((state: RootState) => state.setting.customField)

export const {
  selectAll: selectAllLabels,
  selectById: selectLabelById,
  selectIds: selectLabelIds
} = labelAdapter.getSelectors((state: RootState) => state.setting.label)
