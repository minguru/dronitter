import React, { useState } from "react"
import styled from "styled-components"

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 70%;
  margin-top: 35px;
`
const TextArea = styled.textarea`
  border: 1px solid var(--wht);
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: var(--wht);
  background-color: var(--blk);
  width: 100%;
  resize: none;
  outline: none;
  &:focus {
    border-color: var(--pclr);
  }
`
const AttachFileButton = styled.label`
  padding: 10px 0;
  color: var(--wht);
  text-align: center;
  border-radius: 20px;
  border: 1px solid var(--wht);
  &:hover {
    cursor: pointer;
    color: var(--pclr);
    border-color: var(--pclr);
  }
  &.selected {
    border-color: limegreen;
    color: limegreen;
    &:hover {
      cursor: default;
      color: limegreen;
      border-color: limegreen;
    }
  }
`
const AttachFileInput = styled.input`
  display: none;
`
const SubmitButton = styled.input`
  padding: 8px 0;
  text-align: center;
  background-color: var(--wht);
  color: var(--blk);
  font-size: 18px;
  font-weight: 700;
  border-radius: 20px;
  margin-top: 5px;
  &:hover {
    cursor: pointer;
    font-weight: 800;
  }
`

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false)
  const [post, setPost] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(e.target.value)
  }
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {files} = e?.target
    if (files && files.length === 1) {
      setFile(files[0])
    }
  }
  return (
    <Form>
      <TextArea 
        rows={4}
        maxLength={200}
        placeholder="What is happening?"
        value={post}
        onChange={onChange}
      />

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
    </Form>
  )
}
