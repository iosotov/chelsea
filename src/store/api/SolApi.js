import axios from 'axios'
import { faker } from '@faker-js/faker'

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`

class SolApi {
  static axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': `${process.env.NEXT_PUBLIC_API_BASE_URL}`
    },

    withCredentials: true
  })
  static token = null

  static async request(endpoint, data = {}, method = 'get') {
    const url = `${baseUrl}${endpoint}`
    const params = method === 'get' ? data : {}
    const headers = { Authorization: `Bearer ${SolApi.token}` }

    try {
      const response = await SolApi.axiosInstance({
        url,
        method,
        data: method !== 'get' ? data : undefined,
        params,
        headers
      })

      return response.data
    } catch (err) {
      console.error('API Error:', err)
      let message = err.response
      throw Array.isArray(message) ? message : [message]
    }
  }

  static async GetEmployeeInfo(employeeId) {
    return await this.request(`/employee/${employeeId}/info`)
  }

  static async GetPermissions() {
    const res = await this.request('/user/permissions', {}, 'GET')

    return res
  }

  static async GetBudgets() {
    const res = await this.request('/setting/budgets', {}, 'GET')

    return res
  }

  static async GetProfile(profileId) {
    const res = await this.request(`/profile/${profileId}/info`, {}, 'GET')

    return res
  }

  static async GetProfileStatusSummary(profileId) {
    const res = await this.request(`/profile/${profileId}/status-summary`, {}, 'GET')

    return res
  }

  static async GetAssignees() {
    const res = await this.request(`/setting/assignees`, {}, 'GET')

    return res.data
  }

  static async GetAddresses() {
    const params = {
      columns: [
        {
          index: 0,
          displayName: 'active',
          columnName: 'active',
          search: {
            value: true,
            operator: 0
          }
        }
      ]
    }
    const res = await this.request(`/setting/addresses/search`, params, 'POST')

    return res.data.data
  }

  static async GetContacts() {
    const params = {
      columns: [
        {
          index: 0,
          displayName: 'active',
          columnName: 'active',
          search: {
            value: true,
            operator: 0
          }
        }
      ]
    }
    const res = await this.request(`/setting/contacts/search`, params, 'POST')

    return res.data.data
  }

  static async GetCustomFields() {
    const params = {
      columns: [
        {
          index: 0,
          displayName: 'active',
          columnName: 'active',
          search: {
            value: true,
            operator: 0
          }
        }
      ]
    }
    const res = await this.request(`/setting/customfields/search`, params, 'POST')

    return res.data.data
  }

  static async GetLabels() {
    const params = {
      columns: [
        {
          index: 0,
          displayName: 'active',
          columnName: 'active',
          search: {
            value: true,
            operator: 0
          }
        }
      ]
    }
    const res = await this.request(`/setting/labels/search`, params, 'POST')

    return res.data.data
  }

  static async TestAuth() {
    const testCred = {
      username: 'celine@prime-logix.co',
      password: '123'
    }
    const res = await this.request(`/user/auth`, testCred, 'POST')

    return res
  }

  static async TestCreateProfile() {
    const testData = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthdate: faker.date.past(25, '2000-01-17').toISOString().slice(0, 10),
      campaignId: 'bf58cf1e-e03f-4097-b2bc-a410564bd933',
      gender: 1,
      profileAddresses: [
        {
          addressId: '133898fc-bbe4-4556-8694-a6291e045907',
          address1: faker.address.streetAddress(),
          address2: faker.address.secondaryAddress(),
          city: faker.address.city(),
          state: faker.address.stateAbbr(),
          zipCode: faker.address.zipCode('#####')
        }
      ],
      profileContacts: [
        {
          contactId: '5f2421ec-6016-4355-92aa-67dd5f2c8abc',
          value: faker.phone.number('###-###-####')
        },
        {
          contactId: 'c7713ff2-1bea-4f69-84c0-404e0e5fb0bd',
          value: faker.internet.email()
        }
      ]
    }

    const res = await this.request(`/profile`, testData, 'POST')

    return res
  }

  static async TestDeleteProfile(id) {
    const res = await this.request(`/profile/${id}/delete`, {}, 'PUT')

    return res
  }

  static async GetEnrollmentPayments(profileId) {
    const res = await this.request(`/enrollment/${profileId}/profile/payments`, {}, 'GET')

    return res
  }
}

export default SolApi
