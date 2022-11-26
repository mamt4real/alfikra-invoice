import React from 'react'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useStateValue } from '../StateProvider'

function ProtectedRoute({ children, restrictedTo = [], redirect = '/' }) {
  const loggedInUser = JSON.parse(localStorage.getItem('user'))
  const [{ user }, dispatch] = useStateValue()

  useEffect(() => {
    if (!user && loggedInUser) {
      dispatch({ type: 'SET_USER', data: loggedInUser })
    }
  }, [user, loggedInUser, dispatch])

  if (!loggedInUser) {
    return <Navigate to='/' replace={true} />
  }

  if (restrictedTo.length && !restrictedTo.includes(loggedInUser.role)) {
    return <Navigate to={redirect} replace={true} />
  }

  return <>{children}</>
}

export default ProtectedRoute
