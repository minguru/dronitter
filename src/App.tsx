import { useEffect, useState } from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { createGlobalStyle, styled } from "styled-components"
import reset from "styled-reset"
import Layout from "./components/layout"
import Home from "./routes/home"
import Profile from "./routes/profile"
import Login from "./routes/login"
import CreateAccount from "./routes/create_account"
import LoadingScreen from "./components/loading-screen"
import { auth } from "./routes/firebase"
import ProtectedRoute from "./components/protected-route"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "",
        element: <Home/>
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/create-account",
    element: <CreateAccount/>
  }
])

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: #101010;
    color: #fefefe;
    font-family: system-ui;
  }
  i {
    font-style: italic;
  }
`
const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  
`

function App() {
  const [isLoading, setLoading] = useState(true)
  const init = async() => {
    // wait for firebase
    await auth.authStateReady()
    setLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <Wrapper>
      <GlobalStyles/>
      {isLoading ? <LoadingScreen/> : <RouterProvider router={router}/>}
    </Wrapper>
  )
}

export default App
