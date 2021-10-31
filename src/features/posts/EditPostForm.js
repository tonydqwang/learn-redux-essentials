import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { update, getPost } from './postsSlice'
import { getUsers } from '../users/usersSlice'
import { useHistory } from 'react-router-dom'

const EditPostForm = ({ match }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const users = useSelector(getUsers)
  const { postId } = match.params
  const post = useSelector(getPost(postId))
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [user, setUser] = useState(post?.user || '')
  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
  const onAuthorChanged = e => setUser(e.target.value)
  
  const onSave = () => {
    dispatch(update(postId, title, content, user))
    history.push(`/posts/${postId}`)
  }

  const canSave = Boolean(title && content && user)
  const userOptions = users.map(user => <option value={user.id} key={user.id}>{user.firstName}</option>)

  return (
    <section>
      <h2>Edit Current Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={user} onChange={onAuthorChanged}>
          <option value=""/>
          {userOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSave} disabled={!canSave}>Save Post</button>
      </form>
    </section>
  )
}

export default EditPostForm