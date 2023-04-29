export const waitForApiCall = async () => {
  try {
    await waitFor(() => expect(getByText('isFetching')).toBeInTheDocument(), { timeout: 2000 })

    return true
  } catch (error) {
    // Timeout error
    return false
  }
}

export function parseCSV(csvString) {
  const lines = csvString.trim().split('\n')
  const headers = lines[0].split(',')
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',')
    const rowData = {}

    for (let j = 0; j < headers.length; j++) {
      rowData[headers[j]] = row[j]
    }

    data.push(rowData)
  }

  return data
}

export const delay = (ms, callback) =>
  new Promise(resolve => {
    const interval = setInterval(() => {
      callback()
    }, 100)

    setTimeout(() => {
      clearInterval(interval)
      resolve()
    }, ms)
  })

export class FormDataNode {
  constructor() {
    this.data = {}
  }

  append(key, value, filename) {
    this.data[key] = { value, options: { filename } }
  }

  getHeaders() {
    return {
      'Content-Type': 'multipart/form-data'
    }
  }

  submit(options) {
    const { method, url, headers = {} } = options

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open(method, url)
      xhr.withCredentials = true

      Object.entries(headers).forEach(([header, value]) => {
        xhr.setRequestHeader(header, value)
      })

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response)
        } else {
          reject(xhr.statusText)
        }
      }

      xhr.onerror = function () {
        reject(xhr.statusText)
      }

      xhr.send(this.data)
    })
  }
}
