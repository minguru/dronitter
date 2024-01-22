import styled from "styled-components"
import { auth, db, storage } from "./firebase"
import { useEffect, useState } from "react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { Interface } from "../components/timeline"
import Posting from "../components/posting"

const Wrapper = styled.div`
height: 100vh;
	display: grid;
	justify-items: center;
	grid-template-rows: 120px 1fr;
	gap: 20px;
	padding: 30px 0 0;
`
const Profile = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 10px;
`
const AvatarUpload = styled.label`
	width: 80px;
	overflow: hidden;
	height: 80px;
	border-radius: 50%;
	background-color: var(--pclr);
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;

	svg {
		height: 50px;
	}
`
const AvatarImage = styled.img`
	width: 100%;
`
const AvatarInput = styled.input`
	display: none;
`
const Name = styled.span`
	font-size: 22px;
`

const Posts = styled.div`
	display: flex;
	flex-direction: column;
	gap: 30px;
	margin-top: 30px;
	overflow-y: overlay;
	overflow-x: hidden;
	&::-webkit-scrollbar {
    background-color: transparent;
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(255, 255, 255, .1);
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, .2);
  }
`

export default function profile() {
	const user = auth.currentUser
	const [ avatar, setAvatar ] = useState(user?.photoURL)
	const [ posts, setPosts ] = useState<Interface[]>([])
	const onAvatarChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target
		if ( !user ) return

		if ( files && files.length === 1 ) {
			const file = files[0]
			const locationRef = ref(storage, `avatars/${user.uid}`)
			const result = await uploadBytes(locationRef, file)
			const avatarUrl = await getDownloadURL(result.ref)
			setAvatar(avatarUrl)
			await updateProfile(user, {
				photoURL: avatarUrl
			})
		}
	}
	const fetchPosts = async () => {
		const postQuery = query(
			collection(db, "posting"),
			where("userId", "==", user?.uid),
			orderBy("createdAt", "desc"),
			limit(25)
		)

		const snapshot = await getDocs(postQuery)
		const posts = snapshot.docs.map(doc => {
			const { desc, createdAt, userId, username, photo } = doc.data()
			return {
				desc,
				createdAt,
				userId,
				username,
				photo,
				id: doc.id
			}
		})
		setPosts(posts)
	}

	useEffect(() => {
		fetchPosts()
	}, [])

	return (
		<>
			<Wrapper>
				<Profile>
					<AvatarUpload htmlFor="avatar">
						{ avatar ? (
						<AvatarImage src={avatar} title="Click to change your avatar"/>
						) : (
						<svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path clipRule="evenodd" fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
						</svg>
						) }
					</AvatarUpload>
					<AvatarInput id="avatar" type="file" accept="image/*" onChange={onAvatarChange} />
					<Name>
						{ user?.displayName ?? "Anonymous" }
					</Name>
				</Profile>

				<Posts>
					{ posts.map(post => <Posting key={post.id} {...post}/>) }
				</Posts>
			</Wrapper>
		</>
	)
}
