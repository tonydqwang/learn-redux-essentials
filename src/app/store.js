import { configureStore } from '@reduxjs/toolkit'
import posts from '../features/posts/postsSlice'
import users from '../features/users/usersSlice'
import notifications from '../features/notifications/notificationsSlice'

export default configureStore({
  reducer: {
    posts,
    users,
    notifications,
  },
})
