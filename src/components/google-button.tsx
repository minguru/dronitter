import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../routes/firebase"

const Button = styled.span`
  background-color: var(--wht);
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  color: var(--blk);
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
