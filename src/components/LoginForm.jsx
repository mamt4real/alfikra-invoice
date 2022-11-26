import React, { useState } from 'react'
import '../css/LoginForm.css'
import { Email, Lock } from '@mui/icons-material'
import { useStateValue } from '../StateProvider'
import { users } from '../devdata/data'
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const [details, setDetails] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const dispatch = useStateValue()[1]
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setDetails({ ...details, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      const user = users.find(
        (user) =>
          user.email === details.email && user.password === details.password
      )
      if (user) {
        dispatch({ type: 'SET_USER', data: user })
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/invoices')
      } else {
        setMessage('Invalid Credentials')
      }
    } catch (error) {}
  }

  return (
    <form action='' className='loginform' onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      {message && <div className='message'>{message}</div>}
      <div className='input flex flex-column'>
        <label htmlFor='clientPhone'>
          <Email />
          Email
        </label>
        <input
          type='text'
          id='email'
          name='email'
          value={details.email}
          onChange={handleChange}
        />
      </div>
      <div className='input flex flex-column'>
        <label htmlFor='clientPhone'>
          <Lock />
          Password
        </label>
        <input
          type='password'
          id='password'
          name='password'
          value={details.password}
          onChange={handleChange}
        />
      </div>
      <button className='button purple login_btn'>Login</button>
      {/* <div className='input'>
      </div> */}
    </form>
  )
}

export default LoginForm
