import React from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../users/usersSlice'

const PostAuthor = ({ user }) => {
  const userFound = useSelector(getUser(user))
  return <span>by {userFound ? userFound.name : 'Unknown author'}</span>
}
export default PostAuthor