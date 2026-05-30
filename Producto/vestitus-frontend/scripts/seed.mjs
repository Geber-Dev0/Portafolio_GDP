import { readFileSync, writeFileSync, unlinkSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = process.env.API_URL || 'https://vestitus-p0ma5xte8-gabrieleduardohg-8905s-projects.vercel.app/api'

const products = [
  { name: 'Vestido Noche Esmeralda', description: 'Elegante vestido largo color esmeralda con escote en V, ideal para galas.', category: 'vestidos', type: 'both', price: 45000, stock: 3, size: 'M', color: 'Verde Esmeralda', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80' },
  { name: 'Vestido Bohemio Floral', description: 'Vestido ligero con estampado floral y mangas amplias.', category: 'vestidos', type: 'rent', price: 32000, stock: 5, size: 'S', color: 'Multicolor', img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80' },
  { name: 'Vestido Cocktail Negro', description: 'Vestido corto negro con detalles de encaje.', category: 'vestidos', type: 'both', price: 38000, stock: 4, size: 'M', color: 'Negro', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80' },
  { name: 'Vestido Gala Terciopelo', description: 'Vestido de terciopelo burdeos con espalda descubierta.', category: 'vestidos', type: 'rent', price: 55000, stock: 2, size: 'L', color: 'Burdeos', img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80' },
  { name: 'Traje Ejecutivo Carbón', description: 'Traje sastre gris carbón de dos piezas.', category: 'trajes', type: 'both', price: 65000, stock: 3, size: 'L', color: 'Gris Carbón', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80' },
  { name: 'Blazer + Pantalón Camel', description: 'Conjunto de blazer y pantalón recto en tono camel.', category: 'trajes', type: 'sale', price: 72000, stock: 2, size: 'M', color: 'Camel', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80' },
  { name: 'Smoking Clásico', description: 'Smoking negro con solapa de raso.', category: 'trajes', type: 'rent', price: 58000, stock: 2, size: 'XL', color: 'Negro', img: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80' },
  { name: 'Chaqueta Denim + Jeans', description: 'Chaqueta denim con jeans de corte recto.', category: 'casual', type: 'sale', price: 35000, stock: 6, size: 'M', color: 'Azul', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80' },
  { name: 'Sweater Oversize Beige', description: 'Sweater tejido oversize en tono beige.', category: 'casual', type: 'both', price: 28000, stock: 8, size: 'L', color: 'Beige', collection: 'invierno', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80' },
  { name: 'Parka Invierno Verde Oliva', description: 'Parka acolchada con capucha.', category: 'casual', type: 'sale', price: 42000, stock: 4, size: 'M', color: 'Verde Oliva', collection: 'invierno', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80' },
  { name: 'Vestido Largo Gala Dorado', description: 'Vestido largo dorado con lentejuelas.', category: 'formal', type: 'rent', price: 68000, stock: 1, size: 'S', color: 'Dorado', collection: 'invierno', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80' },
  { name: 'Traje Noche Azul Medianoche', description: 'Traje de noche azul marino completo.', category: 'formal', type: 'rent', price: 60000, stock: 2, size: 'L', color: 'Azul Marino', img: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&q=80' },
  { name: 'Abrigo Largo Lana', description: 'Abrigo clásico de lana hasta la rodilla.', category: 'formal', type: 'both', price: 52000, stock: 3, size: 'M', color: 'Gris', collection: 'invierno', img: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80' },
  { name: 'Chaleco Acolchado', description: 'Chaleco acolchado reversible.', category: 'casual', type: 'sale', price: 25000, stock: 7, size: 'L', color: 'Negro', collection: 'invierno', img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80' },
  { name: 'Sweater Cuello Alto Cashmere', description: 'Sweater de cashmere cuello alto.', category: 'casual', type: 'both', price: 38000, stock: 5, size: 'M', color: 'Crema', collection: 'invierno', img: 'https://images.unsplash.com/photo-1490914327627-9fe8d52f4d90?w=800&q=80' },
]

const tmpDir = join(__dirname, '..', 'tmp')
mkdirSync(tmpDir, { recursive: true })

async function api(method, path, token, body) {
  const opts = { method, headers: {} }
  if (token) opts.headers['Authorization'] = `Bearer ${token}`
  if (body && !(body instanceof FormData)) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  } else if (body instanceof FormData) {
    opts.body = body
  }
  const res = await fetch(`${BASE}${path}`, opts)
  return res
}

async function login() {
  const res = await api('POST', '/auth/login', null, { email: 'nira.sleyton@gmail.com', password: 'nira.vestitus26$' })
  if (!res.ok) throw new Error(`Login failed: ${res.status}`)
  const json = await res.json()
  return json.data.token
}

async function getAllProducts(token) {
  const res = await api('GET', '/products', token)
  const json = await res.json()
  return json.data || []
}

async function deleteProduct(token, id) {
  const res = await api('DELETE', `/products/${id}`, token)
  if (!res.ok) console.warn(`  ⚠ No se pudo eliminar ${id}: ${res.status}`)
}

async function createProduct(token, p) {
  const res = await api('POST', '/products', token, {
    name: p.name, description: p.description, category: p.category,
    type: p.type, price: p.price, stock_quantity: p.stock, size: p.size, color: p.color, collection: p.collection,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Create failed: ${res.status} ${text}`)
  }
  const json = await res.json()
  return json.data.id
}

async function uploadImage(token, productId, imgPath) {
  const file = readFileSync(imgPath)
  const blob = new Blob([file], { type: 'image/jpeg' })
  const fd = new FormData()
  fd.append('image', blob, `${productId}.jpg`)

  const res = await fetch(`${BASE}/products/${productId}/images`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload failed: ${res.status} ${text}`)
  }
  const json = await res.json()
  console.log(`  ✓ Imagen subida: ${json.data.url.substring(0, 60)}...`)
}

async function main() {
  console.log('🔐 Iniciando sesión...')
  const token = await login()
  console.log('  ✓ Login exitoso')

  // 1. Obtener productos existentes y eliminar duplicados del seed
  console.log('\n📋 Limpiando productos semilla anteriores...')
  const existing = await getAllProducts(token)
  const seedNames = new Set(products.map(p => p.name))
  let deleted = 0
  for (const prod of existing) {
    if (seedNames.has(prod.name)) {
      await deleteProduct(token, prod.id)
      deleted++
    }
  }
  console.log(`  ✓ ${deleted} productos semilla eliminados`)

  // 2. Crear productos frescos con imágenes
  for (const p of products) {
    console.log(`\n📦 ${p.name} (${p.category})`)
    try {
      const id = await createProduct(token, p)
      console.log(`  ✓ Creado (${id})`)

      const imgPath = join(tmpDir, `${id}.jpg`)
      console.log('  ⬇ Descargando imagen...')
      const imgRes = await fetch(p.img)
      if (!imgRes.ok) throw new Error(`Download failed: ${imgRes.status}`)
      const imgBuf = Buffer.from(await imgRes.arrayBuffer())
      writeFileSync(imgPath, imgBuf)
      console.log('  ✓ Imagen descargada')

      console.log('  ⬆ Subiendo imagen al servidor...')
      await uploadImage(token, id, imgPath)
      unlinkSync(imgPath)
    } catch (e) {
      console.error(`  ✗ Error: ${e.message}`)
    }
  }

  // 3. Verificar resultados
  console.log('\n🔍 Verificando productos con imágenes...')
  const final = await getAllProducts(token)
  let withImg = 0
  for (const prod of final) {
    if (seedNames.has(prod.name)) {
      const hasImg = prod.images && prod.images.length > 0
      console.log(`  ${hasImg ? '✅' : '❌'} ${prod.name} — ${hasImg ? prod.images[0].url : 'sin imagen'}`)
      if (hasImg) withImg++
    }
  }
  console.log(`\n✅ Proceso completado: ${withImg}/15 productos con imágenes`)
}

main().catch(console.error)