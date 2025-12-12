import api from '../../../api/api'

const getUser = api
  .get('/users')
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err))

export { getUser }
