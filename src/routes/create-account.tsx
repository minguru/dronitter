import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { auth } from "./firebase"
import { FirebaseError } from "firebase/app"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import {
	Wrapper,
	Title,
	Form,
	Input,
	Error,
	Switcher
} from "../components/auth-components"
import { Logo } from "../components/logo"

export default function CreateAccount() {
	const navigate = useNavigate()
	const [isLoading, setLoading] = useState(false)
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target: {name, value} } = e
		if (name === "name") {
			setName(value)
		} else if (name === "password") {
			setPassword(value)
		} else if (name === "email") {
			setEmail(value)
		}
	}
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setError("")

		if (isLoading || name === "" || email === "" || password === "") return

		try {
			setLoading(true)
			const credentials = await createUserWithEmailAndPassword(
				auth, 
				email, 
				password
			)
			await updateProfile(credentials.user, {
				displayName: name
			})

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
		<Title>Join <i>Dronitter</i></Title>
		<Form onSubmit={onSubmit}>
			<Input name="name" value={name} placeholder="Name" type="text" required onChange={onChange}/>
			<Input name="email" value={email} placeholder="E-mail" type="email" required onChange={onChange}/>
			<Input name="password" value={password} placeholder="Password" type="password" required onChange={onChange}/>
			<Input type="submit" value={isLoading ? "Loading..." : "Create Account"} className="create"/>
		</Form>
		{error !== "" ? <Error>{error}</Error> : null}
		<Switcher>
			Already have an account? <Link to="/login">Log in &rarr;</Link>
		</Switcher>
	</Wrapper>
}
