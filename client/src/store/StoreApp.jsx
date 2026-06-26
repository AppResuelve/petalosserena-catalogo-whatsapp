import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { StoreProvider } from './context/StoreContext'
import StorePages from './StorePages'

export default function StoreApp() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <CartProvider>
          <StorePages />
        </CartProvider>
      </StoreProvider>
    </BrowserRouter>
  )
}
