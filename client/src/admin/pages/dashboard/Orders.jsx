import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Table } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { Select } from '../../components/ui/Form'
import { useOrders } from '../../hooks/useOrders'
import { ORDER_STATUS_MAP, formatPrice, formatDate } from '../../lib/utils'
import api from '../../../api/admin'

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState(null)

  const params = { page, limit: 20, ...(statusFilter && { status: statusFilter }) }
  const { orders, total, totalPages, loading, refetch } = useOrders(params)

  const handleStatusChange = async (orderId, newStatus) => {
    await api.put(`/admin/orders/${orderId}/status`, { status: newStatus })
    refetch()
  }

  const columns = [
    { header: 'ID', accessor: (o) => `#${o.id}` },
    {
      header: 'Cliente',
      accessor: (o) => (
        <div>
          <p className="font-medium text-zinc-200">{o.customerName}</p>
          <p className="text-xs text-zinc-500">{o.customerPhone}</p>
        </div>
      ),
    },
    {
      header: 'Items',
      accessor: (o) => `${(o.items || []).length} item${o.items?.length !== 1 ? 's' : ''}`,
    },
    { header: 'Total', accessor: (o) => formatPrice(o.total) },
    { header: 'Fecha', accessor: (o) => formatDate(o.createdAt) },
    {
      header: 'Estado',
      accessor: (o) => (
        <Select
          value={o.status}
          onChange={(e) => handleStatusChange(o.id, e.target.value)}
          className="min-w-[130px]"
          options={Object.entries(ORDER_STATUS_MAP).map(([value, { label }]) => ({ value, label }))}
        />
      ),
    },
    {
      header: '',
      accessor: (o) => (
        <button onClick={(e) => { e.stopPropagation(); setExpanded(expanded === o.id ? null : o.id) }} className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-400 transition-colors">
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Pedidos</h1>
          <p className="text-sm text-zinc-500">{total} pedidos</p>
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          options={[
            { value: '', label: 'Todos los estados' },
            ...Object.entries(ORDER_STATUS_MAP).map(([value, { label }]) => ({ value, label })),
          ]}
        />
      </div>

      <div className="space-y-4">
        <Table
          columns={columns}
          data={orders}
          onRowClick={(o) => setExpanded(expanded === o.id ? null : o.id)}
          emptyMessage={loading ? 'Cargando...' : 'No hay pedidos'}
        />

        {expanded && orders.find((o) => o.id === expanded) && (
          <Card>
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">Detalle del pedido #{expanded}</h3>
            <div className="space-y-2">
              {orders.find((o) => o.id === expanded)?.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                  <div className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded object-cover" />}
                    <div>
                      <p className="text-sm text-zinc-200">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.qty} x {formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-zinc-300">{formatPrice(item.qty * item.price)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 text-sm rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30">
            Anterior
          </button>
          <span className="text-sm text-zinc-400">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 text-sm rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30">
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
