import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BasePage from './BasePage'
import AdminBasePage from './AdminBasePage'
import Invoices from './pages/Invoices'
import InvoicePage from './pages/InvoicePage'
import Landing from './pages/Landing'
import Products from './pages/Products'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/Profile'

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path={'/'} element={<BasePage />}>
            <Route index element={<Landing />} />
            <Route
              path='invoices'
              element={
                <ProtectedRoute>
                  <Invoices />
                </ProtectedRoute>
              }
            />
            <Route
              path='invoices/:invoiceID'
              element={
                <ProtectedRoute>
                  <InvoicePage />
                </ProtectedRoute>
              }
            />
            <Route
              path='profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='admin'
              element={
                <ProtectedRoute restrictedTo={['admin']} redirect='/invoices'>
                  <AdminBasePage />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='products' element={<Products />} />
              <Route path='reports' element={<Reports />} />
              <Route path='users' element={<Users />} />
            </Route>
          </Route>
          <Route
            path='*'
            element={
              <div className='page__content'>
                <h1>Sub Page Not yet Implemented</h1>
              </div>
            }
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
