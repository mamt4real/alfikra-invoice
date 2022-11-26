import React, { useEffect, useState } from 'react'
import {
  Link,
  useOutletContext,
  useParams,
  useNavigate,
} from 'react-router-dom'
import '../css/InvoicePage.css'
import { useStateValue } from '../StateProvider'
import arrowLeft from '../assets/icon-arrow-left.svg'
import { formatdate } from '../reducer'
import db from '../firebase/firebaseInit'
import Loading from '../components/Loading'

function InvoicePage() {
  const params = useParams()
  const navigate = useNavigate()
  const [{ currentInvoice }, dispatch] = useStateValue()

  const [submitting, setSubmitting] = useState(false)

  const [fn, setShowModal] = useOutletContext()

  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_INVOICE', data: params.invoiceID })
    return () => dispatch({ type: 'SET_CURRENT_INVOICE', data: null })
  }, [dispatch, params.invoiceID])

  const toggleInvoiceEdit = (id) => {
    fn(true)
  }

  const deleteInvoice = (id) => {
    const effectDelete = async () => {
      setSubmitting(true)
      try {
        // const docref = db.doc(db.db, 'invoices', id)
        await db.deleteOne('invoices', id)
        dispatch({ type: 'DELETE_INVOICE', data: id })
        dispatch({ type: 'SET_CURRENT_INVOICE', data: null })
      } catch (error) {
        console.log(error)
        alert(error.message)
      }
      setSubmitting(false)
    }
    setShowModal({
      open: true,
      title: 'Are you sure you want to delete this invoice?',
      subtitle: "This action can't be reversed!",
      callback: () =>
        effectDelete()
          .then(() => navigate('/'))
          .catch((err) => alert(err.message)),
    })
  }

  const updateStatus = (status) => {
    const currentStatus = 'invoice' + status
    const updatedStatus = {
      invoicePending: null,
      invoicePaid: null,
      invoiceDraft: null,
      [currentStatus]: true,
    }
    setSubmitting(true)
    const effectChanges = async () => {
      try {
        // const docref = db.doc(db.db, 'invoices', currentInvoice.id)
        // await db.updateDoc(
        //   docref,
        //   updatedStatus,
        //   { merge: true }
        // )
        await db.updateOne('invoices', currentInvoice.id, updatedStatus)
      } catch (error) {
        console.log(error)
        alert(error.message)
      }
    }
    effectChanges()
      .then((res) => {
        dispatch({
          type: 'UPDATE_INVOICE',
          data: { ...currentInvoice, updatedStatus },
        })
        dispatch({
          type: 'SET_CURRENT_INVOICE',
          data: currentInvoice.id,
        })
        setSubmitting(false)
      })
      .catch((err) => {
        alert(err.message)
        setSubmitting(false)
      })
  }

  return currentInvoice ? (
    <div className='invoicepage container'>
      <Link to={'/invoices'} className='nav-link'>
        <img src={arrowLeft} alt='' /> Go back
      </Link>
      {/* header */}
      {submitting && <Loading />}
      <div className='header flex'>
        <div className='left flex'>
          <span>Status</span>
          <div
            className={`status-button flex ${
              currentInvoice.invoicePaid ? 'paid' : ''
            } ${currentInvoice.invoicePending ? 'pending' : ''} ${
              currentInvoice.invoiceDraft ? 'draft' : ''
            }`}
          >
            <span>
              {currentInvoice.invoicePaid
                ? 'Paid'
                : currentInvoice.invoiceDraft
                ? 'Draft'
                : 'Pending'}
            </span>
          </div>
        </div>
        <div className='right flex'>
          <button
            className='dark-purple'
            onClick={() => toggleInvoiceEdit(currentInvoice.id)}
          >
            Edit
          </button>
          <button
            className='red'
            onClick={() => deleteInvoice(currentInvoice.id)}
          >
            Delete
          </button>
          {currentInvoice.invoicePending ? (
            <button className='green' onClick={() => updateStatus('Paid')}>
              Mark as Paid
            </button>
          ) : (
            (currentInvoice.invoiceDraft || currentInvoice.invoicePaid) && (
              <button
                className='orange'
                onClick={() => updateStatus('Pending')}
              >
                {' '}
                Mark as Pending
              </button>
            )
          )}
        </div>
      </div>

      {/* invoice details */}

      <div className='invoice-details flex flex-column'>
        <div className='top flex'>
          <div className='left flex flex-column'>
            <p>
              <span>#</span>
              {currentInvoice.id}
            </p>
            <p>{currentInvoice.productDescription}</p>
          </div>

          <div className='right flex flex-column'>
            <p>{currentInvoice.billerStreetAddress}</p>
            <p>{currentInvoice.billerCity}</p>
            <p>{currentInvoice.billerZipCode}</p>
            <p>{currentInvoice.billerCountry}</p>
          </div>
        </div>

        <div className='middle flex'>
          <div className='payment flex flex-column'>
            <h4>Invoice Date</h4>
            <p>{formatdate(currentInvoice.invoiceDate)}</p>

            <h4>Payment Date</h4>
            <p>{formatdate(currentInvoice.paymentDueDate)}</p>
          </div>
          <div className='bill flex flex-column'>
            <h4>Bill to</h4>
            <p>{currentInvoice.clientName}</p>
            <p>{currentInvoice.clientStreetAddress}</p>
            <p>{currentInvoice.clientCity}</p>
            <p>{currentInvoice.clientZipCode}</p>
            <p>{currentInvoice.clientCountry}</p>
          </div>
          <div className='send-to flex flex-column'>
            <h4>Sent to</h4>
            <p>{currentInvoice.clientEmail}</p>
          </div>
        </div>

        <div className='bottom flex flex-column'>
          <div className='billing-items'>
            <div className='heading flex'>
              <p>Item Name</p>
              <p>QTY</p>
              <p>Price</p>
              <p>Total</p>
            </div>
            {currentInvoice.invoiceItemList?.map((item, i) => (
              <div className='item flex' key={i + 1}>
                <p>{item.itemName}</p>
                <p>{item.qty}</p>
                <p>{item.price}</p>
                <p>{item.total}</p>
              </div>
            ))}
          </div>
          <div className='total flex'>
            <p>Amount Due</p>
            <p>{currentInvoice.invoiceTotal}</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className=''></div>
  )
}

export default InvoicePage
