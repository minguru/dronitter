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
const Userimage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--pclr);
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

export default function Posting({ username, photo, desc, userId, id }: Interface) {
  const moreMenu = useRef()
  const [trigger, setTrigger] = useState(false)
  const moreOpen = () => {
    if (!trigger) {
      moreMenu.current.style.display = "block"
      setTrigger(true)
    } else {
      moreMenu.current.style.display = "none"
      setTrigger(false)
    }
  }
  const user = auth.currentUser
  const onDelete = async () => {
    const ok = confirm('Delete the post. Are you sure?')
    if ( !ok || user?.uid !== userId) return

    try {
      await deleteDoc(doc(db, "posting", id))
      const photoRef = ref(storage, `posting/${user.uid}-${user.displayName}/${id}`)
      await deleteObject(photoRef)
    } catch(err) {
      console.log(err)
    } finally {
      // 
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
        <Userimage></Userimage>
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
