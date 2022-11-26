import React, { useState } from 'react'
import '../css/LoginForm.css'
import { Engineering, Money } from '@mui/icons-material'
// import { useStateValue } from '../StateProvider'
import { engines } from '../devdata/data'
import { uid } from 'uid'

function EngineForm({ engine, close }) {
  const [details, setDetails] = useState(
    engine || {
      name: '',
      basePrice: '',
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
      if (engine) {
        // Edit
        engines[engines.findIndex((u) => u.name === engine.name)] = details
      } else {
        // Add
        engines.push({ ...details, id: uid() })
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
          <Engineering />
          Engine Name
        </label>
        <input
          type='text'
          id='name'
          required
          name='name'
          value={details.name}
          onChange={handleChange}
        />
      </div>
      <div className='input flex flex-column'>
        <label htmlFor='basePrice'>
          <Money />
          Base Price
        </label>
        <input
          type='basePrice'
          id='basePrice'
          name='basePrice'
          value={details.basePrice}
          onChange={handleChange}
        />
      </div>

      <div className='flex'>
        <button className='button orange' onClick={() => close()}>
          Cancel
        </button>
        <button className='button purple'>Save</button>
      </div>
    </form>
  )
}

export default EngineForm
