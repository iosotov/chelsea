import axios from 'axios'
import { faker } from '@faker-js/faker'

const baseUrl = 'http://localhost:3001/api'

class SolApi {
  static axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json'
    },

    withCredentials: true
  })
  static token = null

  static async request(endpoint, data = {}, method = 'get') {
    console.log('API Call:', endpoint, data, method)

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

  static async UserAuth(data) {
    const res = await this.request('/user/auth', data, 'POST')

    return res
  }

  static async RefreshToken() {
    const res = await this.request('/user/refresh-token', {}, 'POST')

    return res
  }

  static async GetPermissions() {
    const res = await this.request('/user/permissions', {}, 'GET')

    return res
  }

  static async RevokeToken() {
    const res = await this.request('/user/revoke-token', {}, 'POST')

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

  static async TestAuth() {
    const testCred = {
      username: 'sam@prime.co',
      password: 'pass123'
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

    console.log(testData)
    const res = await this.request(`/profile`, testData, 'POST')

    return res
  }

  static async TestDeleteProfile(id) {
    const res = await this.request(`/profile/${id}/delete`, {}, 'PUT')

    if (res.success) console.log('profile deleted')

    return res
  }

  static async GetEnrollmentPayments(profileId) {
    const res = await this.request(`/enrollment/${profileId}/profile/payments`, {}, 'GET')

    return res
  }
}

export default SolApi
