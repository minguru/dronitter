import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from './components/layout'
import Home from './routes/home'
import Profile from './routes/profile'
import Login from './routes/login'
import CreateAccount from './routes/create_account'
import { createGlobalStyle } from "styled-components"
import reset from 'styled-reset'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: '',
        element: <Home/>
      },
      {
        path: 'profile',
        element: <Profile/>
      }
    ]
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/create-account',
    element: <CreateAccount/>
  }
])

const GlobalStyles = createGlobalStyle`
  ${reset};
  body {
    background-color: #101010;
    color: #fefefe;
    font-family: system-ui;
  }
`

function App() {
  return (
    <>
      <GlobalStyles/>
      <RouterProvider router={router} />
    </>
  )
}

export default App
