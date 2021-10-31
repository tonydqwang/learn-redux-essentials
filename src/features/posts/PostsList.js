import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getPosts, getStatus, getError, fetchPosts } from './postsSlice'
import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'
import ReactionButtons from './ReactionButtons'
import { Spinner } from '../../components/Spinner'

const PostsList = (props) => {
  const dispatch = useDispatch()
  const posts = useSelector(getPosts)
  const status = useSelector(getStatus)
  const error = useSelector(getError)

  const orderedPosts = posts.slice().sort((a,b)=> {
    return b.date.toString().localeCompare(a.date)
  })
  
  const renderedPosts = orderedPosts.map(post => (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <PostAuthor user={post.user} />
      <TimeAgo timestamp={post.date} />
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className='button muted-button'>View Post</Link>
    </article>
  ))

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