import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const usersAdapter = createEntityAdapter()
const initialState = usersAdapter.getInitialState()

// selectors
export const { 
  selectAll: getUsers, 
  selectById: getUser 
} = usersAdapter.getSelectors(state => state.users)
// end selectors

const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
 const response = await client.get('/fakeApi/users')
 return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
  }
})

export {
  fetchUsers
}
export default usersSlice.reducer