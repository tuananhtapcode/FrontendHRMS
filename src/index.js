import 'core-js'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

import App from './App'
import store from './store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
