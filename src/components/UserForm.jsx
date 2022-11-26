import React, { useState } from 'react'
import '../css/LoginForm.css'
import { Email, Lock, Person, Badge } from '@mui/icons-material'
// import { useStateValue } from '../StateProvider'
import { users } from '../devdata/data'
import { uid } from 'uid'

function UserForm({ user, close }) {
  const [details, setDetails] = useState(
    user || {
      email: '',
      password: '',
      name: '',
      role: 'client',
    }
  )
  // const [message, setMessage] = useState('')
  // const dispatch = useStateValue()[1]

  const handleChange = (e) => {
    const { name, value } = e.target
    setDetails({ ...details, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      if (user) {
        // Edit
        users[users.findIndex((u) => u.email === user.email)] = details
      } else {
        // Add
        users.push({ ...details, id: uid() })
      }
      close()
    } catch (error) {}
  }

  return (
    <form
      action=''
      className='loginform'
      style={{ margin: '10px auto' }}
      onSubmit={handleSubmit}
    >
      <div className='input flex flex-column'>
        <label htmlFor='name'>
          <Person />
          Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          required
          value={details.name}
          onChange={handleChange}
        />
      </div>
      <div className='input flex flex-column'>
        <label htmlFor='email'>
          <Email />
          Email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          readOnly={!!user}
          required
          value={details.email}
          onChange={handleChange}
        />
      </div>
      <div className='input flex flex-column'>
        <label htmlFor='role'>
          <Badge />
          Role
        </label>
        <select
          id='role'
          name='role'
          value={details.role}
          onChange={handleChange}
        >
          <option value='client'>Client</option>
          <option value='admin'>Admin</option>
        </select>
      </div>
      {!user && (
        <div className='input flex flex-column'>
          <label htmlFor='password'>
            <Lock />
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            required
            value={details.password}
            onChange={handleChange}
          />
        </div>
      )}
      <div className='flex'>
        <button className='button orange' onClick={() => close()}>
          Cancel
        </button>
        <button className='button purple'>Save</button>
      </div>
    </form>
  )
}

export default UserForm
