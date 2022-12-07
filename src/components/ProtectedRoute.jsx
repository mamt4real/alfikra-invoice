import React from 'react'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useStateValue } from '../StateProvider'
import db from '../firebase/firebaseInit'

function ProtectedRoute({ children, restrictedTo = [], redirect = '/' }) {
  const [{ user }, dispatch] = useStateValue()
  const loggedInUser = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    // db.userChanged(db.auth, (user) => {
    //   dispatch({ type: 'SET_USER', data: db.getOne('users', user.id) })
    // })
    if (!user && loggedInUser) {
      db.getOne('users', loggedInUser.id)
        .then((updated) => dispatch({ type: 'SET_USER', data: updated }))
        .catch((err) => localStorage.setItem('user', null))
    }
  }, [user, loggedInUser, dispatch])

  if (!loggedInUser) {
    return <Navigate to='/' replace={true} />
  }

  if (restrictedTo.length && !restrictedTo.includes(loggedInUser?.role)) {
    return <Navigate to={redirect} replace={true} />
  }

  return <>{children}</>
}

export default ProtectedRoute
