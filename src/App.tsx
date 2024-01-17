import { useEffect, useState } from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { auth } from "./routes/firebase"
import { createGlobalStyle, styled } from "styled-components"
import reset from "styled-reset"
import Layout from "./components/layout"
import Home from "./routes/home"
import Profile from "./routes/profile"
import Login from "./routes/login"
import CreateAccount from "./routes/create-account"
import LoadingScreen from "./components/loading-screen"
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
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
  :root {
    --pclr: #5400E6; // point color
    --wht: #fefefe;
    --blk: #101010;
  }
  * {
    box-sizing: border-box;
    font-family: Pretendard;
  }
  body {
    background-color: var(--blk);
    color: var(--wht);
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
