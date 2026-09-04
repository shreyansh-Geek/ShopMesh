import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import Search from './pages/Search';
import Product from './pages/Product';
import Compare from './pages/Compare';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/search" element={<Search />} />

          <Route
            path="/product/:id"
            element={<Product />}
          />

          <Route
            path="/compare"
            element={<Compare />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;