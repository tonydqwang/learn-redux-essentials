import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getPost, getStatus, getError, fetchPosts, getPostIds } from './postsSlice'
import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'
import ReactionButtons from './ReactionButtons'
import { Spinner } from '../../components/Spinner'

  
const PostExcerpt = ({ id }) => {
  const post = useSelector(state => getPost(state, id))
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <PostAuthor user={post.user} />
      <TimeAgo timestamp={post.date} />
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className='button muted-button'>View Post</Link>
    </article>
  )
}

const PostsList = (props) => {
  const dispatch = useDispatch()
  const postIds = useSelector(getPostIds)
  const status = useSelector(getStatus)
  const error = useSelector(getError)
  const renderedPosts = postIds.map(id => <PostExcerpt key={id} id={id}/> )

  useEffect(() => {
    if (status === 'idle') dispatch(fetchPosts())
  }, [status, dispatch])

  let content
  switch (status) {
    case 'loading': content = <Spinner />; break;
    case 'succeeded': content = renderedPosts; break;
    case 'failed': content = <div>{error}</div>; break;
    default: content = null
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      { content }
    </section>
  )
}

export default PostsList