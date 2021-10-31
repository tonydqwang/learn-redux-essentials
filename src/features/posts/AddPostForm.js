import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPost } from './postsSlice'
import { getUsers } from '../users/usersSlice'

const AddPostForm = (props) => {
  const dispatch = useDispatch()
  const users = useSelector(getUsers)  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [user, setUser] = useState('')
  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
  const onAuthorChanged = e => setUser(e.target.value)
  const [addStatus, setAddStatus] = useState('idle')

  // Boolean(arg) eval to false if undefined or null
  const canSave = () => [ title, content, user ].every(Boolean) && addStatus === 'idle'

  const onSave = async () => {
    if (canSave) {
      setAddStatus('pending')
      try {
        // unwrap() creates promise populated with errors from fetch, so it can be handled
        await dispatch(addPost({ title, content, user })).unwrap()
        setTitle('')
        setContent('')
        setUser('')
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddStatus('idle')
      }
    }
  }

  const userOptions = users.map(user => <option value={user.id} key={user.id}>{user.name}</option>)

  return (
    <section>
      <h2>Add a New Post</h2>
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

export default AddPostForm