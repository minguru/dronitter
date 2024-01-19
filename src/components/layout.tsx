import { Link, Outlet } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import { auth } from '../routes/firebase'

const Wrapper = styled.div`
  height: 100%;
  padding: 0;
  width: 100%;
  max-width: 960px;
  display: grid;
  grid-template-columns: 720px 240px;
  margin-left: 240px;
`
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 30px 10px 0;

  a {
    text-decoration: none;
  }
`
const rotate = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`
const MenuItem = styled.div` 
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  svg {
    width: 30px;
    height: 30px;
    fill: var(--wht);
  }

  span {
    color: var(--wht);
    padding-left: 8px;
    font-size: 20px;
  }

  &.log-out {
    svg {
      fill: orangered;
    }
    span {
      color: orangered;
    }
  }

  &:hover {
    svg {
      animation: ${rotate} 250ms ease-out both;
    }

    &.log-out {
      svg {
        fill: red;
        animation: none;
      }
      span {
        color: red;
      }
    }
  }
`

export default function layout() {
  const user = auth.currentUser

  const logOut = async () => {
    const ok = confirm("Are you sure you wanna log out?")

    if (user && ok) {
      await auth.signOut()
      window.location.reload()
    }
	}

  return (
    <Wrapper>
      <Outlet/>

      {user ? (<Menu>
        <Link to="/">
          <MenuItem>
            <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"></path>
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"></path>
            </svg>
            <span>Home</span>
            {/* Home */}
          </MenuItem>
        </Link>


        <Link to="/profile">
          <MenuItem>
            <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
            <span>Profile</span>
            {/* Profile */}
          </MenuItem>
        </Link>


        <MenuItem onClick={logOut} className="log-out">
          <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path clipRule="evenodd" fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6Zm-5.03 4.72a.75.75 0 0 0 0 1.06l1.72 1.72H2.25a.75.75 0 0 0 0 1.5h10.94l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 0 0-1.06 0Z"></path>
          </svg>
          <span>Logout</span>
          {/* Logout */}
        </MenuItem>
      </Menu>) : null}
      
    </Wrapper>
  )
}
