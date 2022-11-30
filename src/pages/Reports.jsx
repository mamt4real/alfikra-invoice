import { CalendarToday, Engineering } from '@mui/icons-material'
import React, { useState } from 'react'
import { engines } from '../devdata/data'
import { formatdate, formatMoney } from '../reducer'
import '../css/Reports.css'
import { Typography } from '@mui/material'

function Reports() {
  const [filters, setFilters] = useState({
    dateFrom: formatdate(new Date()),
    dateTo: formatdate(new Date()),
    engine: '*',
  })

  const filtersChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  return (
    <div className='reports container dashboard'>
      <section className='left flex flex-column'>
        {/* Filter Container  */}
        <div className='filter_container'>
          <h3>Filter Records</h3>
          <div className='flex'>
            <div className='input flex flex-column'>
              <label htmlFor='dateFrom'>
                <CalendarToday />
                From
              </label>
              <input
                type='date'
                id='dateFrom'
                name='dateFrom'
                required
                value={filters.name}
                onChange={filtersChange}
              />
            </div>
            <div className='input flex flex-column'>
              <label htmlFor='dateTo'>
                <CalendarToday />
                To
              </label>
              <input
                type='date'
                id='dateTo'
                name='dateTo'
                required
                value={filters.dateTo}
                onChange={filtersChange}
              />
            </div>
            <div className='input flex flex-column'>
              <label htmlFor='engine'>
                <Engineering />
                Engine
              </label>
              <select
                id='engine'
                name='engine'
                value={filters.engine}
                onChange={filtersChange}
              >
                <option value='*'>All</option>
                {engines.map((e, i) => (
                  <option value={e.name} key={e.id + i + '_key'}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className='button draft'>Retrieve</button>
        </div>

        {/* Quick Metrics */}
        <div className='quick_metrics'>
          <h3>Metrics</h3>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Total Sales
            </Typography>
            <Typography variant='subtitle' className='money'>
              {formatMoney(12345676543)}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Avg Monthly Sales
            </Typography>
            <Typography variant='subtitle' className='money'>
              {formatMoney(86543)}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Total Products Sold
            </Typography>
            <Typography variant='subtitle' className='money'>
              {127}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Most Sold Product
            </Typography>
            <Typography variant='subtitle' className='money'>
              {'Sumec 121 Ultra'}
            </Typography>
          </div>
        </div>
      </section>
      <section className='right flex flex-column'>
        This is the right Section
      </section>
    </div>
  )
}

export default Reports
