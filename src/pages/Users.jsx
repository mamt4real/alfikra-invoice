import React, { useState } from 'react'
import {
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material'
import { users } from '../devdata/data'
import useTable from '../hooks/useTable'
import {
  DeleteOutlineRounded,
  EditOutlined,
  PlusOne,
} from '@mui/icons-material'
import Popup from '../components/Popup'
import UserForm from '../components/UserForm'
import '../css/Users.css'
import { useOutletContext } from 'react-router-dom'

const headCells = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email Address' },
  { id: 'role', label: 'Role' },
  { id: 'actions', label: 'Actions', disableSort: true },
]

function Users() {
  const [edited, setEdited] = useState(null)
  const [openPopup, setOpen] = useState(false)
  const [filter, setFilter] = useState({ fn: (items) => items })
  const setShowModal = useOutletContext()[1]
  const { TableContainer, TblHead, TblPagination, recordsAfterPagination } =
    useTable(users, headCells, filter)

  const handleDelete = (user, index) => {
    const effectDelete = async () => {
      users.splice(index, 1)
    }
    setShowModal({
      open: true,
      title: `Are you sure you want to delete ${user.name}?`,
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
        query ? items.filter((item) => item.name.includes(query)) : items,
    })
  }

  return (
    <div className='users container'>
      <h1>Manage users</h1>
      <div className='flex' style={{ alignItems: 'center', margin: '1rem 0' }}>
        <input
          placeholder='Search Users'
          type='text'
          id='email'
          name='email'
          className='search_input'
          onChange={handleSearch}
        />

        <button onClick={handleNew} className='button green new_btn'>
          <PlusOne /> New User
        </button>
      </div>
      <TableContainer>
        <TblHead />
        <TableBody>
          {recordsAfterPagination().map((u, i) => (
            <TableRow key={i + 1}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(u)}>
                  <Tooltip title='Edit User'>
                    <EditOutlined />
                  </Tooltip>
                </IconButton>
                <IconButton onClick={() => handleDelete(u, i)}>
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
      <Popup title='Add/Edit User' open={openPopup} setOpen={setOpen}>
        <UserForm user={edited} close={() => setOpen(false)} />
      </Popup>
    </div>
  )
}

export default Users