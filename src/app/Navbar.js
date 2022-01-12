import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, getNotifications } from '../features/notifications/notificationsSlice';

export const Navbar = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(getNotifications)
  const numUnreadNotifications = notifications.filter(n => !n.read).length

  let unreadNotificationsBadge
  if (numUnreadNotifications > 0) {
    unreadNotificationsBadge = <span className="badge">{numUnreadNotifications}</span>
  }
  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>
        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">Notifications {unreadNotificationsBadge}</Link>
          </div>
          <button className="button" onClick={() => dispatch(fetchNotifications())}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  )
}
