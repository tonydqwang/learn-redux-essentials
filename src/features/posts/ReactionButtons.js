import React from 'react'
import { react } from './postsSlice'
import { useDispatch } from 'react-redux'

const reactions = { thumbsUp: '👍', hooray: '🎉', heart: '❤️', rocket: '🚀', eyes: '👀' }

const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch()
  const reactionButtons = Object.entries(reactions).map(([name, emoji]) => {
    return (
      <button 
        key={name} type="button" 
        className="muted-button reaction-button"
        onClick={() => { dispatch(react(post.id, name))}}
      >
        {emoji} {post.reactions && post.reactions[name]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
export default ReactionButtons