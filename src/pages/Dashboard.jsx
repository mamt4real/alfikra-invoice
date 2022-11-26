import { TrendingDown, TrendingUp } from '@mui/icons-material'
import { Card, CardContent, CardHeader } from '@mui/material'
import React from 'react'
import ChartLine from '../components/charts/ChartLine'
import ChartPie from '../components/charts/ChartPie'
import '../css/Dashboard.css'
import { userSalesData } from '../devdata/data'
import { formatMoney } from '../reducer'

function Dashboard() {
  return (
    <div className='dashboard container'>
      Dashboard
      <div className='tiles_container'>
        <Card color='primary'>
          <CardHeader title='Todays Sales' className='purple' />
          <CardContent>
            <div className='flex' style={{ alignItems: 'center' }}>
              <span className='money'>{formatMoney(10628.4)}</span>
              <TrendingUp />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title='This Month Sales' className='green' />
          <CardContent>
            <div className='flex' style={{ alignItems: 'center' }}>
              <span className='money'>{formatMoney(10034548)}</span>
              <TrendingUp />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title='Last Month Sales' className='orange' />
          <CardContent>
            <div className='flex' style={{ alignItems: 'center' }}>
              <span className='money'>{formatMoney(234548)}</span>
              <TrendingDown />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='charts_container'>
        <div className='left'>
          <ChartPie title={'Product Purchase'} />
        </div>
        <div className='right'>
          <ChartLine
            data={userSalesData}
            datakey={'Active User'}
            title='This Years Sales Distribution'
            grid={true}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
