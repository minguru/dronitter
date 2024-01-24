import { useRef, useState } from "react"
import styled from "styled-components"
import { deleteDoc, doc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import { auth, db, storage } from "../routes/firebase"
import { Interface } from "./timeline"
import EditPosting from "./edit-posting"

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-gap: 10px;
  justify-content: space-between;
  position: relative;
`
const Column = styled.div`
  
`
const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--pclr);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
  svg {
    height: 50%;
  }
`
const Photo = styled.img`
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
  border-radius: 15px;
`
const Username = styled.span`
  display: block;
  font-weight: 600;
  font-size: 15px;
  padding-top: 6px;
`
const Payload = styled.p`
  font-weight: 400;
  margin: 10px 0px;
  font-size: 16px;
`
const MoreButton = styled.div`
  position: absolute;
  right: 10px; top: 10px;
  >span {
    svg {
      width: 30px;
      height: 30px;
      fill: #404040;
  
      &:hover {
      cursor: pointer;
        fill: #666;
    }
  }

  }
  
  ul {
    position: absolute;
    top: 100%;
    right: 0;
    display: none;
    border-radius: 8px;
    overflow: hidden;

    li {
      background-color: var(--blk);
      padding: 5px 10px;
      width: 100px;
      line-height: 25px;
      &:hover {
        cursor: pointer;
        background-color: #404040;
      }
    }
  }
`

export default function Posting({ username, photo, desc, userId, id, avatarUrl }: Interface) {
  const user = auth.currentUser
  const moreMenu = useRef()
  const [ trigger, setTrigger ] = useState(false)
  const [ avatar, setAvatar ] = useState(avatarUrl)
  const moreOpen = () => {
    if (!trigger) {
      moreMenu.current.style.display = "block"
      setTrigger(true)
    } else {
      moreMenu.current.style.display = "none"
      setTrigger(false)
    }
  }
  const onDelete = async () => {
    const ok = confirm('Delete the post. Are you sure?')
    if ( !ok || user?.uid !== userId) return

    try {
      await deleteDoc(doc(db, "posting", id))
      const photoRef = ref(storage, `posting/${user.uid}-${user.displayName}/${id}`)
      await deleteObject(photoRef)
    } catch(err) {
      console.log(err)
    }
  }
  const [modal, setModal] = useState(false)
  const onEdit = async () => {
    moreMenu.current.style.display = "none"
    setTrigger(false)
    if (!modal) setModal(true)
    else setModal(false)
  }
  const modalClosed = (data) => {
    setModal(data)
  }

  return (
    <Wrapper>
      <Column>
        <UserAvatar>
          { avatar ? (
            <div style={{backgroundImage: `url(${avatar})`}} />
          ) : (
            <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          ) }
        </UserAvatar>
      </Column>
      <Column>
        <Username>{username}</Username>
        <Payload>{desc}</Payload>
        <Photo src={photo}/>
        <MoreButton>
          <span onClick={moreOpen}>
            <svg data-slot="icon" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12.5 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
            </svg>
          </span>
          <ul ref={moreMenu}>
            {user?.uid === userId ? (
              <>
                <li onClick={onEdit}>Edit</li>
                <li onClick={onDelete}>Delete</li>
              </>
            ) : (
              <>
                <li>Share</li>
                <li>Report</li>
              </>
            )}
            
          </ul>
        </MoreButton>
      </Column>
      {modal && <EditPosting modalClose={modalClosed} desc={desc} userId={userId} db={db} dataid={id}/>}
    </Wrapper>
  )
}
