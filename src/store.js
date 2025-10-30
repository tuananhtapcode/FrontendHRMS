import { legacy_createStore as createStore } from 'redux'

const initialState = {
  appStoreShow: false,
  theme: 'light',
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      console.log(rest)
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
