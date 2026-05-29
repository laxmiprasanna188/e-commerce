import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import App from './App'

import { Provider } from 'react-redux'
import store from './redux/store'

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { Toaster } from "sonner"

const persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(

  <Provider store={store}>

    <PersistGate
      loading={null}
      persistor={persistor}
    >

      <App />

      <Toaster
        position="top-right"
        richColors
      />

    </PersistGate>

  </Provider>
)