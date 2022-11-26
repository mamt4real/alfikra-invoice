import React from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'

function AdminBasePage() {
  // Load Some admin level data

  return (
    <>
      <Outlet context={useOutletContext()} />
    </>
  )
}

export default AdminBasePage
