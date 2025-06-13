import axios from 'axios'

export default async function login(email, password) {
  try {
    const response = await axios.post('http://localhost:5000/auth/login', {
      email: email,
      password: password,
    })

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    if (error.response) {
      console.error('Backend error:', error.response.status, error.response.data)

      return {
        success: false,
      }
    } else if (error.request) {
      console.error('No response from server:', error.request)

      return {
        success: false,
      }
    } else {
      console.error('Axios error:', error.message)

      return {
        success: false,
      }
    }
  }
}
