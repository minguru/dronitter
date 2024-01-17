import { Link } from "react-router-dom"
import { auth } from "./firebase"
import styled from "styled-components"
import { Logo } from '../components/logo'
import PostTweetForm from "../components/post-tweet-form"

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
				<PostTweetForm/>
			) : <Link to="/login" className="login-button">Login</Link>}
		</Wrapper>
	)
}
