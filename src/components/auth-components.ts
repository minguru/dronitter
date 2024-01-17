import { styled } from "styled-components"

export const Wrapper = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 420px;
	padding: 20px 0;
`
export const Title = styled.h1`
	font-size: 32px;
`
export const Form = styled.form`
	margin-top: 50px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
`
export const Input = styled.input`
	padding: 10px 20px;
	border-radius: 50px;
	border: none;
	width: 100%;
	font-size: 16px;
	&[type="submit"] {
		cursor: pointer;
		margin-top: 5px;
    &.login {
      background-color: #202020;
      color: var(--wht);
      &:hover {
        background-color: #303030;
      }
    }
    &.create {
      background-color: #eee;
      &:hover {
        opacity: 80%;
      }
    }
	}
`
export const Error = styled.span`
	font-weight: 600;
	color: tomato;
	margin-top: 12px;
`
export const Switcher = styled.span`
	margin-top: 20px;
`