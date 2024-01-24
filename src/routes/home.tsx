import { Link } from "react-router-dom"
import styled from "styled-components"
import { auth } from "./firebase"
import { Logo } from '../components/logo'
import PostPostingForm from "../components/post-posting-form"
import Timeline from "../components/timeline"

const Wrapper = styled.div`
	display: grid;
	grid-template-rows: 100px 1fr 1fr 20fr;
	justify-items: center;
	height: 100vh;
	padding: 20px 0 0;

	h1 {
		font-size: 32px;
		font-weight: 700;
	}

	button, .login-button {
		width: 100px;
		border-radius: 50px;
		padding: 5px 0;
		background-color: var(--wht);
		border: none;
		margin-top: 20px;

		&:hover {
			cursor: pointer;
			opacity: 90%;
		}
	}

	.login-button {
		text-align: center;
		color: var(--blk);
		text-decoration: none;
	}
`


export default function home() {
	const user = auth.currentUser

	return (
		<Wrapper>
			<Logo className="white" style={{marginBottom: "10px"}}></Logo>
			<h1>Welcome{user ? `! ${user.displayName}.` : ` to Dronitter`}</h1>
			{user ? (
				<>
					<PostPostingForm/>
					<Timeline/>
				</>
			) : <Link to="/login" className="login-button">Login</Link>}
		</Wrapper>
	)
}
