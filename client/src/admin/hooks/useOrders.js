import { useState, useEffect, useCallback } from 'react'
import api from '../../api/admin'

export function useOrders(params = {}) {
  const [data, setData] = useState({ orders: [], total: 0, page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await api.get('/admin/orders', { params })
      setData(response)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { ...data, loading, error, refetch: fetch }
}

export function useOrderStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/orders/stats')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { stats, loading }
}
