import api from 'src/api/api'

const getAccounts = async (page = 0, limit = 10) => {
  const res = await api.get('/accounts', { params: { page, limit } })
  return res.data
}

export { getAccounts }
