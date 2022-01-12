import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { client } from '../../api/client'

// selectors
const getPosts = state => state.posts.items
const getPostsByUserId = userId => createSelector(
  getPosts, // input selector, yields param 1 of output selector
  state => userId, // input selector, yields param 2 of output selector
  // output selector, run only when any of the input selector results have changed
  (posts, userId) => posts.filter(post => post.user === userId)
)
const getPost = id => state => state.posts.items.find(post => post.id === id)
const getStatus = state => state.posts.status
const getError = state => state.posts.error
// end selectors

const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

const addPost = createAsyncThunk('posts/addPost', async (payload) => {
  const response = await client.post('/fakeApi/posts', payload)
  return response.data
})

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    update: {
      reducer(state, action) {
        const post = state.items.find(post => post.id === action.payload.id)
        Object.assign(post, action.payload)
      },
      prepare(id, title, content, user) { return { payload: {
        date: new Date().toISOString(), 
        id, title, content, user 
      }}},
    },
    react: {
      reducer(state, action) {
        const post = state.items.find(post => post.id === action.payload.id)
        if (!post.reactions) post.reactions = {}
        const reaction = action.payload.reaction
        if (!post.reactions[reaction]) post.reactions[reaction] = 0
        post.reactions[reaction] += 1
      },
      prepare(id, reaction) { return { payload: { id, reaction }}}
    }
  },
  extraReducers: {
      [ fetchPosts.pending ]: (state, action) => { state.status = 'loading' },
      [ fetchPosts.fulfilled ]: (state, action) => { 
        state.status = 'succeeded'
        state.items = state.items.concat(action.payload)
      },
      [ fetchPosts.rejected ]: (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      },
      [ addPost.fulfilled ]: (state, action) => {
        state.items.push(action.payload)
      },
  }
})

const { update, react } = postsSlice.actions

export {
  getPost,
  getPosts,
  getPostsByUserId,
  getStatus,
  getError,
  fetchPosts,
  addPost,
  update,
  react,
}

export default postsSlice.reducer