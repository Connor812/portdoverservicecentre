import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from "./DataProvider";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Helmet from 'react-helmet';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Thankyou from './pages/Thankyou';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

import './assets/css/main.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Home from './pages/Home';


function App() {
  return (
    <Router>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </Router>
  );
}

function AppContent() {
  return (
    <>
      <Helmet>
        <title>Port Dover's Service Centre</title>
        <meta name="description" content="Port Dover's Service Centre. It's an auto shop." />
        <link rel="icon" href="" />
      </Helmet>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thankyou/:id" element={<Thankyou />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/:error" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoutes element={<Dashboard />} />} />
      </Routes>
    </>
  );
}

export default App;