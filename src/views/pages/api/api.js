import api from '../../../api/api'

const login = async (username, password) => {
  try {
    console.log(username, password)
    const res = await api.post('/api/v1/auth/login', { username, password })
    return res.data
  } catch (err) {
    throw err
  }
}

export { login }
