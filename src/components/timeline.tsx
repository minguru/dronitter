import { useEffect, useState } from "react"
import styled from "styled-components"
import { Unsubscribe } from "firebase/auth"
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../routes/firebase"
import Posting from "./posting"

export interface Interface {
  id: string;
  photo: string;
  desc: string;
  userId: string;
  username: string;
  createdAt: number;
  avatarUrl: string;
}

const Wrapper = styled.div`
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
`

export default function Timeline() {
  const [posts, setPosts] = useState<Interface[]>([])

  useEffect(() => {
    let unsubscribe : Unsubscribe | null = null
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "posting"),
        orderBy("createdAt", "desc"),
        limit(25)
      )
      /* const snapshot = await getDocs(postsQuery)
      const posts = snapshot.docs.map(doc => {
        const {desc, createdAt, userId, username, photo} = doc.data()
        return {
          desc,
          createdAt,
          userId,
          username,
          photo,
          id: doc.id
        }
      }) */
      unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map(doc => {
          const { desc, createdAt, userId, username, photo, avatarUrl } = doc.data()
          return {
            desc,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
            avatarUrl
          }
        })
        setPosts(posts)
      })
    }
    fetchPosts()
    return () => {
      unsubscribe && unsubscribe()
    }
  }, [])

  return (
    <Wrapper>
      {posts.map(post => <Posting key={post.id} {...post} />)}
    </Wrapper>
  )
}
