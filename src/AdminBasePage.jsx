import React, { useEffect } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import { useStateValue } from './StateProvider'
import db from './firebase/firebaseInit'

function AdminBasePage() {
  // Load Some admin level data

  const dispatch = useStateValue()[1]

  useEffect(() => {
    let isCanceled = false
    const loadData = async () => {
      const data = await db.getAll('users')
      if (!isCanceled) dispatch({ type: 'SET_STAFFS', data })
    }
    loadData()
    return () => {
      isCanceled = true
    }
  }, [])

  return (
    <>
      <Outlet context={useOutletContext()} />
    </>
  )
}

export default AdminBasePage
