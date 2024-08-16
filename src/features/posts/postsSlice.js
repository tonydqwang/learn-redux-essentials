import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { createEntityAdapter } from '@reduxjs/toolkit'

const postsAdapter = createEntityAdapter({ sortComparer: (a, b) => b.date.localeCompare(a.date) })

// selectors
const getPostsByUserId = userId => createSelector(
  getPosts, // input selector, yields param 1 of output selector
  state => userId, // input selector, yields param 2 of output selector
  // output selector, run only when any of the input selector results have changed
  (posts, userId) => posts.filter(post => post.user === userId)
)
const getStatus = state => state.posts.status
const getError = state => state.posts.error
const { // expose built-in selectors
  selectAll: getPosts,
  selectById: getPost,
  selectIds: getPostIds,
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)
// end selectors

const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

const addPost = createAsyncThunk('posts/addPost', async (payload) => {
  const response = await client.post('/fakeApi/posts', payload)
  return response.data
})

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null
}) // populate initial state with {ids: [], entities: {}} among others

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    update: {
      reducer(state, action) {
        const post = state.entities[action.payload.id];
        Object.assign(post, action.payload)
      },
      prepare(id, title, content, user) { return { payload: {
        date: new Date().toISOString(), 
        id, title, content, user 
      }}},
    },
    react: {
      reducer(state, action) {
        const { id, reaction } = action.payload
        const post = state.entities[id]
        if (!post.reactions) post.reactions = {}
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
        // Add any fetched posts to the array
        // Use the `upsertMany` reducer as a mutating update utility
        postsAdapter.upsertMany(state, action.payload)
      },
      [ fetchPosts.rejected ]: (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      },
      [ addPost.fulfilled ]: (state, action) => {
        postsAdapter.addOne(action.payload)
      },
  }
})

const { update, react } = postsSlice.actions

export {
  getPost,
  getPosts,
  getPostIds,
  getPostsByUserId,
  getStatus,
  getError,
  fetchPosts,
  addPost,
  update,
  react,
}

export default postsSlice.reducer