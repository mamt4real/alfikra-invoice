import React from 'react'
import '../css/Landing.css'
import LoginForm from '../components/LoginForm'

function Landing() {
  return (
    <div className='landing container'>
      <section className='left'>
        <div className='titles'>
          <h2>AL-FIKRA GENERAL ENTERPRISE</h2>
          <span>Importers and Exporters of HONDA spare parts</span>
        </div>
        <p>Invoice Management System</p>
      </section>
      <section className='right'>
        <h1>
          <LoginForm />
        </h1>
      </section>
    </div>
  )
}

export default Landing
