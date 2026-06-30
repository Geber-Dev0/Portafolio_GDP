import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { Product } from '../types'

const mockShowToast = vi.fn()

vi.mock('../contexts/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
  ToastProvider: ({ children }: any) => children,
}))

import { CartProvider, useCart } from '../contexts/CartContext'

const product: Product = {
  id: 'p1',
  name: 'Vestido Test',
  price: 45000,
  stock: 5,
  is_available: true,
  type: 'both',
  description: 'Test',
  category: 'vestidos',
  images: [],
  created_at: '2026-01-01',
}

function TestCart() {
  const { items, addItem, removeItem, updateItem, clearCart, itemCount, total } = useCart()
  return (
    <div>
      <span data-testid="count">{itemCount}</span>
      <span data-testid="total">{total}</span>
      <span data-testid="items">{JSON.stringify(items)}</span>
      <button onClick={() => addItem(product, 'sale')}>Add Sale</button>
      <button onClick={() => addItem(product, 'rent', { startDate: '2026-06-01', endDate: '2026-06-05', periodType: 'days' })}>Add Rent</button>
      <button onClick={() => removeItem('test-id')}>Remove</button>
      <button onClick={() => updateItem('test-id', { quantity: 3 })}>Update</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  )
}

function renderCart() {
  return render(
    <CartProvider>
      <TestCart />
    </CartProvider>
  )
}

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('starts with empty cart', () => {
    renderCart()
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(screen.getByTestId('total').textContent).toBe('0')
  })

  it('adds sale item', () => {
    renderCart()

    fireEvent.click(screen.getByText('Add Sale'))

    const items = JSON.parse(screen.getByTestId('items').textContent || '[]')
    expect(items).toHaveLength(1)
    expect(items[0].product.id).toBe('p1')
    expect(items[0].type).toBe('sale')
    expect(mockShowToast).toHaveBeenCalledWith(
      'Vestido Test — compra agregado al carrito',
      'success'
    )
  })

  it('adds rental item', () => {
    renderCart()

    fireEvent.click(screen.getByText('Add Rent'))

    const items = JSON.parse(screen.getByTestId('items').textContent || '[]')
    expect(items).toHaveLength(1)
    expect(items[0].type).toBe('rent')
    expect(items[0].startDate).toBe('2026-06-01')
    expect(mockShowToast).toHaveBeenCalledWith(
      'Vestido Test — arriendo agregado al carrito',
      'success'
    )
  })

  it('increments quantity for duplicate sale items', () => {
    renderCart()

    fireEvent.click(screen.getByText('Add Sale'))
    fireEvent.click(screen.getByText('Add Sale'))

    const items = JSON.parse(screen.getByTestId('items').textContent || '[]')
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(2)
  })

  it('does not duplicate rental items with same dates', () => {
    renderCart()

    fireEvent.click(screen.getByText('Add Rent'))
    fireEvent.click(screen.getByText('Add Rent'))

    const items = JSON.parse(screen.getByTestId('items').textContent || '[]')
    expect(items).toHaveLength(1)
  })

  it('calculates total price', () => {
    renderCart()

    fireEvent.click(screen.getByText('Add Sale'))
    fireEvent.click(screen.getByText('Add Sale'))

    expect(screen.getByTestId('total').textContent).toBe('90000')
  })

  it('clears cart', () => {
    renderCart()

    fireEvent.click(screen.getByText('Add Sale'))
    fireEvent.click(screen.getByText('Clear'))

    const items = JSON.parse(screen.getByTestId('items').textContent || '[]')
    expect(items).toHaveLength(0)
  })
})
