import { Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OrderDetailsPage from './pages/OrderDetailsPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import StorePage from './pages/StorePage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetailsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;