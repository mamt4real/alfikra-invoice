import React, { useState } from 'react'
import '../css/LoginForm.css'
import { Engineering, Money } from '@mui/icons-material'
import db from '../firebase/firebaseInit'
import { useStateValue } from '../StateProvider'

function EngineForm({ engine, close }) {
  const [details, setDetails] = useState(
    engine || {
      name: '',
      constPrice: 0,
      quantity: 0,
      basePrice: 0,
    }
  )
  const [loading, setLoading] = useState(false)
  const dispatch = useStateValue()[1]

  const handleChange = (e) => {
    const { name, value } = e.target
    setDetails({ ...details, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (engine) {
        // Edit
        const updatedE = await db.updateOne('engines', details)
        dispatch({ type: 'UPDATE_ENGINE', data: updatedE })
      } else {
        // Add
        const newE = await db.createOne('engines', details)
        dispatch({ type: 'ADD_ENGINE', data: newE })
      }
      setLoading(false)
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
          type='number'
          min={100}
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
        <button
          className='button purple'
          type='submit'
          disable={loading.toString()}
        >
          {loading
            ? engine
              ? 'Saving...'
              : 'Adding...'
            : engine
            ? 'Save'
            : 'Add'}
        </button>
      </div>
    </form>
  )
}

export default EngineForm
