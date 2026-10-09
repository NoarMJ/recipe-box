import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import store from './store/store.js'
import ThemeWrapper from './components/ThemeWrapper.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './store/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ThemeWrapper>
            <App />
          </ThemeWrapper>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
