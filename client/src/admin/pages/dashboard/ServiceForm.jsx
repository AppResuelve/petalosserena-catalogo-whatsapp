import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader } from 'lucide-react'
import { Button, Input, Textarea, Select } from '../../components/ui/Form'
import ImageUpload from '../../components/ImageUpload'
import { useAlert } from '../../components/ui/AlertContext'
import api from '../../../api/admin'

const EMPTY_SERVICE = {
  name: '', slug: '', description: '', images: [], price: 0, status: 'active',
}

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 255)

export default function ServiceForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const Alert = useAlert()
  const [form, setForm] = useState(EMPTY_SERVICE)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState('')
  const [slugManual, setSlugManual] = useState(false)

  useEffect(() => {
    if (!id) return
    api.get(`/admin/services/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.name || '', slug: data.slug || '',
          description: data.description || '', images: data.images || [],
          price: data.price || 0, status: data.status || 'active',
        })
        setSlugManual(true)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (field, value) => {
    const next = { ...form, [field]: value }
    if (field === 'name' && !slugManual) next.slug = slugify(value)
    setForm(next)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { Alert.fire({ message: 'El nombre es obligatorio', type: 'warning' }); return }
    if (!form.slug.trim()) handleChange('slug', slugify(form.name))

    setError('')
    setSaving(true)
    try {
      const payload = { ...form, price: Number(form.price) || 0 }
      if (isEditing) {
        await api.put(`/admin/services/${id}`, payload)
      } else {
        await api.post('/admin/services', payload)
      }
      Alert.fire({ message: isEditing ? 'Servicio actualizado' : 'Servicio creado', type: 'success' })
      navigate('/dashboard/services')
    } catch (err) {
      let msg = 'Error al guardar'
      try { const b = typeof err.response?.data === 'string' ? JSON.parse(err.response.data) : err.response?.data; msg = b?.error || b?.message || msg } catch {}
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-6 h-6 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => navigate('/dashboard/services')} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /><span className="text-sm">Volver a servicios</span>
      </button>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 pb-24 lg:pb-0">
        <h1 className="text-2xl font-bold text-zinc-100">{isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}</h1>

        {error && <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        <ImageUpload images={form.images} onChange={(imgs) => handleChange('images', imgs)} max={2} folder="servicios" />

        <Input label="Nombre" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
        <Input
          label="Slug" value={form.slug}
          onChange={(e) => { setSlugManual(true); handleChange('slug', slugify(e.target.value)) }}
          placeholder="nombre-del-servicio" required
        />
        <Textarea label="Descripción" value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Descripción del servicio" />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Precio" type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} />
          <Select label="Estado" value={form.status} onChange={(e) => handleChange('status', e.target.value)}
            options={[{ value: 'active', label: 'Activo' }, { value: 'draft', label: 'Borrador' }]} />
        </div>

        <div className="fixed bottom-0 left-0 right-0 lg:static flex gap-3 justify-end px-4 pb-8 pt-4 lg:p-0 lg:pt-2 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 lg:border-0 lg:bg-transparent z-20">
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/services')}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear servicio'}</Button>
        </div>
      </form>
    </div>
  )
}
