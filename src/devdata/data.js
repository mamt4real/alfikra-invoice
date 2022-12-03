import { uid } from 'uid'

const data = []

export const users = Array(4)
  .fill(null)
  .map((_, i) => ({
    email: `user${i + 1}@example.com`,
    password: '12345pass',
    name: 'User ' + ['One', 'Two', 'Three', 'Four'][i],
    role: ['admin', 'client'][i === 0 ? 0 : 1],
  }))

export const engines = [
  {
    id: uid(6),
    name: 'TIGER ELEMAX',
    basePrice: Math.round(Math.random() * 100000) / 100,
  },
  {
    id: uid(6),
    name: 'YAMAHA',
    basePrice: Math.round(Math.random() * 100000) / 100,
  },
  {
    id: uid(6),
    name: 'TECH',
    basePrice: Math.round(Math.random() * 100000) / 100,
  },
  {
    id: uid(6),
    name: 'BIBUT',
    basePrice: Math.round(Math.random() * 100000) / 100,
  },
]

for (let i = 0; i < 15; i++)
  data.push({
    id: uid(6),
    billerStreetAddress: 'Street Address' + (i + 1),
    billerCity: 'City' + (i + 1),
    billerZipCode: 'Zip Code' + (i + 1),
    billerCountry: 'Country' + (i + 1),
    clientName: 'Name' + (i + 1),
    clientPhone: 'email' + (i + 1) + '@example.com',
    clientAddress: 'strret address' + (i + 1),
    clientCity: 'client City' + (i + 1),
    clientZipCode: 'zip code' + (i + 1),
    clientCountry: 'client country ' + (i + 1),
    invoiceDateUnix: '',
    invoiceDate: new Date(
      2022,
      Math.round(Math.random() * 12),
      Math.round(Math.random() * 25)
    ),
    paymentTerms: 'some terms',
    paymentDueDate: new Date(),
    paymentDueDateUnix: new Date(Date.now() + (i + 1) * 86400),
    productDescription: '',
    invoicePending: !!(i % 2),
    invoiceDraft: '',
    invoicePaid: !(i % 2),
    invoiceItemList: Array(i + 1)
      .fill()
      .map((_, i) => {
        const engine = engines[Math.floor(Math.random() * engines.length)]
        return {
          itemName: engine.name,
          qty: i + 1,
          price: engine.basePrice,
          total: engine.basePrice * (i + 1),
        }
      }),
    invoiceTotal: 0,
  })
export const userSalesData = [
  {
    name: 'Jan',
    'Active User': 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Feb',
    'Active User': 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Mar',
    'Active User': 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Apr',
    'Active User': 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'May',
    'Active User': 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Jun',
    'Active User': 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Jul',
    'Active User': 1234,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Aug',
    'Active User': 6610,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Sep',
    'Active User': 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Oct',
    'Active User': 3410,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Nov',
    'Active User': 5590,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Dec',
    'Active User': 2390,
    pv: 4300,
    amt: 2100,
  },
]

export default data
