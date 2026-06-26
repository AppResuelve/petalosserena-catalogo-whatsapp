import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import api from '../../api/admin'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/products': 'Productos',
  '/dashboard/services': 'Servicios',
  '/dashboard/categories': 'Categorías',
  '/dashboard/media': 'Galería',
  '/dashboard/settings': 'Configuración',
  '/store': 'Tienda',
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const location = useLocation()

  useEffect(() => {
    api.get('/admin/settings')
      .then(({ data }) => setLogoUrl(data.logo_url || ''))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const pageTitle = PAGE_TITLES[location.pathname]
    || Object.entries(PAGE_TITLES).find(([key]) => location.pathname.startsWith(key))?.[1]
    || ''

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} logoUrl={logoUrl} />

      {/* Mobile topbar */}
      <header
        className={`lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3
          bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800
          transition-transform duration-300
          ${scrolled ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-zinc-200 truncate">{pageTitle}</span>
      </header>

      {/* Mobile hamburger (visible only when topbar is hidden) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-zinc-900 border border-zinc-800
          text-zinc-400 hover:text-zinc-200 transition-all duration-300
          ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Menu className="w-5 h-5" />
      </button>

      <main className="ml-0 lg:ml-64 p-2 pt-16 lg:p-6 lg:pt-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
