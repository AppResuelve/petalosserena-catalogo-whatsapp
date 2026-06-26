import { useState, useRef, useMemo, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { Upload, FileSpreadsheet, AlertTriangle, ChevronDown } from 'lucide-react'
import { Button } from './ui/Form'
import { Modal } from './ui/Modal'
import { useAlert } from './ui/AlertContext'
import api from '../../api/admin'

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 255) || 'sin-nombre'

const NAME_ALIASES = ['nombre', 'name', 'producto', 'product', 'product_name', 'producto_nombre']
const PRICE_ALIASES = ['precio', 'price', 'importe', 'costo', 'valor', 'retail_price', 'precio_venta']

const OPTIONAL_FIELDS = [
  { key: 'description', label: 'Descripción', aliases: ['descripcion', 'description', 'desc', 'detalle'] },
  { key: 'discountPercentage', label: '% Descuento', aliases: ['descuento', 'discount', 'porcentaje', 'off'] },
  { key: 'comparePrice', label: 'Precio de comparación', aliases: ['precio_original', 'compare_price', 'precio_anterior'] },
  { key: 'wholesalePrice', label: 'Precio mayorista', aliases: ['mayorista', 'wholesale', 'precio_mayorista'] },
  { key: 'wholesaleMinQty', label: 'Cant. mín. mayorista', aliases: ['unidades_mayorista', 'wholesale_min', 'cantidad_mayorista', 'min_mayorista'] },
  { key: 'images', label: 'URL imagen', aliases: ['imagen', 'image', 'foto', 'url_imagen', 'img'] },
]

function detectColumn(headers, aliases) {
  const lower = headers.map((h) => h.toLowerCase().trim())
  for (const alias of aliases) {
    const idx = lower.findIndex((h) => h === alias || h.includes(alias))
    if (idx !== -1) return headers[idx]
  }
  return ''
}

function parseProducts(rawData, nameCol, priceCol, optionals) {
  const products = []
  const errors = []

  rawData.rows.forEach((row, i) => {
    const name = String(row[nameCol] ?? '').trim()
    const price = row[priceCol]

    if (!name) {
      errors.push(`Fila ${i + 2}: falta el nombre`)
      return
    }
    if (price == null || price === '' || isNaN(Number(price)) || Number(price) < 0) {
      errors.push(`Fila ${i + 2}: "${name}" — precio inválido`)
      return
    }

    const p = {
      name,
      slug: slugify(name),
      price: Number(price),
    }

    for (const { key } of OPTIONAL_FIELDS) {
      const col = optionals[key]
      if (!col || row[col] == null || row[col] === '') continue
      if (key === 'images') {
        p[key] = String(row[col])
      } else if (key === 'description') {
        p[key] = String(row[col])
      } else {
        const num = Number(row[col])
        if (!isNaN(num)) p[key] = num
      }
    }

    products.push(p)
  })

  return { products, errors }
}

export default function BulkProductModal({ open, onClose, categories, onCreated }) {
  const Alert = useAlert()
  const fileInputRef = useRef(null)
  const [step, setStep] = useState('upload')
  const [categoryId, setCategoryId] = useState('')
  const [fileName, setFileName] = useState('')
  const [rawData, setRawData] = useState(null)
  const [nameCol, setNameCol] = useState('')
  const [priceCol, setPriceCol] = useState('')
  const [optionals, setOptionals] = useState({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [readError, setReadError] = useState('')
  const [createdCount, setCreatedCount] = useState(0)
  const [warnings, setWarnings] = useState([])
  const [previewPage, setPreviewPage] = useState(1)

  const PREVIEW_SIZE = 50

  const { products: parsed, errors } = useMemo(() => {
    if (!rawData || !nameCol || !priceCol) return { products: [], errors: [] }
    return parseProducts(rawData, nameCol, priceCol, optionals)
  }, [rawData, nameCol, priceCol, optionals])

  useEffect(() => {
    setPreviewPage(1)
  }, [rawData, nameCol, priceCol, optionals])

  const totalPages = Math.ceil(parsed.length / PREVIEW_SIZE)
  const pagedProducts = parsed.slice((previewPage - 1) * PREVIEW_SIZE, previewPage * PREVIEW_SIZE)

  const mappedCount = Object.values(optionals).filter(Boolean).length

  const handleFile = (file) => {
    setReadError('')
    setRawData(null)
    setNameCol('')
    setPriceCol('')
    setOptionals({})
    setShowAdvanced(false)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

        if (rows.length === 0) {
          setReadError('El archivo está vacío o no tiene datos.')
          return
        }

        const headers = Object.keys(rows[0])
        const data = { headers, rows }

        setRawData(data)
        setNameCol(detectColumn(headers, NAME_ALIASES) || headers[0])
        setPriceCol(detectColumn(headers, PRICE_ALIASES) || headers[0])

        const detected = {}
        for (const { key, aliases } of OPTIONAL_FIELDS) {
          const col = detectColumn(headers, aliases)
          if (col) detected[key] = col
        }
        setOptionals(detected)
        if (Object.keys(detected).length > 0) setShowAdvanced(true)

        setStep('mapping')
      } catch {
        setReadError('No se pudo leer el archivo. Verificá que sea .xlsx o .csv válido.')
      }
    }

    reader.readAsArrayBuffer(file)
  }

  const handleSubmit = async () => {
    const final = parsed.filter((p) =>
      p.name && p.price != null && !isNaN(p.price) && Number(p.price) >= 0
    )

    if (final.length === 0) return

    setStep('creating')

    try {
      const { data } = await api.post('/admin/products/bulk', {
        products: final,
        categoryId: categoryId || null,
      })

      setCreatedCount(data.created)
      setWarnings(data.warnings || [])

      if (data.warnings?.length > 0) {
        Alert.fire({
          message: `${data.created} productos creados. ${data.warnings.length} slugs fueron modificados.`,
          type: 'warning',
          duration: 6000,
        })
      } else {
        Alert.fire({
          message: `${data.created} productos creados`,
          type: 'success',
        })
      }

      onCreated?.()
      setStep('results')
    } catch (err) {
      let msg = 'Error al crear productos'
      try {
        const body = typeof err.response?.data === 'string'
          ? JSON.parse(err.response.data)
          : err.response?.data
        msg = body?.error || body?.message || msg
      } catch {}
      Alert.fire({ message: msg, type: 'error' })
      setStep('mapping')
    }
  }

  const handleClose = () => {
    setStep('upload')
    setRawData(null)
    setNameCol('')
    setPriceCol('')
    setOptionals({})
    setShowAdvanced(false)
    setReadError('')
    setFileName('')
    setCategoryId('')
    setWarnings([])
    setCreatedCount(0)
    onClose()
  }

  const reset = () => {
    setRawData(null)
    setNameCol('')
    setPriceCol('')
    setOptionals({})
    setShowAdvanced(false)
    setReadError('')
    setFileName('')
    setWarnings([])
    setCreatedCount(0)
    setStep('upload')
  }

  const extraCols = OPTIONAL_FIELDS.filter(({ key }) => optionals[key])
  const hasExtraCols = extraCols.length > 0

  return (
    <Modal open={open} onClose={handleClose} title="Creación masiva">
      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files[0]
              if (file) handleFile(file)
            }}
            className="border-2 border-dashed border-zinc-700 hover:border-cyan-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-zinc-800/30"
          >
            <FileSpreadsheet className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
            <p className="text-sm text-zinc-400 mb-1">Arrastrá tu archivo o clickeá para buscar</p>
            <p className="text-xs text-zinc-600">.xlsx .csv</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.csv,.xls"
            onChange={(e) => {
              const file = e.target.files[0]
              if (file) handleFile(file)
            }}
            className="hidden"
          />

          {readError && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {readError}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={handleClose}>Cancelar</Button>
          </div>
        </div>
      )}

      {/* Step 2: Mapping */}
      {step === 'mapping' && rawData && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <FileSpreadsheet className="w-4 h-4" />
            <span className="text-zinc-500">{fileName}</span>
            <span className="text-zinc-600">—</span>
            <span className="text-zinc-400">{rawData.rows.length} filas</span>
          </div>

          <p className="text-sm text-zinc-400">Indicá qué columna corresponde a cada campo:</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
                Nombre del producto
              </label>
              <select
                value={nameCol}
                onChange={(e) => setNameCol(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-cyan-500"
              >
                {rawData.headers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
                Precio
              </label>
              <select
                value={priceCol}
                onChange={(e) => setPriceCol(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-cyan-500"
              >
                {rawData.headers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced mapping */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-0' : '-rotate-90'}`} />
            Campos opcionales
            {mappedCount > 0 && (
              <span className="text-xs text-cyan-400">({mappedCount} mapeado{mappedCount !== 1 ? 's' : ''})</span>
            )}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-4">
              {OPTIONAL_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                    {label}
                  </label>
                  <select
                    value={optionals[key] || ''}
                    onChange={(e) => setOptionals((prev) => ({ ...prev, [key]: e.target.value || null }))}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- No mapear --</option>
                    {rawData.headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm space-y-1">
              <p className="font-medium flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.length} fila{errors.length > 1 ? 's' : ''} con problemas:
              </p>
              {errors.map((e, i) => <p key={i}>• {e}</p>)}
            </div>
          )}

          {/* Preview table */}
          {parsed.length > 0 && (
            <>
              {totalPages > 1 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">
                    {previewPage * PREVIEW_SIZE - PREVIEW_SIZE + 1}–{Math.min(previewPage * PREVIEW_SIZE, parsed.length)} de {parsed.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                      disabled={previewPage === 1}
                      className="px-2 py-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                    >
                      Anterior
                    </button>
                    <span className="text-zinc-600 text-xs">{previewPage}/{totalPages}</span>
                    <button
                      onClick={() => setPreviewPage((p) => Math.min(totalPages, p + 1))}
                      disabled={previewPage === totalPages}
                      className="px-2 py-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
              <div className="max-h-64 overflow-y-auto border border-zinc-800 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-900 sticky top-0">
                    <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-3 py-2 font-medium">Nombre</th>
                      <th className="text-left px-3 py-2 font-medium">Slug</th>
                      <th className="text-right px-3 py-2 font-medium">Precio</th>
                      {hasExtraCols && extraCols.map(({ key, label }) => (
                        <th key={key} className="text-right px-3 py-2 font-medium">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {pagedProducts.map((p, i) => (
                      <tr key={i} className="text-zinc-300">
                        <td className="px-3 py-2 truncate max-w-[200px]">{p.name}</td>
                        <td className="px-3 py-2 text-zinc-500 font-mono text-xs">{p.slug}</td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {`$${p.price.toLocaleString('es-AR')}`}
                        </td>
                        {hasExtraCols && extraCols.map(({ key }) => (
                          <td key={key} className="px-3 py-2 text-right text-xs text-zinc-400">
                            {key === 'images' ? (p[key] ? '✓' : '—') : p[key] ?? '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={reset}>Cancelar</Button>
            <Button type="button" onClick={handleSubmit} disabled={parsed.length === 0}>
              Crear {parsed.length} producto{parsed.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}

      {/* Creating */}
      {step === 'creating' && (
        <div className="text-center py-8">
          <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-3 animate-pulse" />
          <p className="text-zinc-300 font-medium">Creando productos...</p>
        </div>
      )}

      {/* Results */}
      {step === 'results' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-emerald-400 font-medium text-lg">{createdCount} productos creados</p>
            {warnings.length === 0 && (
              <p className="text-sm text-zinc-500 mt-1">Sin conflictos de slugs</p>
            )}
          </div>

          {warnings.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <p className="text-sm text-amber-400 font-medium">
                  {warnings.length} slug{warnings.length > 1 ? 's' : ''} modificado{warnings.length > 1 ? 's' : ''} por duplicación:
                </p>
              </div>
              <div className="max-h-52 overflow-y-auto border border-zinc-800 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-900 sticky top-0">
                    <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-3 py-2 font-medium">Producto</th>
                      <th className="text-left px-3 py-2 font-medium">Slug generado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {warnings.map((w, i) => (
                      <tr key={i} className="text-zinc-300">
                        <td className="px-3 py-2 truncate max-w-[200px]">{w.name}</td>
                        <td className="px-3 py-2 text-zinc-400 font-mono text-xs">{w.slug}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-zinc-500 mt-2">Podés editarlos desde la lista de productos.</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button type="button" onClick={handleClose}>Entendido</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
