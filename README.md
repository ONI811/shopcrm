<<<<<<< HEAD
# ShopCRM - E-commerce + CRM full-stack app

A single codebase covering both required halves of the assignment:

- **Storefront** (`/`, `/products/:id`, `/cart`, `/checkout`, `/orders`, `/support`) - the shopper-facing e-commerce app.
- **CRM back office** (`/admin`) - staff-only dashboard for inventory, orders, customers, and support, visually distinct (dark "ledger" theme) from the storefront.

## Stack

- **Frontend**: React 18 + React Router, built with Vite. Plain CSS (no UI kit) so every component's markup is easy to read for the assignment write-up.
- **Backend**: Node.js + Express, JWT auth (`jsonwebtoken`), password hashing (`bcryptjs`).
- **Data**: JSON-file store (`server/data/db.js` + `server/data/store.json`), seeded with demo users/products on first run. Every write (register, checkout, ticket reply, etc.) is saved to `store.json` immediately, so **accounts and data survive server restarts**. Swap it for MongoDB/Postgres later without touching route logic - every route only calls the functions that module exports.

## Getting started

Requires Node.js 18+. Run the backend and frontend in two terminals - **both must be running** for login/checkout/etc. to work. If the frontend can't reach the backend, a banner appears at the top of the page telling you so (instead of buttons silently doing nothing).

```bash
# Terminal 1 - API server (http://localhost:5000)
cd server
cp .env.example .env
npm install
npm run dev        # or: npm start

# Terminal 2 - React app (http://localhost:5173)
cd client
npm install
npm run dev
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`, so the client just calls relative paths like `/api/products`. Open the app at **http://localhost:5173** (not the API port).

## Password requirements

New accounts require a password that is 8+ characters and includes at least 3 of: lowercase letters, uppercase letters, numbers, symbols (similar to Facebook/Google's strength rules). The Register page shows a live strength meter; the server re-validates the same rule so it can't be bypassed from the browser.

## Language support

A language switcher (top-right of the navbar, and in the CRM sidebar) lets you switch the UI between English, Español, Français, বাংলা, and हिन्दी. The choice is remembered in the browser.

## Demo accounts

| Role     | Email                 | Password       |
|----------|------------------------|----------------|
| Admin    | admin@shopcrm.test     | Admin!2345     |
| Customer | shopper@shopcrm.test   | Shopper!2345   |

Or register a new account from `/register` - new accounts are always created with the `customer` role. Click the demo-account chips on the login page to autofill these credentials.

## Project layout

```
server/
  data/db.js          in-memory data + seed data
  middleware/auth.js   JWT verification + admin guard
  routes/              one file per resource (auth, products, cart, orders, tickets, customers, analytics)
  server.js             wires everything into an Express app

client/
  src/api.js            single fetch wrapper used by every page
  src/context/          AuthContext (session) and CartContext (shopping cart)
  src/components/       Navbar, ProductCard, ProtectedRoute
  src/pages/             storefront pages
  src/pages/admin/       CRM pages (Dashboard, Inventory, OrdersAdmin, Customers, Support)
```

## Feature -> route map

| Feature (assignment spec)      | Frontend route         | Backend endpoint(s) |
|--------------------------------|-------------------------|----------------------|
| User Authentication            | `/login`, `/register`   | `POST /api/auth/login`, `POST /api/auth/register` |
| Product Catalog                | `/`                      | `GET /api/products` |
| Shopping Cart                  | `/cart`                  | `GET/POST/PUT/DELETE /api/cart` |
| Checkout Flow                  | `/checkout`               | `POST /api/orders` |
| Order History                  | `/orders`                 | `GET /api/orders` |
| Customer Profiles (CRM)        | `/admin/customers`         | `GET /api/customers`, `GET /api/customers/:id` |
| Order Management (CRM)         | `/admin/orders`            | `GET /api/orders`, `PUT /api/orders/:id/status` |
| Inventory Control (CRM)        | `/admin/inventory`         | `POST/PUT/DELETE /api/products/:id` |
| Support System                 | `/support`, `/admin/support` | `GET/POST /api/tickets`, `POST /api/tickets/:id/reply` |
| Analytics Dashboard (CRM)      | `/admin`                    | `GET /api/analytics` |

## Troubleshooting

**"I create an account but can't log back in / the app forgot it."** This was a real bug: accounts used to live only in server memory and vanished on every restart. Fixed - accounts are now saved to `server/data/store.json` on disk immediately after registration, so they persist across restarts. (Deleting that file resets the app back to the two demo accounts.)

**"Nothing happens when I click Log in / Sign up."** This almost always means the backend isn't running, or is running on a different port than the client expects (5000). The app now shows an orange banner at the top of the page when it can't reach the API, and every request failure shows a real error message instead of failing silently.


## Notes on the 5 React concepts (for the written portion)

- **Components**: `Navbar`, `ProductCard`, `ProtectedRoute`, and every page are self-contained components; `AdminLayout` composes the CRM pages via `<Outlet />`.
- **Events**: `onClick` (add to cart, edit/delete product, status changes), `onSubmit` (login, checkout, ticket forms), `onChange` (search box, quantity steppers).
- **State**: `useState` for local UI state (search text, form fields) and React Context (`AuthContext`, `CartContext`) for state shared across many pages.
- **List Operations**: `.map()` over products, cart lines, orders, tickets, and customers, each rendered with a stable `key`.
- **Form Control**: every `<input>`/`<textarea>` in Login, Register, Checkout, Inventory, and Support is a controlled component bound to state via `value` + `onChange`.

Want the full written deliverable (concept explanations + the two request/response flow write-ups) as a formatted document? Just ask.
=======
# Shopcrm
>>>>>>> 496ff1e742e8f3e3f285701429505390e1a19853
