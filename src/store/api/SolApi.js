import axios from 'axios'

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
}

export default SolApi
