import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

// selectors
export const getUsers = state => state.users.userList
export const getUser = id => state => state.users.userList.find(u => u.id === id)
// end selectors

const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
 const response = await client.get('/fakeApi/users')
 return response.data
})

const initialState = {
  userList: [
    { id: '1', name: 'Lily' },
    { id: '2', name: 'Tony' },
  ],
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.userList = state.userList.concat(action.payload)
      // return state.concat(action.payload)
    })
  }
})

// export const { create, update } = usersSlice.actions
export {
  fetchUsers
}
export default usersSlice.reducer