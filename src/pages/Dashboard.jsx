import { TrendingDown, TrendingUp } from '@mui/icons-material'
import { Card, CardContent, CardHeader } from '@mui/material'
import React, { useEffect } from 'react'
import ChartLine from '../components/charts/ChartLine'
import ChartPie from '../components/charts/ChartPie'
import '../css/Dashboard.css'
import {
  transformInvoices,
  monthlySales,
  engineCount,
} from '../firebase/factory'
import { formatMoney } from '../reducer'
import db from '../firebase/firebaseInit'
import { useState } from 'react'
import Loading from '../components/Loading'

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    today: 0,
    thisMonth: 0,
    lastMonth: 0,
    monthly: [],
    engines: [],
  })
  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true)
      try {
        const data = await db.getThisYearInvoices()
        const transformed = transformInvoices(data)
        const monthly = monthlySales(transformed)
        const engines = engineCount(transformed)
        const total = (sales) =>
          sales.reduce((sub, sale) => sub + sale.total, 0)
        const mSales = transformed.filter(
          (sale) => sale.date?.getMonth() === new Date().getMonth()
        )
        const today = total(
          mSales.filter((sale) => sale.date?.getDate() === new Date().getDate())
        )
        const thisMonth = total(mSales)
        const lastMonth = total(
          transformed.filter(
            (sale) => sale.date?.getMonth() === new Date().getMonth() - 1
          )
        )

        setStats({
          today,
          monthly,
          engines,
          thisMonth,
          lastMonth,
        })
      } catch (error) {
        console.log(error)
        alert(error.message)
      }
      setLoading(false)
    }

    loadDetails()
  }, [])

  return (
    <div className='dashboard container'>
      {loading && <Loading />}
      Dashboard
      <div className='tiles_container'>
        <Card color='primary'>
          <CardHeader title='Todays Sales' className='purple' />
          <CardContent>
            <div className='flex' style={{ alignItems: 'center' }}>
              <span className='money'>{formatMoney(stats.today)}</span>
              <TrendingUp />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title='This Month Sales' className='green' />
          <CardContent>
            <div className='flex' style={{ alignItems: 'center' }}>
              <span className='money'>{formatMoney(stats.thisMonth)}</span>
              <TrendingUp />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title='Last Month Sales' className='orange' />
          <CardContent>
            <div className='flex' style={{ alignItems: 'center' }}>
              <span className='money'>{formatMoney(stats.lastMonth)}</span>
              <TrendingDown />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='charts_container'>
        <div className='left'>
          <ChartPie title={'Product Purchase'} data={stats.engines} />
        </div>
        <div className='right'>
          <ChartLine
            data={stats.monthly}
            datakey={'amt'}
            title='This Years Sales Distribution'
            grid={true}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
