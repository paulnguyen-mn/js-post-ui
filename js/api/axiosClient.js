import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Attach token to request if exists
    // Refresh token
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // transform data for all responses
    return response.data
  },
  function (error) {
    if (!error.response) throw new Error('Network error. Please try again later.')

    // redirect to login if not login
    if (error.response.status === 401) {
      // clear token, logout
      // ...
      window.location.assign('/login.html')
      return
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // return Promise.reject(error)
    throw new Error(error)
  }
)

export default axiosClient
