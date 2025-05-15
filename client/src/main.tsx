import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import router from "./router/router.tsx";
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID as string}>
        <RouterProvider router = {router}></RouterProvider>
      </GoogleOAuthProvider>
    </AuthProvider>
  // </StrictMode>,
)
