const BASE_URL = "/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    // fetch() itself throws when the backend can't be reached at all
    // (server not running, wrong port, no internet). Without this catch
    // the login/register form would just show nothing.
    throw new Error(
      "Can't reach the ShopCRM server. Make sure the backend is running (cd server && npm run dev) on http://localhost:5000."
    );
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status}).`);
  }
  return data;
}

// GET /api/health - used to show a banner if the backend isn't reachable,
// instead of every button silently doing nothing.
export function checkHealth() {
  return request("/health");
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/auth/me", { token }),

  getProducts: (query = "") => request(`/products${query}`),
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (payload, token) => request("/products", { method: "POST", body: payload, token }),
  updateProduct: (id, payload, token) => request(`/products/${id}`, { method: "PUT", body: payload, token }),
  deleteProduct: (id, token) => request(`/products/${id}`, { method: "DELETE", token }),

  getCart: (token) => request("/cart", { token }),
  addToCart: (productId, quantity, token) => request("/cart", { method: "POST", body: { productId, quantity }, token }),
  updateCartItem: (productId, quantity, token) => request(`/cart/${productId}`, { method: "PUT", body: { quantity }, token }),
  removeCartItem: (productId, token) => request(`/cart/${productId}`, { method: "DELETE", token }),

  checkout: (shippingAddress, token) => request("/orders", { method: "POST", body: { shippingAddress }, token }),
  getOrders: (token) => request("/orders", { token }),
  updateOrderStatus: (id, status, token) => request(`/orders/${id}/status`, { method: "PUT", body: { status }, token }),

  getTickets: (token) => request("/tickets", { token }),
  createTicket: (payload, token) => request("/tickets", { method: "POST", body: payload, token }),
  replyTicket: (id, message, token) => request(`/tickets/${id}/reply`, { method: "POST", body: { message }, token }),
  updateTicketStatus: (id, status, token) => request(`/tickets/${id}/status`, { method: "PUT", body: { status }, token }),

  getCustomers: (token) => request("/customers", { token }),
  getCustomer: (id, token) => request(`/customers/${id}`, { token }),

  getAnalytics: (token) => request("/analytics", { token }),
};
