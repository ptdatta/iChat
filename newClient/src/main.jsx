import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App'
import { Provider } from 'react-redux';
import './index.css'
import store from './Redux/conigureStore';
import ChatProvider from './Context/ChatProvider';



ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </Provider>,
)

