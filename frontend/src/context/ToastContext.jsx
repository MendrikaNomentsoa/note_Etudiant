import { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counterRef = useRef(0)

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++counterRef.current
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
      )
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 300)
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
    )
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type} ${toast.removing ? 'removing' : ''}`}
          >
            <span className="toast-icon">
              {toast.type === 'success' && '✅'}
              {toast.type === 'error'   && '❌'}
              {toast.type === 'info'    && 'ℹ️'}
            </span>
            <span>{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
