export const SEASON_LABEL = ''

export interface SampleProduct {
  id: string
  name: string
  description: string
  category: string
  type: string
  price: number
  stock: number
  is_available: boolean
  images: { url: string }[]
  created_at: string
}

export const sampleProducts: SampleProduct[] = [
  {
    id: 'sample-1',
    name: 'Vestido Largo Floral',
    description: 'Vestido largo estampado floral, tela ligera. Perfecto para ocasiones especiales.',
    category: 'Vestidos',
    type: 'arriendo',
    price: 25000,
    stock: 3,
    is_available: true,
    images: [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80' }],
    created_at: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    name: 'Terno Clásico Gris',
    description: 'Terno dos piezas, corte moderno. Ideal para eventos formales.',
    category: 'Trajes',
    type: 'arriendo',
    price: 45000,
    stock: 2,
    is_available: true,
    images: [{ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80' }],
    created_at: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    name: 'Zapatos de Cuero Negro',
    description: 'Zapatos formales de cuero, talla 42. Cómodos y elegantes.',
    category: 'Calzado',
    type: 'venta',
    price: 35000,
    stock: 5,
    is_available: true,
    images: [{ url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80' }],
    created_at: new Date().toISOString(),
  },
  {
    id: 'sample-4',
    name: 'Corbata Seda Azul',
    description: 'Corbata de seda azul marino. Accesorio clásico para cualquier ocasión.',
    category: 'Accesorios',
    type: 'venta',
    price: 12000,
    stock: 10,
    is_available: true,
    images: [{ url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80' }],
    created_at: new Date().toISOString(),
  },
  {
    id: 'sample-5',
    name: 'Vestido Noche Rojo',
    description: 'Vestido de gala rojo con pedrería. Deslumbra en tu evento especial.',
    category: 'Vestidos',
    type: 'arriendo',
    price: 35000,
    stock: 2,
    is_available: true,
    images: [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80' }],
    created_at: new Date().toISOString(),
  },
  {
    id: 'sample-6',
    name: 'Chaqueta Denim',
    description: 'Chaqueta denim clásica, estilo casual. Combina con todo.',
    category: 'Casual',
    type: 'venta',
    price: 28000,
    stock: 4,
    is_available: true,
    images: [{ url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80' }],
    created_at: new Date().toISOString(),
  },
  {
    id: 'sample-7',
    name: 'Abrigo Largo Lana',
    description: 'Abrigo largo de lana, color camel. Perfecto para el invierno.',
    category: 'Abrigos',
    type: 'arriendo',
    price: 55000,
    stock: 2,
    is_available: true,
    images: [{ url: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80' }],
    created_at: new Date().toISOString(),
  },
  {
    id: 'sample-8',
    name: 'Jeans Clásicos',
    description: 'Jeans de corte recto, color azul oscuro. Básico e imprescindible.',
    category: 'Casual',
    type: 'venta',
    price: 22000,
    stock: 6,
    is_available: true,
    images: [{ url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80' }],
    created_at: new Date().toISOString(),
  },
]
