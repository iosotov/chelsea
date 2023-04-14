import axios from 'axios'

const baseUrl = 'http://monolivia.com/api'

class SolApi {
  static axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })

  static async request(endpoint, data = {}, method = 'get') {
    console.log('API Call:', endpoint, data, method)

    const url = `/${endpoint}`
    const params = method === 'get' ? data : {}

    try {
      const response = await SolApi.axiosInstance({
        url,
        method,
        data: method !== 'get' ? data : undefined,
        params
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
}

export default SolApi
