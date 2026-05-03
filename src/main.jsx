import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './styles/global.css'
import './styles/variables.css'
import App from './App.jsx'

const GOOGLE_CLIENT_ID = "66211442729-qkfjd7dadmk82o5t4ummdbvc19b1cta4.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW Registered!', reg))
      .catch(err => console.error('SW Registration failed', err));
  });
}
