import AdminApp from './admin/AdminApp'
import StoreApp from './store/StoreApp'

export default function App() {
  const hostname = window.location.hostname
  const pathname = window.location.pathname
  const isAdmin = hostname.startsWith('admin.')
    || pathname.startsWith('/login')
    || pathname.startsWith('/dashboard')
    || pathname.startsWith('/activate')

  return isAdmin
    ? <div className="admin-root"><AdminApp /></div>
    : <div className="store-root"><StoreApp /></div>
}
