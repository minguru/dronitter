import { useState } from "react"
import styled from "styled-components"
import { doc, updateDoc } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { auth, storage } from "../routes/firebase"

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 10000;
  background-color: rgba(0,0,0,.5);
  display: flex;
  justify-content: center;
  align-items: center;
`
const Form = styled.form`
  background-color: var(--wht);
  width: 600px;
  border-radius: 10px;
  padding: 30px;
  position: relative;
`
const TextArea = styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  background-color: #fafafa;
  transition: background-color 500ms ease;
  outline: none;
  padding: 10px;
  &:focus {
    background-color: #f0f0f0;
  }
`
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`
const AttachFileButton = styled.label`
  color: var(--blk);
  border: 1px solid var(--blk);
  padding: 10px;
  font-size: 16px;
  line-height: 20px;
  &:hover {
    cursor: pointer;
  }
  &.selected {
    background-color: limegreen;
    border: none;
    &:hover {
      cursor: default;
    }
  }
`
const AttachFileInput = styled.input`
  display: none;
`
const SubmitButton = styled.input`
  border: 1px solid var(--blk);
  color: var(--blk);
  background-color: var(--wht);
  padding: 10px;
  font-size: 18px;
  font-weight: 500;
  line-height: 20px;
  &:hover {
    cursor: pointer;
  }
`
const CancelButton = styled.div`
  position: absolute;
  right: 10px;
  bottom: calc(100% + 10px);
  &:hover {
    cursor: pointer;
  }
  svg {
    width: 30px;
    height: 30px;
  }
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditPosting(props: any) {
  const [popup, setPopup] = useState(true)
  const [isLoading, setLoading] = useState(false)
  const beforeDesc = props.desc
  const [post, setPost] = useState(props.desc)
  const [file, setFile] = useState<File | null>(null)
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(e.target.value)
  }
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (files && files.length === 1) {
      const file = files[0]
      
      if (file.size > 2000000) {
        alert('Please don\'t get over 2MB of file size!')
      } else {
        setFile(file)
      }
    }
  }
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser
    
    if ( !user || user?.uid !== props.userId || beforeDesc === post || post === "" ) return

    try {
      setLoading(true)
      await updateDoc(doc(props.db, "posting", props.dataid), {
        desc: post,
        createdAt: Date.now()
      })

      if (file) {
        const photoRef = ref(storage, `posting/${user.uid}-${user.displayName}/${props.dataid}`)
        await deleteObject(photoRef)

        const locationRef = ref(storage, `posting/${user.uid}-${user.displayName}/${props.dataid}`)

        const result = await uploadBytes(locationRef, file)
        const url = await getDownloadURL(result.ref)
        await updateDoc(doc(props.db, "posting", props.dataid), {
          photo: url
        })
      }
    } catch(err) {
      console.log(err)
    } finally {
      setLoading(false)
      onExit()
    }
  }
  const onExit = () => {
    setPopup(false)
    props.modalClose(false)
  }
  return (
    <>
      {popup ? (
        <Wrapper>
        <Form onSubmit={onSubmit}>
          <TextArea 
            rows={4}
            maxLength={200}
            onChange={onChange}
            defaultValue={props.desc}
          />

          <ButtonWrapper>
            <AttachFileButton 
              htmlFor="update_file"
              className={file ? "selected" : ""}
            >
              {file ? "Photo selected!" : "Update photo"}
            </AttachFileButton>

            <AttachFileInput 
              type="file" 
              id="update_file" 
              accept="image/*"
              onChange={onFileChange}
            />

            <SubmitButton 
              type="submit" 
              value={isLoading ? "Updating..." : "Update your fly"}
            />
          </ButtonWrapper>
          <CancelButton onClick={onExit}>
              <svg data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"></path>
              </svg>
          </CancelButton>
        </Form>
      </Wrapper>
      ) : null}
    </>
  )
}
