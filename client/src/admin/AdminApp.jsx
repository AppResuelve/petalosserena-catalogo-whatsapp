import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AlertProvider } from './components/ui/AlertContext'
import { ScrollToTop } from '../store/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import DashboardHome from './pages/dashboard/DashboardHome'
import Products from './pages/dashboard/Products'
import ProductForm from './pages/dashboard/ProductForm'
import Categories from './pages/dashboard/Categories'
import Settings from './pages/dashboard/Settings'
import Media from './pages/dashboard/Media'
import ChangeRequests from './pages/dashboard/ChangeRequests'
import Services from './pages/dashboard/Services'
import ServiceForm from './pages/dashboard/ServiceForm'
import Attributes from './pages/dashboard/Attributes'
import StorePage from './pages/store/Store'
import Activate from './pages/Activate'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

export default function AdminApp() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <AuthProvider>
        <AlertProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
              <Route path="/activate" element={<Activate />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/dashboard/products" element={<Products />} />
              <Route path="/dashboard/products/new" element={<ProductForm />} />
              <Route path="/dashboard/products/:id/edit" element={<ProductForm />} />
              <Route path="/dashboard/attributes" element={<Attributes />} />
              <Route path="/dashboard/categories" element={<Categories />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/dashboard/media" element={<Media />} />
              <Route path="/dashboard/change-requests" element={<ChangeRequests />} />
              <Route path="/dashboard/services" element={<Services />} />
              <Route path="/dashboard/services/new" element={<ServiceForm />} />
              <Route path="/dashboard/services/:id/edit" element={<ServiceForm />} />
              <Route path="/store" element={<StorePage />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
