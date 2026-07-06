import { Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import StorePage from './pages/StorePage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
