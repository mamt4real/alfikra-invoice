import React, { useState, forwardRef } from 'react'
import deleteIcon from '../assets/icon-delete.svg'
import plusIcon from '../assets/icon-plus.svg'
import '../css/InvoiceModal.css'
import db from '../firebase/firebaseInit'
import { useStateValue } from '../StateProvider'
import Loading from './Loading'
// import { formatdate } from '../reducer'
import { engines } from '../devdata/data'
import { formatMoney } from '../reducer'

const emptyInvoice = {
  clientName: '',
  clientPhone: '',
  clientAddress: '',
  clientCity: '',
  invoiceDateUnix: '',
  invoiceDate: new Date(),
  paymentDueDate: new Date(),
  paymentDueDateUnix: '',
  productDescription: '',
  invoicePending: '',
  invoiceDraft: '',
  invoicePaid: '',
  invoiceItemList: [{ itemName: '', engineNo: '', qty: 0, price: 0, total: 0 }],
  invoiceTotal: 0,
  printed: false,
  userID: null,
}

const InvoiceModal = forwardRef(({ closeFunction, showModal }, ref) => {
  const [{ currentInvoice, user }, dispatch] = useStateValue()
  const [invoice, setInvoice] = useState(currentInvoice || emptyInvoice)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    const newInvoice = { ...invoice, [name]: value }
    if (name === 'paymentTerms')
      newInvoice.paymentDueDate = new Date(
        newInvoice.invoiceDate.getTime() + parseInt(value) * 24 * 60 * 60 * 1000
      )
    setInvoice(newInvoice)
  }
  const addNewItem = () => {
    const emptyItem = { itemName: '', qty: 1, price: 0, total: 0 }
    setInvoice({
      ...invoice,
      invoiceItemList: [...invoice.invoiceItemList, emptyItem],
    })
  }
  const handleItemChange = (e, index) => {
    const { name, value } = e.target
    const newInvoice = { ...invoice }
    newInvoice.invoiceItemList[index][name] = value

    if (name === 'itemName') {
      const engine = engines.find((e) => e.name === value)
      if (engine) newInvoice.invoiceItemList[index]['price'] = engine.basePrice
    }

    if (['price', 'qty', 'itemName'].includes(name)) {
      const { qty, price } = newInvoice.invoiceItemList[index]
      newInvoice.invoiceItemList[index]['total'] = qty * price
      newInvoice.invoiceTotal = newInvoice.invoiceItemList.reduce(
        (total, item) => total + item.qty * item.price,
        0
      )
    }

    setInvoice(newInvoice)
    //do something
  }
  const handleDeleteItem = (index) => {
    //do something
    const newInvoice = { ...invoice }
    newInvoice.invoiceItemList.splice(index, 1)
    setInvoice(newInvoice)
  }
  const checkClick = (e) => {
    if (e.target.id === 'invoice-wrap') showModal()
  }
  const uploadInvoice = async () => {
    if (!invoice.invoiceItemList.length) {
      alert('Please make sure you fill in the items')
      return
    }
    setSubmitting(true)
    // const id = currentInvoice ? currentInvoice.id : uid()
    // // const reference = db.doc(db.db, 'invoices', id)
    const fn = currentInvoice ? db.updateOne : db.createOne
    const newInvoice = { ...invoice, userID: user.id }
    try {
      await fn('invoices', newInvoice)
      dispatch({
        type: `${currentInvoice ? 'UPDATE' : 'ADD'}_INVOICE`,
        data: newInvoice,
      })
    } catch (error) {
      alert(error.message)
    }
    setSubmitting(false)
    closeFunction()
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    uploadInvoice()
      .then((res) => {
        currentInvoice &&
          dispatch({ type: 'SET_CURRENT_INVOICE', data: invoice.id })
      })
      .catch((err) => {
        alert(err.message)
      })
  }
  return (
    <div
      className='invoice-wrap flex flex-column hideScrollBar'
      ref={ref}
      id='invoice-wrap'
      onClick={checkClick}
    >
      <form onSubmit={handleSubmit} className='invoice-content'>
        {submitting && <Loading />}
        <h1>{currentInvoice ? 'Edit Invoice' : 'New Invoice'}</h1>
        <div className='bill-to flex flex-column'>
          <h4>Bill to</h4>
          <div className='input flex flex-column'>
            <label htmlFor='clientName'>Customer's Name</label>
            <input
              type='text'
              id='clientName'
              name='clientName'
              required
              value={invoice.clientName}
              onChange={handleChange}
            />
          </div>
          <div className='input flex flex-column'>
            <label htmlFor='clientPhone'>Customer's Phone</label>
            <input
              type='text'
              id='clientPhone'
              name='clientPhone'
              value={invoice.clientPhone}
              onChange={handleChange}
            />
          </div>
          <div className='input flex flex-column'>
            <label htmlFor='clientAddress'>Customer's Address</label>
            <input
              type='text'
              id='clientAddress'
              name='clientAddress'
              required
              value={invoice.clientAddress}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Invoice Work Details */}
        <div className='invoice-work flex flex-column'>
          <div className='work-items'>
            <h3>Item List</h3>
            <table className='item-list'>
              <thead>
                <tr className='table-heading flex'>
                  <th className='item-name'>Item Name</th>
                  <th className='price engineNo'>Item No</th>
                  <th className='qty'>Qty</th>
                  <th className='price'>Price</th>
                  <th className='total'>Total</th>
                  <th className='qty delete'></th>
                </tr>
              </thead>
              <tbody>
                {invoice.invoiceItemList.map((item, i) => (
                  <tr key={i + 1} className='table-items flex'>
                    <td className='item-name'>
                      <input
                        type='text'
                        list='engines'
                        value={item.itemName}
                        name={'itemName'}
                        onChange={(e) => handleItemChange(e, i)}
                      />
                      <datalist id='engines'>
                        {engines.map((e, i) => (
                          <option value={e.name} key={i + 1}>
                            {e.name}
                          </option>
                        ))}
                      </datalist>
                    </td>
                    <td className='price engineNo'>
                      <input
                        type='text'
                        name='engineNo'
                        value={item.engineNo}
                        onChange={(e) => handleItemChange(e, i)}
                      />
                    </td>
                    <td className='qty'>
                      <input
                        type='number'
                        value={item.qty}
                        name={'qty'}
                        onChange={(e) => handleItemChange(e, i)}
                      />
                    </td>
                    <td className='price'>
                      <input
                        type='number'
                        value={item.price}
                        name={'price'}
                        onChange={(e) => handleItemChange(e, i)}
                      />
                    </td>
                    <td className='total'>
                      {formatMoney(item.qty * item.price)}
                    </td>
                    <td className='qty delete'>
                      {!!i && (
                        <img
                          src={deleteIcon}
                          onClick={() => handleDeleteItem(i)}
                          alt=''
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex button' onClick={addNewItem}>
              <img src={plusIcon} alt='' />
              <span>Add New Item</span>
            </div>
          </div>
        </div>

        {/* Save/Exit */}
        <div className='save flex'>
          <div className='left'>
            <button onClick={closeFunction} className='red' type='button'>
              Cancel
            </button>
          </div>
          {currentInvoice ? (
            <div className='right flex'>
              <button className='purple' type='submit'>
                Update Invoice
              </button>
            </div>
          ) : (
            <div className='right flex'>
              {/* <button
                className='dark-purple'
                type='submit'
                onClick={() => setInvoice({ ...invoice, invoiceDraft: true })}
              >
                Save Draft
              </button> */}
              <button
                className='purple'
                type='submit'
                onClick={() => setInvoice({ ...invoice, invoicePending: true })}
              >
                Create Invoice
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
})

export default InvoiceModal
