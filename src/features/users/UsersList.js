import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUsers } from './usersSlice'

const UsersList = () => {

  const users = useSelector(getUsers)
  return (
    <section>
      <h2>users</h2>
      { users && users.map(user => {
        return (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        )
      })}
    </section>
  )
}

export default UsersList