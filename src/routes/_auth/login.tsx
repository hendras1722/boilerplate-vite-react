import { createFileRoute, redirect } from '@tanstack/react-router'
import { Login } from '../../pages/Login/Login'

// If you are using cookies, you can parse document.cookie here
// You can adjust 'token=' to match the exact name of your cookie
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export const Route = createFileRoute('/_auth/login')({
  beforeLoad: () => {
    // Check if token exists in cookie
    // Change 'token' to 'auth_token' or whatever your cookie name is
    const token = getCookie('token')
    if (token) {
      throw redirect({
        to: '/dashboard', // Redirect to dashboard if already logged in
      })
    }
  },
  component: Login,
})
