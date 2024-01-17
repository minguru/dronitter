import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { auth } from "./firebase"
import { FirebaseError } from "firebase/app"
import { signInWithEmailAndPassword } from "firebase/auth"
import {
	Wrapper,
	Title,
	Form,
	Input,
	Error,
	Switcher
} from "../components/auth-components"
import GithubButton from "../components/github-button"
import GoogleButton from "../components/google-button"
import { Logo } from "../components/logo"

export default function login() {
	const navigate = useNavigate()
	const [isLoading, setLoading] = useState(false)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target: {name, value} } = e
		if (name === "password") {
			setPassword(value)
		} else if (name === "email") {
			setEmail(value)
		}
	}
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setError("")

		if (isLoading || email === "" || password === "") return

		try {
			setLoading(true)

			await signInWithEmailAndPassword(
				auth, 
				email, 
				password
			)

			navigate("/")

		} catch(err) {
			if (err instanceof FirebaseError) {
				setError(err.message)
			}

		} finally {
			setLoading(false)
		}
		
	}

	return <Wrapper>
		<Logo className="white"></Logo>
		<Title>Log into <i>Dronitter</i></Title>
		<Form onSubmit={onSubmit}>
			<Input name="email" value={email} placeholder="E-mail" type="email" required onChange={onChange}/>
			<Input name="password" value={password} placeholder="Password" type="password" required onChange={onChange}/>
			<Input type="submit" value={isLoading ? "Loading..." : "Log in"} className="login"/>
		</Form>
		{error !== "" ? <Error>{error}</Error> : null}
		<Switcher>
			Don't have an account? <Link to="/create-account">Create one &rarr;</Link>
		</Switcher>
		<GithubButton/>
		<GoogleButton/>
	</Wrapper>
}
