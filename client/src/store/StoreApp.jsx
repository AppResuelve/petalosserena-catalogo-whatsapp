import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { StoreProvider } from './context/StoreContext'
import StorePages from './StorePages'

export default function StoreApp() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <StoreProvider>
        <CartProvider>
          <StorePages />
        </CartProvider>
      </StoreProvider>
    </BrowserRouter>
  )
}
