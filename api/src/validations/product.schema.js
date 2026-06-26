const { z } = require('zod')

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  slug: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  retailPrice: z.number().min(0, 'El precio de venta debe ser mayor o igual a 0'),
  comparePrice: z.number().nullable().optional(),
  discountPercentage: z.number().int().min(1, 'El descuento debe ser al menos 1%').max(100, 'El descuento no puede superar 100%').nullable().optional(),
  wholesalePrice: z.number().nullable().optional(),
  wholesaleMinQty: z.number().int().nullable().optional(),
  status: z.enum(['active', 'draft']).optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.number().nullable().optional(),
})

const bulkProductSchema = z.array(z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  price: z.number().min(0),
  description: z.string().optional(),
  images: z.union([z.string(), z.array(z.string())]).optional(),
  retailPrice: z.number().optional(),
  comparePrice: z.number().nullable().optional(),
  discountPercentage: z.number().int().min(1).max(100).nullable().optional(),
  wholesalePrice: z.number().nullable().optional(),
  wholesaleMinQty: z.number().int().nullable().optional(),
}))

function validateProduct(body) {
  const result = productSchema.safeParse(body)
  if (!result.success) {
    const message = result.error.errors.map(e => e.message).join(', ')
    throw Object.assign(new Error(message), { status: 400 })
  }
  return result.data
}

function validateBulkProducts(body) {
  const result = bulkProductSchema.safeParse(body.products)
  if (!result.success) {
    const message = result.error.errors.map(e => e.message).join(', ')
    throw Object.assign(new Error(message), { status: 400 })
  }
  return result.data
}

module.exports = { productSchema, bulkProductSchema, validateProduct, validateBulkProducts }
