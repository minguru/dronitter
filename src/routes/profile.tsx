import styled from "styled-components"
import { auth, db, storage } from "./firebase"
import { useEffect, useState } from "react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { collection, doc, getDocs, limit, orderBy, query, updateDoc, where } from "firebase/firestore"
import Posting from "../components/posting"
import { Link } from "react-router-dom"
import { Interface } from "../components/timeline"

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
	position: relative;

	svg {
		height: 50px;
	}

	.avatar-hover {
		position: absolute;
		left: 0; top: 0;
		width: 100%; height: 100%;
		background-color: rgba(0,0,0,.75);
		justify-content: center;
		align-items: center;
		display: none;
		
		svg {
			width: 40px;
			fill: rgba(255, 255, 255, 0.85)
		}
	}

	&:hover .avatar-hover {
		display: flex;
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
	display: flex;

	.name-edit {
		display: none;
		vertical-align: middle;

		&:hover {
			cursor: pointer;
		}

		svg {
			width: 20px;
		}
	}

	&:hover {
		margin-right: -20px;
		.name-edit {
			display: inline;
		}
	}
`
const MyPosts = styled.div`
	width: 100%;
	overflow-x: hidden;
	overflow-y: overlay;
	display: flex;
	flex-direction: column;
	gap: 30px;
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

	.post-nothing {
		width: 100%;
		text-align: center;
		p {
			color: #666;
			font-size: 24px;
			span {
				font-size: 18px;
				display: inline-block;
				margin-top: 15px;
			}
		}
	}
`

export default function profile() {
	const user = auth.currentUser
	const [ avatar, setAvatar ] = useState(user?.photoURL)
	const [ posts, setPosts ] = useState<Interface[]>([])
	const [ username, setUsername ] = useState(user?.displayName)
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
	const onNameEdit = async () => {
		if ( !user ) return

		const nameToUpdate: string | null = prompt("Type your name to update.", user.displayName?.toString())
		const regExp = /^[가-힣a-zA-Z0-9]+$/

		if ( nameToUpdate === "" ) {
			alert('Please insert your name to update.')
			return
		} else if ( nameToUpdate === user.displayName ) {
			alert('Please type your name to UPDATE.')
			return
		} else if ( nameToUpdate === null ) {
			return
		}

		if ( !regExp.test(nameToUpdate) ) {
			alert('Please use correct username.')
			return
		}

		try {
			// posting username update
			const querySnapshot = await getDocs(collection(db, "posting"))
			querySnapshot.forEach(docu => {
				const docRef = doc(db, "posting", docu.id)
				updateDoc(docRef, {
					username: nameToUpdate
				})
			})

			// display name update
			await updateProfile(user, {
				displayName: nameToUpdate
			})
		} catch(err) {
			console.log(err)
		} finally {
			setUsername(nameToUpdate)
		}
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
						<div className="avatar-hover">
							<svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
								<path clipRule="evenodd" fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
							</svg>
						</div>
					</AvatarUpload>
					<AvatarInput id="avatar" type="file" accept="image/*" onChange={onAvatarChange} />
					<Name>
						{ username ?? "Anonymous" }
						<span className="name-edit" onClick={onNameEdit}>
							<svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
							</svg>
						</span>
					</Name>
				</Profile>

				<MyPosts>
					{ posts.length === 0 ? (
						<div className="post-nothing">
							<p>There is nothing!<br /><span>Please go back to <Link to="/">Home</Link> and upload some post!</span></p>
						</div>
					) : (
						posts.map(post => <Posting key={post.id} {...post}/>)
					) }
				</MyPosts>
			</Wrapper>
		</>
	)
}
