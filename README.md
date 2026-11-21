# ☕ The Coffee Haven — Full-Stack Coffee Shop Web Application
### *BREW • BITE • RELAX*

A modern, production-grade full-stack coffee shop web application designed and built with a **Java 17 / Spring Boot 3** backend, **Spring Data JPA**, an embedded **SQLite relational database**, and a **React 18** frontend styled with **Sass (SCSS)**.

---

## 📋 Table of Contents
1. [Brand Overview & Visual Identity](#-brand-overview--visual-identity)
2. [Key Features & System Architecture](#-key-features--system-architecture)
   - [A. Home Page](#a-home-page)
   - [B. Authentication & Role-Based Access](#b-authentication--role-based-access)
   - [C. Customer Dashboard & Ordering](#c-customer-dashboard--ordering)
   - [D. Admin Dashboard & Operations](#d-admin-dashboard--operations)
   - [E. Common Global Footer](#e-common-global-footer)
3. [Default Credentials](#-default-credentials)
4. [Technology Stack](#-technology-stack)
5. [Database & Persistence Model](#-database--persistence-model)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [Testing & Quality Verification](#-testing--quality-verification)
8. [Getting Started & Running the Application](#-getting-started--running-the-application)

---

## 🎨 Brand Overview & Visual Identity

**The Coffee Haven** is an artisanal coffee sanctuary where high-altitude mountain Arabica beans meet serene aesthetics.

- **Brand Name**: **The Coffee Haven**
- **Tagline**: `BREW • BITE • RELAX`
- **Logo Integration**: Placed across all touchpoints: Navigation bar, Hero crest, Modals, Digital receipts, and Footer.
- **Color Palette**:
  - **Deep Espresso & Dark Roast** (`#120905`, `#1a0f0a`, `#22130c`): Rich coffee dark tones providing a warm, luxurious cafe backdrop.
  - **Warm Amber Gold & Caramel** (`#d4a373`, `#c89666`, `#e5ab74`): Signature metallic accents for buttons, borders, highlights, and icons.
  - **Whipped Cream & Vanilla Foam** (`#fdfbf7`, `#f7efe2`): High-contrast text and warm light mode surfaces.
  - **Blossom Glow** (`#e8b4a2`): Soft warm highlights inspired by the tranquil cherry blossom atmosphere.
- **Light & Dark Theme**: Built-in instant theme switcher (`☀️ / 🌙`) with persistent state across all pages.

---

## 🚀 Key Features & System Architecture

### A. Home Page
- **Navigation Bar**:
  - Left: The Coffee Haven logo and brand name with `BREW • BITE • RELAX` badge.
  - Right: Login button, Sign Up button, and Dark/Light mode toggle.
  - *Dynamic State*: The `Home` link is strictly visible only when logged out, ensuring a clean dashboard experience when authenticated.
- **Hero / Introduction Section**:
  - Highlighting the central brand crest and artisanal story.
  - Showcases values: sustainable sourcing, handcrafted patisserie, peaceful ambiance, and seamless branch ordering.
  - Quick action buttons to explore menu, browse locations, or register.
- **Our Locations Section**:
  - Highlights all 3 operating branches with full details and photography:
    1. **Hyderabad**: Plot 42, Road No. 36, Jubilee Hills (7:00 AM – 11:30 PM) — *Botanical Glasshouse*
    2. **Vijayawada**: Trendset Tower, MG Road (7:30 AM – 11:00 PM) — *Acoustic Brick Lounge*
    3. **Rajahmundry**: Riverview Boulevard, Godavari Pushkar Ghat (7:00 AM – 10:30 PM) — *Godavari Deck*
  - Quick *"Order From Here"* triggers that set branch context dynamically.
- **Customer Feedback Section**:
  - Interactive submission form: Customer Name, Email, Feedback message, 1–5 Star Rating selector, and Submit button.
  - Backed by persistent database storage (`/api/feedback`) and live review feed.

### B. Authentication & Role-Based Access
- **Dual Role Accounts**: **Customer Account** and **Admin Account**.
- **Customer Sign Up**: Self-registration with full name, email, phone number, and password with input validation.
- **Secure Authentication**: SHA-256 password hashing and role-based validation.
- **Role Redirection**:
  - Customers are redirected to the **Customer Dashboard & Menu**.
  - Administrators are redirected to the **Admin Dashboard** (`/admin`).
  - Strict route guarding: Customers cannot access administrative management consoles.

### C. Customer Dashboard & Ordering
- **Navigation Bar**:
  - Shows user name, Account modal trigger, Cart count badge, Logout button, and Dark/Light toggle.
  - Login, Sign Up, and Home buttons are hidden when authenticated.
- **Location Selector (Hyderabad, Vijayawada, Rajahmundry)**:
  - Branch switcher immediately adjusts the menu to reflect location-specific inventory.
- **Menu Categories & Subcategories**:
  - **A. Drinks**: Clicking reveals two subcategories:
    - **Coffee**: Espresso, Latte, Cappuccino, Caramel Macchiato, Cold Coffee, Hazelnut Mocha.
    - **Tea**: Royal Masala Chai, Classic Earl Grey, Organic Jasmine Green Tea, Hibiscus Berry Tea.
  - **B. Milkshakes**: Belgian Chocolate Shake, Strawberry Velvet, Salted Caramel Pretzel, Oreo Dream Shake.
  - **C. Sandwiches**: Pesto Veg Panini, Paneer Tikka, Chicken Club, Smoked Chicken & Jalapeno with **Vegetarian** and **Non-Vegetarian** filters.
  - **D. Pastries**: Butter Croissant, Almond Croissant, Blueberry Muffin, Cinnamon Roll, Belgian Chocolate Eclair, Pecan Danish with **Nut-Free** filters.
- **Product Cards**:
  - Product thumbnail, name, description, price (₹), dietary badges (🟢 Veg / 🔴 Non-Veg), allergen indicators (Nut-Free / Contains Nuts), and stock status.
  - **Dynamic (+) and (−) Quantity Controls**: Directly on the card with instant dynamic updates without page reloads.
- **Guest Browsing Rules**:
  - Guests can view the full menu across all branches.
  - Attempting to add items to the cart or checkout as a guest prompts authentication (`🔒 Sign in to Order`).
- **Shopping Cart & Checkout**:
  - Floating cart bar and slide-in drawer showing items, subtotal, 5% GST tax, and final total.
  - **Multi-Step Checkout Flow**:
    1. Order Summary
    2. Confirm selected branch location
    3. Customer contact details & order type (Express Pickup, Dine-In, Takeaway)
    4. Secure Payment Gateway (UPI / QR, Credit/Debit Card, Net Banking, Pay at Counter)
    5. Mock encrypted gateway processing animation (PCI-DSS & 256-bit SSL badges)
    6. Digital Order Confirmation receipt with unique Order ID and live preparation tracker.
- **Customer Account Section**:
  - **My Profile**: View and edit contact details.
  - **My Cart**: Manage active quantities and proceed to checkout.
  - **Past Orders**: History of previous orders with date, branch, items, quantities, total, payment status, and live preparation status (*Pending, Confirmed, Preparing, Ready, Completed, Cancelled*).

### D. Admin Dashboard & Operations
- **Navbar**: Admin badge, Logout, and Theme toggle.
- **4.1 Menu Management**:
  - Full catalog view across all categories.
  - **Add New Menu Item**: Name, price, category, subcategory, dietary type, allergen flag, description, and image URL.
  - **Edit Item**: Update any product attribute in real time.
  - **Delete Item**: Remove products from the catalog.
- **4.2 Location-Based Item Availability**:
  - Branch selector (**Hyderabad**, **Vijayawada**, **Rajahmundry**).
  - Interactive **Enable / Disable Toggle Switches** per menu item.
  - *Example Configured & Tested*:
    - **Cappuccino**: Enabled in Hyderabad & Vijayawada, Disabled in Rajahmundry.
    - **Cold Coffee**: Enabled in Hyderabad & Rajahmundry, Disabled in Vijayawada.
    - **Veg Sandwich**: Disabled in Hyderabad, Enabled in Vijayawada & Rajahmundry.
    - Disabling an item at one branch immediately hides it from customer menus at that location without affecting other branches.
- **4.3 Order Management**:
  - Comprehensive view of all incoming customer orders across all locations.
  - Multi-parameter filtering:
    - **By Location**: All, Hyderabad, Vijayawada, Rajahmundry.
    - **By Status**: Pending, Confirmed, Preparing, Ready for Pickup, Completed, Cancelled.
    - **By Date**: Calendar date filter.
    - **Search**: By Order ID, customer name, email, or phone.
  - **Live Status Update**: Dropdown on each order to advance status (*Pending &rarr; Confirmed &rarr; Preparing &rarr; Ready for Pickup &rarr; Completed &rarr; Cancelled*).

### E. Common Global Footer
- Consistent across Home, Customer Dashboard, and Admin Dashboard.
- Brand identity, About Us story, Quick navigation links, Branch locations, Contact numbers (+91), Social media links, and Copyright.

---

## 🔑 Default Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@thecoffeehaven.com` | `admin` | Full Administrative Console |
| **Administrator (Alt)** | `admin@coffeehaven.com` | `admin123` | Full Administrative Console |
| **Customer** | `customer@thecoffeehaven.com` | `customer123` | Menu, Cart, Checkout & Orders |

> **One-Click Demo Buttons**: The Login modal includes quick demo buttons to automatically populate customer or admin credentials.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend Language** | Java 17 | Enterprise LTS Java runtime |
| **Framework** | Spring Boot 3.2.0 | Enterprise REST framework |
| **Persistence** | Spring Data JPA / Hibernate | Entity ORM and Repository abstraction |
| **Database** | SQLite | Persistent ACID database (`coffeeshop.db`) |
| **Database Driver** | SQLite JDBC (3.45.1.0) | Java-to-SQLite connection pool |
| **API Docs** | OpenAPI 3 / Swagger (`springdoc-openapi`) | Interactive REST API documentation (`/swagger-ui.html`) |
| **Frontend Framework** | React 18 | Declarative component UI |
| **Build Tooling** | Vite 5 | Fast HMR dev server and production bundler |
| **Styling** | Sass (SCSS) | Custom luxury coffee design system with dark/light theming |
| **Testing** | JUnit 5, Mockito, Vitest | Unit, mock, and integration test coverage |

---

## 🗄️ Database & Persistence Model

The SQLite database is initialized via `schema.sql` and seeded with `data.sql`:

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT,
    price REAL NOT NULL,
    food_type TEXT DEFAULT 'VEG',
    nut_free BOOLEAN NOT NULL DEFAULT 1,
    image_url TEXT,
    available BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    phone TEXT,
    role TEXT NOT NULL
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    location TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL,
    payment_method TEXT,
    payment_status TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE product_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    location TEXT NOT NULL,
    available BOOLEAN NOT NULL,
    UNIQUE(product_id, location),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    rating INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

---

## 📡 API Endpoints Reference

### Products & Menu
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve all products (optional `category` filter) |
| `GET` | `/api/products/menu` | Location-filtered menu (`location`, `category`, `nutFreeOnly`) |
| `GET` | `/api/products/{id}` | Get product by numeric ID |
| `POST` | `/api/products` | Create a new product (Admin) |
| `PUT` | `/api/products/{id}` | Update an existing product (Admin) |
| `DELETE` | `/api/products/{id}` | Remove a product (Admin) |

### Branch Availability
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/availability` | Get full product-location availability matrix |
| `PUT` | `/api/availability/{productId}/{location}` | Toggle availability boolean for a specific branch |

### Authentication & Users
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new customer account |
| `POST` | `/api/auth/login` | Authenticate customer or administrator |
| `PUT` | `/api/auth/profile/{id}` | Update customer profile details |
| `GET` | `/api/users` | List all registered users (Admin) |

### Orders & Checkout
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/orders` | Fetch orders (`location`, `customerEmail`, `status`) |
| `POST` | `/api/orders` | Place a customer order |
| `PUT` | `/api/orders/{id}/status` | Update order status (`PENDING`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`) |

### Customer Feedback
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/feedback` | Retrieve customer reviews |
| `POST` | `/api/feedback` | Submit feedback with 1–5 star rating |

---

## 🧪 Testing & Quality Verification

### 1. Backend Test Suite (JUnit 5 + Mockito)
Run all backend tests:
```bash
cd backend
mvn test
```
- **15 Tests Passing (0 Failures, 0 Errors)**:
  - `CoffeeShopApplicationTests`: Spring Boot context initialization.
  - `PastryControllerTest`: REST API endpoints and exception handlers.
  - `PastryServiceTest`: Core retrieval and nut-free logic.
  - `ExtendedServicesTest`: Order totals, status lifecycle checks, availability matrix.

### 2. Frontend Test Suite (Vitest + React Testing Library)
Run all frontend tests:
```bash
cd frontend
npm test
```
- **3 Tests Passing**:
  - Brand identity and tagline rendering.
  - `Home` button rendering when logged out.
  - `Home` button strictly **hidden** when logged in as Customer or Admin.

---

## 🚀 Getting Started & Running the Application

### Prerequisites
- **Java 17+**
- **Maven 3.9+**
- **Node.js 18+** & **npm**

### Option 1: Run Full-Stack via Spring Boot (Recommended)
The frontend build is packaged directly inside the Spring Boot JAR:
```bash
cd backend
mvn spring-boot:run
```
Open **`http://localhost:8080/`** in your browser.

- **Web Application**: `http://localhost:8080/`
- **Swagger / OpenAPI**: `http://localhost:8080/swagger-ui.html`
- **Health Check**: `http://localhost:8080/actuator/health`

### Option 2: Run with Vite Hot-Module Replacement (Frontend Development)
In Terminal 1 (Backend):
```bash
cd backend
mvn spring-boot:run
```

In Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
Open **`http://localhost:5173/`** (API requests are automatically proxied to port 8080).
