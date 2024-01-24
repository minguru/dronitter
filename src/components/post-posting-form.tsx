import React, { useState } from "react"
import styled from "styled-components"
import { addDoc, collection, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { auth, db, storage } from "../routes/firebase"

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin: 35px 0 10px;
`
const TextArea = styled.textarea`
  padding: 20px;
  font-size: 16px;
  color: var(--wht);
  background-color: #161616;
  width: 100%;
  resize: none;
  outline: none;
  border: none;
  transition: background-color 500ms ease;
  &:focus {
    background-color: #1e1e1e;
  }
`
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`
const AttachFileButton = styled.label`
  padding: 10px;
  color: var(--wht);
  background-color: var(--pclr);
  font-size: 16px;
  &:hover {
    cursor: pointer;
    color: var(--blk);
  }
  &.selected {
    background-color: limegreen;
    color: var(--blk);
    &:hover {
      cursor: default;
    }
  }
`
const AttachFileInput = styled.input`
  display: none;
`
const SubmitButton = styled.input`
  padding: 8px 10px;
  background-color: var(--wht);
  color: var(--blk);
  font-size: 18px;
  font-weight: 700;
  border: none;
  &:hover {
    cursor: pointer;
    background-color: #222;
    color: var(--wht);
  }
`

export default function PostTweetForm() {
  const [ isLoading, setLoading ] = useState(false)
  const [ post, setPost ] = useState("")
  const [ file, setFile ] = useState<File | null>(null)
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

    if ( file === null ) {
      alert('You must select file to upload.')
      return
    }

    if ( !user || isLoading || post === "" || post.length > 200) return

    try {
      setLoading(true)
      const doc = await addDoc(collection(db, "posting"), {
        desc: post,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
        avatarUrl: user.photoURL
      })

      const locationRef = ref(storage, `posting/${user.uid}/${doc.id}`)

      const result = await uploadBytes(locationRef, file)
      const url = await getDownloadURL(result.ref)
      await updateDoc(doc, {
        photo: url
      })

      setPost("")
      setFile(null)
    } catch(err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Form onSubmit={onSubmit}>
      <TextArea 
        rows={4}
        maxLength={200}
        placeholder="What's your status?"
        value={post}
        onChange={onChange}
        required
      />

      <ButtonWrapper>
        <AttachFileButton 
          htmlFor="file"
          className={file ? "selected" : ""}
        >
          {file ? "Photo selected!" : "Select photo"}
        </AttachFileButton>

        <AttachFileInput 
          type="file" 
          id="file" 
          accept="image/*"
          onChange={onFileChange}
        />

        <SubmitButton 
          type="submit" 
          value={isLoading ? "Posting..." : "Post your fly"}
        />
      </ButtonWrapper>
    </Form>
  )
}
