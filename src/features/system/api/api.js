import api from 'src/api/api'

const getAccounts = async (page = 0, limit = 10) => {
  try {
    const res = await api.get('/api/v1/accounts', { params: { page, limit } })
    console.log(res)
    return { data: res.data.data.accounts, totalPages: res.data.data.totalPages }
  } catch (error) {
    throw error
  }
}

const getLogs = async () => {
  try {
    const res = await api.get('/api/v1/audit-logs')
    console.log(res)
    return { data: res.data.content, totalPages: res.data.totalPages }
  } catch (error) {
    throw error
  }
}

export { getAccounts, getLogs }
