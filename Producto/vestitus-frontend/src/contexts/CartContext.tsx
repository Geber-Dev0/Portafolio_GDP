import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Product } from '../types'

export interface CartItem {
  id: string
  product: Product
  type: 'rent' | 'sale'
  startDate?: string
  endDate?: string
  periodType?: 'days' | 'weeks' | 'months'
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, type: 'rent' | 'sale', details?: { startDate?: string; endDate?: string; periodType?: string }) => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<CartItem>) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType | null>(null)

const CART_KEY = 'vestitus_cart'
let idCounter = 0
function genId() {
  idCounter++
  return `cart-${Date.now()}-${idCounter}`
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(items)) }, [items])

  const addItem = useCallback((product: Product, type: 'rent' | 'sale', details?: { startDate?: string; endDate?: string; periodType?: string }) => {
    setItems(prev => {
      if (type === 'sale') {
        const existing = prev.find(i => i.product.id === product.id && i.type === 'sale')
        if (existing) return prev.map(i => i.id === existing.id ? { ...i, quantity: Math.min(i.product.stock, i.quantity + 1) } : i)
      }
      if (type === 'rent') {
        const existing = prev.find(i => i.product.id === product.id && i.type === 'rent' && i.startDate === details?.startDate && i.endDate === details?.endDate)
        if (existing) return prev
      }
      return [...prev, {
        id: genId(), product, type, quantity: 1,
        startDate: details?.startDate, endDate: details?.endDate,
        periodType: details?.periodType as 'days' | 'weeks' | 'months' | undefined,
      }]
    })
  }, [])

  const removeItem = useCallback((id: string) => setItems(prev => prev.filter(i => i.id !== id)), [])
  const updateItem = useCallback((id: string, updates: Partial<CartItem>) => setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i)), [])
  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateItem, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
