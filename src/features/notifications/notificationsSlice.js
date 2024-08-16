import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const notificationsAdapter = createEntityAdapter({ sortComparer: (a, b) => b.date.localeCompare(a.date) })
export const { selectAll: getNotifications } = notificationsAdapter.getSelectors(state => state.notifications)

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
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    markAllRead: (state, action) => {
      Object.values(state.entities).forEach(notification => {
        notification.read = true
      }) // same logic, slight change in data structure
    }
  },
  extraReducers: {
    [ fetchNotifications.fulfilled ]: (state, action) => {
      notificationsAdapter.upsertMany(state, action.payload)
      Object.values(state.entities).forEach(notification => {
        notification.isNew = !notification.read
      }) // same logic, slight change in data structure
    },
  }
})

const { markAllRead } = notificationSlice.actions

export { markAllRead }

export default notificationSlice.reducer