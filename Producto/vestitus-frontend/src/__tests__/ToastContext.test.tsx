import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ToastProvider, useToast } from '../contexts/ToastContext'

function TestButton() {
  const { showToast } = useToast()
  return <button onClick={() => showToast('Test message', 'success')}>Show Toast</button>
}

describe('ToastContext', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows toast on click', () => {
    render(
      <ToastProvider>
        <TestButton />
      </ToastProvider>
    )

    fireEvent.click(screen.getByText('Show Toast'))
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('removes toast after timeout', () => {
    render(
      <ToastProvider>
        <TestButton />
      </ToastProvider>
    )

    fireEvent.click(screen.getByText('Show Toast'))
    expect(screen.getByText('Test message')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
  })

  it('shows multiple toasts', () => {
    render(
      <ToastProvider>
        <TestButton />
      </ToastProvider>
    )

    fireEvent.click(screen.getByText('Show Toast'))
    fireEvent.click(screen.getByText('Show Toast'))
    fireEvent.click(screen.getByText('Show Toast'))

    const toasts = screen.getAllByText('Test message')
    expect(toasts).toHaveLength(3)
  })

  it('dismisses toast on close button click', () => {
    render(
      <ToastProvider>
        <TestButton />
      </ToastProvider>
    )

    fireEvent.click(screen.getByText('Show Toast'))
    expect(screen.getByText('Test message')).toBeInTheDocument()

    const closeButtons = screen.getAllByRole('button')
    const closeBtn = closeButtons.find(b => b.querySelector('svg'))
    if (closeBtn) fireEvent.click(closeBtn)

    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
  })
})
