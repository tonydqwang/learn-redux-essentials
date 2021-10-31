import { configureStore } from '@reduxjs/toolkit'
import posts from '../features/posts/postsSlice'
import users from '../features/users/usersSlice'

export default configureStore({
  reducer: {
    posts,
    users,
  },
})
