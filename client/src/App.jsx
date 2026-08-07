import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import OfflineBanner from "./components/OfflineBanner";
import { useLanguage } from "./context/LanguageContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import Support from "./pages/Support";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Inventory from "./pages/admin/Inventory";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import Customers from "./pages/admin/Customers";
import AdminSupport from "./pages/admin/Support";

export default function App() {
  const { t } = useLanguage();
  return (
    <>
      <OfflineBanner />
      <Routes>
      {/* Admin/CRM section renders its own dark shell without the storefront navbar */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="orders" element={<OrdersAdmin />} />
        <Route path="customers" element={<Customers />} />
        <Route path="support" element={<AdminSupport />} />
      </Route>

      {/* Storefront section */}
      <Route
        path="/*"
        element={
          <div className="app-shell">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/support"
                element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <footer className="site-footer">
              <div className="container">{t("footer")}</div>
            </footer>
          </div>
        }
      />
      </Routes>
    </>
  );
}
