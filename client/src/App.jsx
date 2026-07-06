import { Route, Routes } from 'react-router';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import StorePage from './pages/StorePage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
    </Routes>
  );
}

export default App;
