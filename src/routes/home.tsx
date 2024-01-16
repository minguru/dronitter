import { Link } from "react-router-dom"
import { auth } from "./firebase"
import styled from "styled-components"

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px 0;

	h1 {
		font-size: 40px;
		font-weight: 800;
	}

	button, .login-button {
		width: 100px;
		border-radius: 50px;
		padding: 5px 0;
		background-color: #fefefe;
		border: none;
		margin-top: 20px;

		&:hover {
			cursor: pointer;
			opacity: 90%;
		}
	}

	.login-button {
		text-align: center;
		color: #101010;
		text-decoration: none;
	}
`

export default function home() {
	const user = auth.currentUser

	const logOut = async () => {
		await auth.signOut()
		window.location.reload()
	}

	return (
		<Wrapper>
			<h1>Welcome{user ? `! ${user.displayName}.` : ` to Dronitter`}</h1>
			{user ? <button onClick={logOut}>Logout</button> : <Link to="/login" className="login-button">Login</Link>}
		</Wrapper>
	)
}
