import { GithubAuthProvider, signInWithPopup } from "firebase/auth"
import styled from "styled-components"
import { auth } from "../routes/firebase"
import { useNavigate } from "react-router-dom"

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
  margin-top: 40px;
  &:hover {
    opacity: 95%;
    cursor: pointer;
  }
`
const Logo = styled.img`
  height: 25px;
`

export default function GithubButton() {
  const navigate = useNavigate()
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider()
      await signInWithPopup(auth, provider)
      navigate("/")
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" />
      Continue with Github
    </Button>
  )
}
