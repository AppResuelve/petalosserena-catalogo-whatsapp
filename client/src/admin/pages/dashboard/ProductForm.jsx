import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader, Image, Trash2, Plus } from 'lucide-react'
import { Button, Input, Textarea, Select } from '../../components/ui/Form'
import { Checkbox } from '../../components/ui/Checkbox'
import ImageUpload from '../../components/ImageUpload'
import GalleryPicker from '../../components/GalleryPicker'
import { useProduct } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import api from '../../../api/admin'
import { useAlert } from '../../components/ui/AlertContext'
import { calculateComparePrice } from '../../../utils/discount'
import { generateSkuCode } from '../../../utils/skuGenerator'

const EMPTY_PRODUCT = {
  name: '', slug: '', description: '', images: [],
  retailPrice: 0, comparePrice: null, discountPercentage: null,
  wholesalePrice: null, wholesaleMinQty: null,
  status: 'active', tags: [], categoryId: '',
}

const EMPTY_SKU = {
  retailPrice: 0, wholesalePrice: null, wholesaleMinQty: null,
  stock: 0, sku: '', images: [],
  sortOrder: 0, status: 'active', attributeValueIds: [],
}

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 255)

function SkuCard({ sku, index, attributes, onChange, onRemove, onStatusToggle }) {
  const [expanded, setExpanded] = useState(false)
  const Alert = useAlert()

  const label = useMemo(() => {
    if (!sku.attributeValueIds?.length) return `Variante ${index + 1}`
    return [...sku.attributeValueIds]
      .sort((a, b) => {
        const getAttrId = vId => attributes.find(at => at.values.some(v => v.id === vId))?.id || 0
        return getAttrId(a) - getAttrId(b)
      })
      .map(vId => {
        for (const attr of attributes) {
          const val = attr.values.find(v => v.id === vId)
          if (val) return val.value
        }
        return vId
      })
      .join(' + ')
  }, [sku.attributeValueIds, attributes, index])

  const handleChange = (field, value) => {
    onChange(index, { ...sku, [field]: value })
  }

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 overflow-hidden">
      <button type="button" onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/30 transition-colors text-left">
        <span className={`text-zinc-500 text-xs transition-transform ${expanded ? 'rotate-90' : ''}`}>▶</span>
        <span className="flex-1 text-sm font-medium text-zinc-200 truncate">{label}</span>
        <span className="text-xs text-zinc-500 font-mono shrink-0">${sku.retailPrice || 0}</span>
        <span className="text-xs text-zinc-600 shrink-0">stock: {sku.stock || 0}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${sku.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-zinc-700 text-zinc-500'}`}>
          {sku.status === 'active' ? 'activo' : 'borrador'}
        </span>
        <button type="button" onClick={(e) => {
          e.stopPropagation()
          Alert.fire({ message: 'Para eliminar esta variante, abrí "Administrar atributos" y deseleccioná sus valores.', type: 'info', variant: 'banner' })
        }}
          className="p-1 text-zinc-600 hover:text-zinc-400 rounded shrink-0" title="Cómo eliminar">
          <Trash2 className="w-4 h-4" />
        </button>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-700 pt-3 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Input label="Precio venta" type="number" value={sku.retailPrice}
              onChange={(e) => handleChange('retailPrice', e.target.value)} />
            <Input label="Stock" type="number" value={sku.stock}
              onChange={(e) => handleChange('stock', e.target.value)} />
            <div className="hidden sm:block">
              <Input label="Código SKU" value={sku.sku || ''}
                onChange={(e) => handleChange('sku', e.target.value)} placeholder="Opcional" />
            </div>
          </div>
          <div className="sm:hidden">
            <Input label="Código SKU" value={sku.sku || ''}
              onChange={(e) => handleChange('sku', e.target.value)} placeholder="Opcional" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Precio mayorista" type="number" value={sku.wholesalePrice || ''}
              onChange={(e) => handleChange('wholesalePrice', e.target.value || null)} />
            <Input label="Cant. mín. mayorista" type="number" value={sku.wholesaleMinQty || ''}
              onChange={(e) => handleChange('wholesaleMinQty', e.target.value || null)} />
            <Select label="Estado" value={sku.status}
              onChange={(e) => handleChange('status', e.target.value)}
              options={[{ value: 'active', label: 'Activo' }, { value: 'draft', label: 'Borrador' }]} />
          </div>
          <ImageUpload images={sku.images || []}
            onChange={(imgs) => handleChange('images', imgs)} max={1}
            folder={`productos/var-${sku.id || index}`} />
        </div>
      )}
    </div>
  )
}

export default function ProductForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const Alert = useAlert()
  const { product, loading: productLoading } = useProduct(id)
  const { categories } = useCategories()

  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [skus, setSkus] = useState([])
  const [attributes, setAttributes] = useState([])
  const [selectedAttributes, setSelectedAttributes] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [priceDefaults, setPriceDefaults] = useState({ retail: true, wholesale: true })

  useEffect(() => {
    api.get('/admin/attributes').then(({ data }) => setAttributes(data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '', slug: product.slug || '',
        description: product.description || '', images: product.images || [],
        retailPrice: product.retailPrice || 0, comparePrice: product.comparePrice || null,
        discountPercentage: product.discountPercentage || null,
        wholesalePrice: product.wholesalePrice || null,
        wholesaleMinQty: product.wholesaleMinQty || null,
        status: product.status || 'active', tags: product.tags || [],
        categoryId: product.categoryId || '',
      })
      setTagsInput((product.tags || []).join(', '))
      setSlugManual(true)

      if (product.skus?.length > 0) {
        const inferredAttrs = {}
        product.skus.forEach(sku => {
          sku.attributeValues.forEach(av => {
            const aId = av.attribute?.id
            if (!aId) return
            if (!inferredAttrs[aId]) inferredAttrs[aId] = new Set()
            inferredAttrs[aId].add(av.id)
          })
        })
        setSelectedAttributes(inferredAttrs)
        setSkus(product.skus.map(s => ({
          id: s.id, retailPrice: s.retailPrice || 0,
          wholesalePrice: s.wholesalePrice ?? null,
          wholesaleMinQty: s.wholesaleMinQty ?? null,
          stock: s.stock || 0, sku: s.sku || '', images: s.images || [],
          sortOrder: s.sortOrder || 0, status: s.status || 'active',
          attributeValueIds: (s.attributeValues || []).map(v => v.id),
        })))
      }
    }
  }, [product])

  const handleChange = (field, value) => {
    const next = { ...form, [field]: value }
    if (field === 'name' && !slugManual) next.slug = slugify(value)
    if (field === 'retailPrice' || field === 'discountPercentage') {
      const retail = field === 'retailPrice' ? Number(value) : Number(form.retailPrice)
      const pct = field === 'discountPercentage' ? Number(value) : Number(form.discountPercentage)
      next.comparePrice = calculateComparePrice(retail, pct)
    }
    setForm(next)
  }

  const handleTagsChange = (value) => {
    setTagsInput(value)
    handleChange('tags', value.split(',').map(t => t.trim()).filter(Boolean))
  }

  // ── Atributos (modal) ──
  const [attrModalOpen, setAttrModalOpen] = useState(false)
  const [modalAttrs, setModalAttrs] = useState({})

  const openAttrModal = () => {
    const copy = {}
    Object.entries(selectedAttributes).forEach(([k, v]) => { copy[k] = new Set(v) })
    setModalAttrs(copy)
    setAttrModalOpen(true)
  }

  const modalToggleAttr = (attrId, valueId) => {
    setModalAttrs(prev => {
      const aId = Number(attrId); const current = new Set(prev[aId] || [])
      if (current.has(valueId)) {
        current.delete(valueId)
        if (current.size === 0) { const { [aId]: _, ...rest } = prev; return rest }
      } else {
        current.add(valueId)
      }
      return { ...prev, [aId]: current }
    })
  }

  const modalAddAttr = (attr) => {
    setModalAttrs(prev => ({ ...prev, [attr.id]: new Set() }))
  }

  const modalRemoveAttr = async (attrId) => {
    const attr = attributes.find(a => a.id === Number(attrId))
    const result = await Alert.fire({
      title: '¿Quitar atributo?',
      message: `¿Quitar "${attr?.name}" y deseleccionar todos sus valores?`,
      type: 'warning',
      variant: 'modal',
      showCancelButton: true,
      confirmButtonText: 'Quitar',
      cancelButtonText: 'Cancelar',
    })
    if (!result.isConfirmed) return
    const { [Number(attrId)]: _, ...rest } = modalAttrs; setModalAttrs(rest)
  }

  const handleCancelAttrs = () => {
    const copy = {}
    Object.entries(selectedAttributes).forEach(([k, v]) => { copy[k] = new Set(v) })
    setModalAttrs(copy)
    setAttrModalOpen(false)
  }

  const handleConfirmAttrs = async () => {
    const emptyAttr = Object.entries(modalAttrs).find(([, vIds]) => vIds.size === 0)
    if (emptyAttr) {
      const attr = attributes.find(a => a.id === Number(emptyAttr[0]))
      await Alert.fire({ message: `Seleccioná al menos un valor para "${attr?.name || 'el atributo'}"`, type: 'warning', variant: 'banner' })
      return
    }
    if (Object.keys(modalAttrs).length === 0) {
      await Alert.fire({ message: 'Seleccioná al menos un atributo y valor', type: 'warning', variant: 'banner' })
      return
    }
    setSelectedAttributes(modalAttrs)
    setAttrModalOpen(false)
    handleGenerateSkus(modalAttrs)
  }

  const handleGenerateSkus = (attrs = selectedAttributes) => {
    const groups = Object.entries(attrs)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, vIds]) => [...vIds])
      .filter(g => g.length > 0)

    if (!groups.length) return

    // Primera vez: mostrar modal de precios
    if (skus.length === 0) {
      setShowPriceModal(true)
      return
    }

    // Ya hay SKUs → herencia silenciosa
    doGenerateSkus(attrs, false)
  }

  const doGenerateSkus = async (attrs, keepPriceDefaults = false) => {
    const groups = Object.entries(attrs)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, vIds]) => [...vIds])
      .filter(g => g.length > 0)

    if (!groups.length) return

    const combinations = groups.reduce((acc, group) =>
      acc.flatMap(combo => group.map(vId => [...combo, vId])),
      [[]]
    )

    const keptIds = new Set()
    const newSkus = combinations.map(combo => {
      const sorted = [...combo].sort((a, b) => a - b)
      const existing = skus.find(s => {
        const sSorted = [...s.attributeValueIds].sort((a, b) => a - b)
        return sSorted.every(vId => sorted.includes(vId))
      })
      if (existing?.id) { keptIds.add(existing.id); return { ...existing, attributeValueIds: combo } }
      return {
        ...EMPTY_SKU,
        images: [],
        attributeValueIds: combo,
        sku: generateSkuCode(form.name, combo, attributes),
        retailPrice: keepPriceDefaults ? form.retailPrice || 0 : 0,
        wholesalePrice: keepPriceDefaults && priceDefaults.wholesale ? (form.wholesalePrice ?? null) : null,
        wholesaleMinQty: keepPriceDefaults && priceDefaults.wholesale ? (form.wholesaleMinQty ?? null) : null,
      }
    })

    const skusAtRisk = skus.filter(s =>
      s.id && !newSkus.some(ns => {
        const sSorted = [...s.attributeValueIds].sort((a, b) => a - b)
        const nsSorted = [...ns.attributeValueIds].sort((a, b) => a - b)
        return sSorted.every(vId => nsSorted.includes(vId))
      })
    )
    const deletedCount = skusAtRisk.length
    if (deletedCount > 0) {
      const result = await Alert.fire({
        title: '¿Actualizar variantes?',
        message: `Se eliminarán ${deletedCount} variante(s) con sus precios y stock. ¿Continuar?`,
        type: 'warning',
        variant: 'modal',
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
      })
      if (!result.isConfirmed) return
    }

    setSkus(newSkus)
    setShowPriceModal(false)
  }

  const hasUnsyncedChanges = useMemo(() => {
    if (!Object.keys(selectedAttributes).length) return false
    const withValues = Object.entries(selectedAttributes).filter(([, vIds]) => vIds.size > 0)
    if (!withValues.length) return skus.length > 0
    const expectedCount = withValues.reduce((acc, [, vIds]) => acc * vIds.size, 1)
    return skus.length !== expectedCount
  }, [selectedAttributes, skus])

  // ── SKUs ──
  const updateSku = (i, sku) => { const nx = [...skus]; nx[i] = sku; setSkus(nx) }
  const removeSku = (i) => setSkus(skus.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { Alert.fire({ message: 'El nombre es obligatorio', type: 'warning' }); return }
    if (!form.slug.trim()) handleChange('slug', slugify(form.name))
    if (hasUnsyncedChanges) {
      Alert.fire({ message: 'Los atributos no coinciden con las variantes. Generá las variantes primero.', type: 'warning' })
      return
    }

    setError(''); setSaving(true)
    try {
      const payload = {
        ...form, categoryId: form.categoryId || null,
        retailPrice: Number(form.retailPrice) || 0,
        comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
        discountPercentage: form.discountPercentage ? Number(form.discountPercentage) : null,
        wholesalePrice: form.wholesalePrice ? Number(form.wholesalePrice) : null,
        wholesaleMinQty: form.wholesaleMinQty ? Number(form.wholesaleMinQty) : null,
        skus: skus.map(s => ({
          ...(s.id && { id: s.id }),
          retailPrice: Number(s.retailPrice) || 0,
          wholesalePrice: s.wholesalePrice ? Number(s.wholesalePrice) : null,
          wholesaleMinQty: s.wholesaleMinQty ? Number(s.wholesaleMinQty) : null,
          stock: Number(s.stock) || 0, sku: s.sku || null,
          images: s.images || [], sortOrder: s.sortOrder || 0,
          status: s.status || 'active',
          attributeValueIds: s.attributeValueIds || [],
        })),
      }
      if (isEditing) await api.put(`/admin/products/${id}`, payload)
      else await api.post('/admin/products', payload)
      Alert.fire({ message: isEditing ? 'Producto actualizado' : 'Producto creado', type: 'success' })
      navigate('/dashboard/products')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar producto')
    } finally { setSaving(false) }
  }

  if (productLoading && isEditing) {
    return <div className="flex items-center justify-center py-20"><Loader className="w-6 h-6 animate-spin text-cyan-400" /></div>
  }

  const availableAttrs = attributes.filter(a => !selectedAttributes[a.id])

  return (
    <div>
      <button onClick={() => navigate('/dashboard/products')} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /><span className="text-sm">Volver a productos</span>
      </button>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 pb-24 lg:pb-0">
        <h1 className="text-2xl font-bold text-zinc-100">{isEditing ? `Editar ${form.name || 'Producto'}` : 'Nuevo Producto'}</h1>
        {error && <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        <ImageUpload images={form.images} onChange={(imgs) => handleChange('images', imgs)} max={4} folder="productos" />
        <button type="button" onClick={() => setGalleryOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-700 transition-colors">
          <Image className="w-4 h-4" /> Buscar en galería
        </button>

        <Input label="Nombre" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
        <Input label="Slug" value={form.slug} onChange={(e) => { setSlugManual(true); handleChange('slug', slugify(e.target.value)) }} placeholder="nombre-del-producto" required />
        <Textarea label="Descripción" value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Descripción del producto que verán tus clientes" />

        <div className="grid grid-cols-3 items-end gap-4">
          <Input label="Precio de venta" type="number" min="0"
            value={form.retailPrice}
            onChange={(e) => handleChange('retailPrice', e.target.value)}
            readOnly={skus.length > 0}
            disabled={skus.length > 0} />
          <Input label="% Descuento" type="number" min="1" max="100"
            value={form.discountPercentage || ''}
            onChange={(e) => handleChange('discountPercentage', e.target.value || null)}
            placeholder="Ej: 25"
            readOnly={skus.length > 0}
            disabled={skus.length > 0} />
          <Input label="Precio de comparación" type="number" min="0"
            value={form.comparePrice || ''}
            onChange={(e) => handleChange('comparePrice', e.target.value || null)}
            readOnly={skus.length > 0}
            disabled={skus.length > 0} />
        </div>

        {skus.length === 0 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                <Checkbox checked={form.wholesalePrice != null || form.wholesaleMinQty != null}
                  onChange={(e) => {
                    if (!e.target.checked) { handleChange('wholesalePrice', null); handleChange('wholesaleMinQty', null) }
                    else { handleChange('wholesalePrice', ''); handleChange('wholesaleMinQty', '') }
                  }} />
                ¿Tiene precio mayorista?
              </label>
            </div>

            {(form.wholesalePrice != null || form.wholesaleMinQty != null) && (
              <div className="grid grid-cols-2 gap-4">
                <Input label="Precio mayorista" type="number" value={form.wholesalePrice || ''} onChange={(e) => handleChange('wholesalePrice', e.target.value || null)} />
                <Input label="Cant. mín. mayorista" type="number" value={form.wholesaleMinQty || ''} onChange={(e) => handleChange('wholesaleMinQty', e.target.value || null)} />
              </div>
            )}
          </>
        )}

        {skus.length > 0 && (
          <div className="p-3 rounded-lg flex items-start gap-3"
            style={{ backgroundColor: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)' }}>
            <span className="text-sm shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-xs font-medium text-amber-400">Precios gestionados por variante</p>
              <p className="text-xs text-amber-400/60 mt-0.5">
                El precio de cada combinación se define en su variante.
                {form.retailPrice > 0 && ` Más bajo actual: $${form.retailPrice}.`}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Select label="Estado" value={form.status} onChange={(e) => handleChange('status', e.target.value)}
            options={[{ value: 'active', label: 'Activo' }, { value: 'draft', label: 'Borrador' }]} />
          <Select label="Categoría" value={form.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)}
            options={[{ value: '', label: 'Sin categoría' }, ...categories.map(c => ({ value: c.id, label: c.name }))]} />
        </div>

        <Input label="Tags (separados por coma)" value={tagsInput} onChange={(e) => handleTagsChange(e.target.value)} placeholder="destacado, nuevo, oferta" />

        {/* ═══ ATRIBUTOS DEL PRODUCTO (barra) ═══ */}
        <div className="border-t border-zinc-800 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">
              Atributos:{' '}
              {Object.keys(selectedAttributes).length > 0
                ? Object.entries(selectedAttributes)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([aId]) => attributes.find(a => a.id === Number(aId))?.name)
                    .filter(Boolean)
                    .join(', ')
                : 'Ninguno'}
              {' • '}
              {skus.length} variante(s)
            </span>
            <Button type="button" variant="secondary" size="sm" onClick={openAttrModal}>
              Administrar atributos
            </Button>
          </div>
          {hasUnsyncedChanges && (
            <span className="text-xs text-yellow-400 mt-2 block">
              Los atributos no coinciden con las variantes — abrí el administrador y actualizá.
            </span>
          )}
        </div>

        {/* ═══ VARIANTES (SKUs) ═══ */}
        {skus.length > 0 && (
          <div className="border-t border-zinc-800 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Variantes</h2>
                <p className="text-xs text-zinc-500">Precio, stock e imágenes por variante</p>
              </div>
            </div>
            <div className="space-y-2">
              {skus.map((sku, i) => (
                <SkuCard key={i} sku={sku} index={i} attributes={attributes}
                  onChange={updateSku} onRemove={removeSku} />
              ))}
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 lg:static flex gap-3 justify-end px-4 pb-8 pt-4 lg:p-0 lg:pt-2 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 lg:border-0 lg:bg-transparent z-20">
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/products')}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}</Button>
        </div>
      </form>

      <GalleryPicker open={galleryOpen} onClose={() => setGalleryOpen(false)}
        onSelect={(url) => handleChange('images', [...form.images, url])} max={4} currentCount={form.images.length} />

      {/* Modal: Administrar atributos */}
      {attrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={handleCancelAttrs} />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-zinc-100">Administrar atributos</h3>

            {/* Dropdown: agregar */}
            {attributes.filter(a => !modalAttrs[a.id]).length > 0 && (
              <div className="relative group inline-block">
                <button type="button"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-400 border border-zinc-700 hover:border-cyan-500 transition-colors">
                  <Plus className="w-3 h-3" /> Agregar atributo
                </button>
                <div className="absolute left-0 top-full mt-1 w-48 py-1 rounded-lg bg-zinc-800 border border-zinc-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40">
                  {attributes.filter(a => !modalAttrs[a.id]).map(a => (
                    <button key={a.id} type="button" onClick={() => modalAddAttr(a)}
                      className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors">
                      {a.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de atributos seleccionados */}
            {Object.entries(modalAttrs).sort(([a], [b]) => Number(a) - Number(b)).length === 0 ? (
              <p className="text-xs text-zinc-600">Sin atributos seleccionados</p>
            ) : (
              Object.entries(modalAttrs).sort(([a], [b]) => Number(a) - Number(b)).map(([attrId, valueIds]) => {
                const attr = attributes.find(a => a.id === Number(attrId))
                if (!attr) return null
                return (
                  <div key={attrId}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-zinc-300">{attr.name}</span>
                      <button type="button" onClick={() => modalRemoveAttr(attrId)}
                        className="text-xs text-zinc-500 hover:text-red-400" title="Quitar atributo">✕ quitar</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {attr.values.map(v => {
                        const checked = valueIds.has(v.id)
                        return (
                          <label key={v.id}
                            className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                              checked ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'
                            }`}>
                            <input type="checkbox" checked={checked}
                              onChange={() => modalToggleAttr(attrId, v.id)}
                              className="hidden" />
                            {v.value}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}

            <div className="flex gap-3 justify-end pt-2 border-t border-zinc-800">
              <Button variant="secondary" onClick={handleCancelAttrs}>Cancelar</Button>
              <Button onClick={handleConfirmAttrs}>
                Actualizar variantes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de precios al generar variantes por primera vez */}
      {showPriceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowPriceModal(false)} />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-zinc-100">Aplicar precios a las variantes</h3>
            <p className="text-xs text-zinc-500">Los valores seleccionados se replicarán a todas las variantes generadas.</p>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={priceDefaults.retail}
                onChange={e => setPriceDefaults(p => ({ ...p, retail: e.target.checked }))}
                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-cyan-500" />
              <div>
                <span className="text-sm text-zinc-300">Precio de venta</span>
                <span className="text-sm text-cyan-400 ml-2 font-mono">${form.retailPrice || 0}</span>
              </div>
            </label>

            {form.wholesalePrice != null && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={priceDefaults.wholesale}
                  onChange={e => setPriceDefaults(p => ({ ...p, wholesale: e.target.checked }))}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-cyan-500" />
                <div>
                  <span className="text-sm text-zinc-300">Precio mayorista</span>
                  <span className="text-sm text-cyan-400 ml-2 font-mono">${form.wholesalePrice || 0}</span>
                  {form.wholesaleMinQty && <span className="text-xs text-zinc-600 ml-1">(mín. {form.wholesaleMinQty}u)</span>}
                </div>
              </label>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <Button variant="secondary" onClick={() => setShowPriceModal(false)}>Cancelar</Button>
              <Button onClick={() => doGenerateSkus(true)}>
                Generar {Object.values(selectedAttributes).reduce((acc, v) => acc * (v.size || 1), 1)} variantes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
