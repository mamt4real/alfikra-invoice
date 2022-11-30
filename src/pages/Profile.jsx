import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  CardActions,
  Button,
} from '@mui/material'
import { Mail, Person } from '@mui/icons-material'
import React from 'react'
import { useStateValue } from '../StateProvider'
import '../css/Profile.css'

function Profile() {
  const { user } = useStateValue()[0]
  return (
    <div className='container profile'>
      <section className='left'>
        Profile
        <Card>
          <CardHeader
            className='dark-purple'
            avatar={<Avatar color='primary' />}
            title={user?.email?.split('@')[0]}
          />
          <CardContent>
            <Typography>
              <span className='key'>
                {' '}
                <Person /> Name
              </span>
              <span>{user?.name}</span>
            </Typography>
            <Typography>
              <span className='key'>
                <Mail />
                Email
              </span>
              <span>{user?.email}</span>
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            {/* <Button aria-label='add to favorites'>Edit</Button> */}
            <Button aria-label='edit'>Edit</Button>
          </CardActions>
        </Card>
      </section>
      <section className='right'></section>
    </div>
  )
}

export default Profile
