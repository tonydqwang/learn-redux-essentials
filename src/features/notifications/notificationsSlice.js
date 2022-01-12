import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

export const getNotifications = state => state.notifications

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', 
  async (
    _, // 1st arg to createAsyncThunk's action creator is the arg passed in when thunk is invoked
    // if we were to fetch a specific notification by id, it would've been passed in through here
    // in this case, there is no arg, so underscore is placed here as placeholder
  {
    // 2nd arg is thunk api object, useful fns provided by createAsyncThunk 
    getState,
    dispatch, 
    extra, // set when creating store, useful for passing client configs into thunk logic
    requestId, // random id useful for tracing
    signal, // can be used to cancel in-progress function
    rejectWithValue, // customize reject action payload
  }) => {
    dispatch(markAllRead())
    const [ latestNotification ] = getNotifications(getState())
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(`/fakeApi/notifications?since=${latestTimestamp}`)
    return response.data
  }
)

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    markAllRead: (state, action) => {
      state.forEach(notification => {
        notification.read = true;
      })
    }
  },
  extraReducers: {
    [ fetchNotifications.fulfilled ]: (state, action) => {
      state.push(...action.payload);
      state.forEach(notification => {
        notification.isNew = !notification.read
      })
      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date))
    },
  }
})

const { markAllRead } = notificationSlice.actions

export { markAllRead }

export default notificationSlice.reducer