import 'core-js'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import store from './store'
import { useEffect } from 'react'

const ClearLocalStorage = () => {
  useEffect(() => {
    localStorage.clear()
  }, [])
  return null
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ClearLocalStorage />
    <App />
  </Provider>,
)
