import { styled } from "styled-components"

const Wrapper = styled.div`
	height: 100vh;
	display: flex;
	justify-content: center;
`
const Text = styled.span`
	font-size: 24px;
`

export default function loadingScreen() {
	return <Wrapper><Text>Loading...</Text></Wrapper>
}
