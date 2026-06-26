import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader, Image } from 'lucide-react'
import { Button, Input, Textarea, Select } from '../../components/ui/Form'
import { Checkbox } from '../../components/ui/Checkbox'
import ImageUpload from '../../components/ImageUpload'
import GalleryPicker from '../../components/GalleryPicker'
import { useProduct } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import api from '../../../api/admin'
import { useAlert } from '../../components/ui/AlertContext'
import { calculateComparePrice } from '../../../utils/discount'

const EMPTY_PRODUCT = {
  name: '',
  slug: '',
  description: '',
  images: [],
  retailPrice: 0,
  comparePrice: null,
  discountPercentage: null,
  wholesalePrice: null,
  wholesaleMinQty: null,
  status: 'active',
  tags: [],
  categoryId: '',
}

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 255)

export default function ProductForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const Alert = useAlert()
  const { product, loading: productLoading } = useProduct(id)
  const { categories } = useCategories()

  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        images: product.images || [],
        retailPrice: product.retailPrice || 0,
        comparePrice: product.comparePrice || null,
        discountPercentage: product.discountPercentage || null,
        wholesalePrice: product.wholesalePrice || null,
        wholesaleMinQty: product.wholesaleMinQty || null,
        status: product.status || 'active',
        tags: product.tags || [],
        categoryId: product.categoryId || '',
      })
      setTagsInput((product.tags || []).join(', '))
      setSlugManual(true)
    }
  }, [product])

  const handleChange = (field, value) => {
    const next = { ...form, [field]: value }

    if (field === 'name' && !slugManual) {
      next.slug = slugify(value)
    }

    if (field === 'retailPrice' || field === 'discountPercentage') {
      const retail = field === 'retailPrice' ? Number(value) : Number(form.retailPrice)
      const pct = field === 'discountPercentage' ? Number(value) : Number(form.discountPercentage)
      next.comparePrice = calculateComparePrice(retail, pct)
    }

    setForm(next)
  }

  const handleTagsChange = (value) => {
    setTagsInput(value)
    const tags = value.split(',').map((t) => t.trim()).filter(Boolean)
    handleChange('tags', tags)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      Alert.fire({ message: 'El nombre es obligatorio', type: 'warning' })
      return
    }
    if (!form.slug.trim()) {
      handleChange('slug', slugify(form.name))
    }

    setError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        categoryId: form.categoryId || null,
        retailPrice: Number(form.retailPrice) || 0,
        comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
        discountPercentage: form.discountPercentage ? Number(form.discountPercentage) : null,
        wholesalePrice: form.wholesalePrice ? Number(form.wholesalePrice) : null,
        wholesaleMinQty: form.wholesaleMinQty ? Number(form.wholesaleMinQty) : null,
      }
      if (isEditing) {
        await api.put(`/admin/products/${id}`, payload)
      } else {
        await api.post('/admin/products', payload)
      }
      Alert.fire({ message: isEditing ? 'Producto actualizado' : 'Producto creado', type: 'success' })
      navigate('/dashboard/products')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar producto')
    } finally {
      setSaving(false)
    }
  }

  if (productLoading && isEditing) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-6 h-6 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => navigate('/dashboard/products')} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Volver a productos</span>
      </button>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 pb-24 lg:pb-0">
        <h1 className="text-2xl font-bold text-zinc-100">
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>

        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <ImageUpload
          images={form.images}
          onChange={(imgs) => handleChange('images', imgs)}
          max={4}
          folder="productos"
        />

        <button
          type="button"
          onClick={() => setGalleryOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-700 transition-colors"
        >
          <Image className="w-4 h-4" />
          Buscar en galería
        </button>

        <Input
          label="Nombre"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />

        <Input
          label="Slug"
          value={form.slug}
          onChange={(e) => {
            setSlugManual(true)
            handleChange('slug', slugify(e.target.value))
          }}
          placeholder="nombre-del-producto"
          required
        />

        <Textarea
          label="Descripción"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Descripción del producto que verán tus clientes"
        />

        <div className="grid grid-cols-3 items-end gap-4">
          <Input
            label="Precio de venta"
            type="number"
            min="0"
            value={form.retailPrice}
            onChange={(e) => handleChange('retailPrice', e.target.value)}
          />
          <Input
            label="% Descuento"
            type="number"
            min="1"
            max="100"
            value={form.discountPercentage || ''}
            onChange={(e) => handleChange('discountPercentage', e.target.value || null)}
            placeholder="Ej: 25"
          />
          <Input
            label="Precio de comparación"
            type="number"
            min="0"
            value={form.comparePrice || ''}
            onChange={(e) => handleChange('comparePrice', e.target.value || null)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
            <Checkbox
              checked={form.wholesalePrice != null || form.wholesaleMinQty != null}
              onChange={(e) => {
                if (!e.target.checked) {
                  handleChange('wholesalePrice', null)
                  handleChange('wholesaleMinQty', null)
                } else {
                  handleChange('wholesalePrice', '')
                  handleChange('wholesaleMinQty', '')
                }
              }}
            />
            ¿Tiene precio mayorista?
          </label>
        </div>

        {(form.wholesalePrice != null || form.wholesaleMinQty != null) && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio mayorista"
              type="number"
              value={form.wholesalePrice || ''}
              onChange={(e) => handleChange('wholesalePrice', e.target.value || null)}
              placeholder="$"
            />
            <Input
              label="Cant. mín. mayorista"
              type="number"
              value={form.wholesaleMinQty || ''}
              onChange={(e) => handleChange('wholesaleMinQty', e.target.value || null)}
              placeholder="Ej: 6 unidades"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Estado"
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: 'active', label: 'Activo' },
              { value: 'draft', label: 'Borrador' },
            ]}
          />
          <Select
            label="Categoría"
            value={form.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            options={[
              { value: '', label: 'Sin categoría' },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>

        <Input
          label="Tags (separados por coma)"
          value={tagsInput}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="destacado, nuevo, oferta"
        />

        <div className="fixed bottom-0 left-0 right-0 lg:static flex gap-3 justify-end px-4 pb-8 pt-4 lg:p-0 lg:pt-2 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 lg:border-0 lg:bg-transparent z-20">
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/products')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </div>
      </form>

      <GalleryPicker
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onSelect={(url) => handleChange('images', [...form.images, url])}
        max={4}
        currentCount={form.images.length}
      />
    </div>
  )
}
