import React from 'react'
import { useSelector } from 'react-redux'
import { getUser } from './usersSlice'
import { getPostsByUserId } from '../posts/postsSlice'
import { Link } from 'react-router-dom'


const UserPage = ({ match }) => {
  const { userId } = match.params
  const user = useSelector(getUser(userId))
  const posts = useSelector(getPostsByUserId(userId))

  const postTitles = posts.map(post => {
    return (
      <li key={post.id}>
        <Link to={`../posts/${post.id}`}>{post.title}</Link>
      </li>
    )
  })

  return (
    <>
      <h2>{`${user.name}`}</h2>
      <ol>
        {postTitles}
      </ol>
    </>
  )
}

export default UserPage