import React, { useRef, useState } from 'react'
import InvoiceModal from './components/InvoiceModal'
import Navigation from './components/Navigation'
import Modal from './components/Modal'
import './css/Homepage.css'
import { Slide } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useStateValue } from './StateProvider'

function BasePage() {
  // const [size, setSize] = useState(window.innerWidth)

  const appContentRef = useRef(null)
  // const [{ invoiceModal, modal }, dispatch] = useStateValue()
  const { user } = useStateValue()[0]
  const [showInvoiceModal, setShowInvoice] = useState(false)
  const [showModal, setShowModal] = useState({
    open: false,
    title: 'Are you sure you want to exit?',
    subtitle: 'Your changes will not be saved',
    callback: () => setShowInvoice(false),
  })

  // const checkSize = () => {
  //   setSize(window.innerWidth)
  // }

  // useEffect(() => {
  //   window.addEventListener('resize', checkSize)
  //   return () => {
  //     window.removeEventListener('resize', checkSize)
  //   }
  // }, [])
  // if (size <= 760)
  //   return (
  //     <div className='mobile-message flex flex-column'>
  //       <h2>Oops This app is not compatible with mobile devices!!</h2>
  //       <p>To view this app please use a desktop or tablet</p>
  //     </div>
  //   )
  return (
    <div className='homepage flex flex-column'>
      {user && <Navigation showDialog={setShowModal} />}
      <div className='app-content flex flex-column' ref={appContentRef}>
        {showModal.open && (
          <Modal
            closeFunction={() => setShowModal({ ...showModal, open: false })}
            modalOptions={showModal}
          />
        )}
        <Slide
          direction='right'
          in={showInvoiceModal}
          mountOnEnter
          unmountOnExit
          timeout={800}
        >
          <InvoiceModal
            closeFunction={() => setShowInvoice(false)}
            showModal={() =>
              setShowModal({
                open: true,
                title: 'Are you sure you want to exit?',
                subtitle: 'Your changes will not be saved',
                callback: () => setShowInvoice(false),
              })
            }
          />
        </Slide>
        <Outlet context={[setShowInvoice, setShowModal]} />
      </div>
    </div>
  )
}

export default BasePage