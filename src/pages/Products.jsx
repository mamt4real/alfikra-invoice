import React, { useState } from 'react'
import {
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material'
import { engines } from '../devdata/data'
import useTable from '../hooks/useTable'
import {
  DeleteOutlineRounded,
  EditOutlined,
  PlusOne,
} from '@mui/icons-material'
import Popup from '../components/Popup'
import '../css/Users.css'
import { useOutletContext } from 'react-router-dom'
import EngineForm from '../components/EngineForm'
import { formatMoney } from '../reducer'

const headCells = [
  { id: 'name', label: 'Product Name' },
  { id: 'basePrice', label: 'Base Price' },
  { id: 'actions', label: 'Actions', disableSort: true },
]

function Products() {
  const [edited, setEdited] = useState(null)
  const [openPopup, setOpen] = useState(false)
  const [filter, setFilter] = useState({ fn: (items) => items })
  const setShowModal = useOutletContext()[1]
  const { TableContainer, TblHead, TblPagination, recordsAfterPagination } =
    useTable(engines, headCells, filter)

  const handleDelete = (engine, index) => {
    const effectDelete = async () => {
      engines.splice(index, 1)
    }
    setShowModal({
      open: true,
      title: `Are you sure you want to delete ${engine.name}?`,
      subtitle: "This action can't be reversed!",
      callback: () =>
        effectDelete()
          .then(() => {})
          .catch((err) => alert(err.message)),
    })
  }
  const handleEdit = (user) => {
    setEdited(user)
    setOpen(true)
  }

  const handleNew = (e) => {
    setEdited(null)
    setOpen(true)
  }

  const handleSearch = (e) => {
    let query = e.target.value
    setFilter({
      fn: (items) =>
        query
          ? items.filter((item) =>
              item.name?.toLowerCase().includes(query.toLowerCase())
            )
          : items,
    })
  }
  return (
    <div className='container users'>
      <h1>Manage Products</h1>
      <div className='flex' style={{ alignItems: 'center', margin: '1rem 0' }}>
        <input
          placeholder='Search Engines'
          type='text'
          id='email'
          name='email'
          className='search_input'
          onChange={handleSearch}
        />

        <button onClick={handleNew} className='button green new_btn'>
          <PlusOne /> New Engine
        </button>
      </div>
      <TableContainer>
        <TblHead />
        <TableBody>
          {recordsAfterPagination().map((e, i) => (
            <TableRow key={i + 1}>
              <TableCell>{e.name}</TableCell>
              <TableCell>{formatMoney(e.basePrice)}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(e)}>
                  <Tooltip title='Edit Engine'>
                    <EditOutlined />
                  </Tooltip>
                </IconButton>
                <IconButton onClick={() => handleDelete(e, i)}>
                  <Tooltip title='Delete User'>
                    <DeleteOutlineRounded />
                  </Tooltip>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
      <TblPagination />
      <Popup title='Add/Edit Engine' open={openPopup} setOpen={setOpen}>
        <EngineForm engine={edited} close={() => setOpen(false)} />
      </Popup>
    </div>
  )
}

export default Products
