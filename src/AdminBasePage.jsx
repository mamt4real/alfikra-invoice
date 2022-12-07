import React, { useEffect } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import { useStateValue } from './StateProvider'
import db from './firebase/firebaseInit'

function AdminBasePage() {
  // Load Some admin level data

  const dispatch = useStateValue()[1]

  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_STAFFS', data: await db.getAll('users') })
    }
    loadData()
  }, [])

  return (
    <>
      <Outlet context={useOutletContext()} />
    </>
  )
}

export default AdminBasePage
