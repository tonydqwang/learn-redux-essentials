import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getPost } from './postsSlice'
import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params
  const post = useSelector(getPost(postId))

  if (!post) {
    return <section><h2>Post not found!</h2></section>
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <PostAuthor user={post.user} />
        <TimeAgo timestamp={post.date} />
        <p className="post-content">{post.content}</p>
        <Link to={`/posts/${post.id}/edit`} className="button">Edit Post</Link>
      </article>
    </section>
  )
}
export default SinglePostPage