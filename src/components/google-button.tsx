import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import styled from "styled-components"
import { auth } from "../routes/firebase"
import { useNavigate } from "react-router-dom"

const Button = styled.span`
  background-color: #fefefe;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  color: #101010;
  margin-top: 10px;
  &:hover {
    opacity: 95%;
    cursor: pointer;
  }
`
const Logo = styled.img`
  height: 25px;
`

export default function GoogleButton() {
  const navigate = useNavigate()
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      navigate("/")
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <Button onClick={onClick}>
      <Logo src="/google-logo.svg" />
      Continue with Google
    </Button>
  )
}
