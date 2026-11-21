# ☕ Brew & Co. — Full-Stack Coffee Shop Web Application
### JPMorganChase (JPMC) Software Services Internship (SSI) Challenge

A production-grade, multi-module full-stack application developed during the four-week **SSI Challenge** component of the eight-week JPMorganChase internship. Built with a **Java 21 / Spring Boot 3** backend, **Spring Data JPA**, an embedded **SQLite relational database**, and a **React 18** frontend styled with **Sass**.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Layered Design](#architecture--layered-design)
3. [Technology Stack](#technology-stack)
4. [Key Features & Implemented Modules](#key-features--implemented-modules)
   - [A. Customer-Facing Coffee & Pastry Selection](#a-customer-facing-coffee--pastry-selection)
   - [B. Interactive Admin Console](#b-interactive-admin-console)
   - [C. Core Retrieval Features (Specific Intern Contributions)](#c-core-retrieval-features-specific-intern-contributions)
5. [Database & Persistence Model](#database--persistence-model)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Testing & Quality Verification](#testing--quality-verification)
8. [Getting Started & Running the Application](#getting-started--running-the-application)
9. [Four-Week Development Journey](#four-week-development-journey)

---

## 1. Project Overview
- **Project**: Full-Stack Coffee Shop Application
- **Duration**: Four weeks (Part of 8-week JPMorganChase Internship)
- **Project Structure**: Multi-module Maven application (`backend` and `frontend`)
- **Application Type**: Client-Server Full-Stack Web Application

The application automates coffee shop operations by unifying customer coffee/pastry ordering, location-aware inventory retrieval, and an administrative console managing users, live catalog updates, multi-branch availability (Downtown, Airport, Campus), and real-time order lifecycle tracking.

---

## 2. Architecture & Layered Design

The system implements strict separation of concerns across a layered architecture:

```
+-------------------------------------------------------------------------+
|                       React 18 Frontend (Vite)                          |
|  - Coffee/Pastry Menu   - Location Selector   - Shopping Cart           |
|  - Admin Console        - Live REST API Explorer (Swagger / Actuator)   |
+-------------------------------------------------------------------------+
                                    |
                         HTTP / JSON REST APIs
                                    v
+-------------------------------------------------------------------------+
|                  Controller Layer (Spring Boot Web)                     |
|  - PastryController     - ProductController    - UserController         |
|  - OrderController      - AvailabilityController                        |
|  - GlobalExceptionHandler (@RestControllerAdvice)                        |
+-------------------------------------------------------------------------+
                                    |
                              DTOs & Calls
                                    v
+-------------------------------------------------------------------------+
|                     Service Layer (Business Logic)                      |
|  - PastryService        - ProductService       - UserService            |
|  - OrderService         - AvailabilityService                           |
+-------------------------------------------------------------------------+
                                    |
                           JPA Repository Calls
                                    v
+-------------------------------------------------------------------------+
|                 Repository Layer (Spring Data JPA)                      |
|  - ProductRepository    - UserRepository                                |
|  - OrderRepository      - ProductAvailabilityRepository                 |
+-------------------------------------------------------------------------+
                                    |
                              JDBC Queries
                                    v
+-------------------------------------------------------------------------+
|                     SQLite Relational Database                          |
|  - products             - users                - orders                 |
|  - order_items          - product_availability                          |
+-------------------------------------------------------------------------+
```

### Layer Responsibilities
1. **Presentation Layer (React 18 + Sass)**: Renders responsive user interfaces, handles client state (cart, location, category filters), and communicates asynchronously with backend endpoints.
2. **Controller Layer (Spring Boot Web)**: Exposes RESTful endpoints, handles parameter validation (`@Valid`), manages HTTP status codes (`200 OK`, `201 CREATED`, `400 BAD REQUEST`, `404 NOT FOUND`), and maps domain exceptions via `@RestControllerAdvice`.
3. **Service Layer**: Implements core business logic, coordinates transactions, validates business rules, and isolates repositories from controllers.
4. **Repository Layer (Spring Data JPA)**: Provides clean abstraction over relational data access with custom derived queries (`findByCategoryIgnoreCaseAndNutFreeTrue`).
5. **Database Layer (SQLite)**: Provides persistent, relational ACID storage initialized via `schema.sql` and `data.sql`.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend Language** | Java 21 | Modern LTS Java backend runtime |
| **Framework** | Spring Boot 3.2.0 | Enterprise REST framework |
| **Web Module** | Spring Web (MVC) | REST controllers and HTTP request dispatching |
| **Persistence** | Spring Data JPA / Hibernate | Repository abstraction and ORM |
| **Database** | SQLite | Relational file-based database (`coffeeshop.db`) |
| **Connectivity** | SQLite JDBC Driver (3.45.1.0) | Java-to-SQLite connection pool |
| **Dialect** | Hibernate Community Dialects | SQLite dialect for Hibernate 6 |
| **Monitoring** | Spring Boot Actuator | Health and metrics monitoring (`/actuator/health`) |
| **Validation** | Spring Boot Validation (Hibernate Validator) | Bean validation (`@NotBlank`, `@NotNull`, `@Email`) |
| **API Documentation** | OpenAPI 3 / Swagger (`springdoc-openapi`) | Interactive API exploration (`/swagger-ui.html`) |
| **Frontend Framework** | React 18+ | Declarative component UI |
| **Frontend Tooling** | Vite | Fast HMR dev server and bundler |
| **Frontend Styling** | Sass (SCSS) | Maintainable styling and design system |
| **Testing** | JUnit 5, Mockito, Spring Test, Vitest | Unit, mock, and integration test coverage |
| **Build Management** | Maven 3.9+ | Multi-module build lifecycle management |

---

## 4. Key Features & Implemented Modules

### A. Customer-Facing Coffee & Pastry Selection
- **Branch Selection**: Filter available products by branch: **Downtown**, **Airport**, or **Campus**.
- **Category Filtering**: Instant switching between **All**, **Coffee**, and **Pastry**.
- **Nut-Free Filter**: Toggle to isolate nut-free pastries for customers with dietary restrictions or allergies.
- **Product Cards**: Display product badges (Coffee / Pastry, Nut-Free flag, Price, ID) with quick "Add to order".
- **Cart & Checkout**: Real-time cart calculation, name entry, and immediate order dispatch to the backend.

### B. Interactive Admin Console
- **User Management**: Add new staff/admin users with email validation, list existing staff, and delete accounts.
- **Product Management**: Real-time inline editing of product names, categories, pricing, and allergen indicators.
- **Product Availability by Location**: Interactive grid showing product availability across all three branches (Downtown, Airport, Campus) with instant toggle checkboxes.
- **Order Management**: Monitor customer orders, branch location, item breakdown, and update statuses (**PENDING** &rarr; **PREPARING** &rarr; **COMPLETED**).

### C. Core Retrieval Features (Specific Intern Contributions)
During Week 2 of the internship, two core backend retrieval features were designed and implemented:

#### Feature 1: Retrieve Nut-Free Pastries (`GET /api/pastries/nut-free`)
- **Objective**: Retrieve only pastries that satisfy `nutFree == true`.
- **Expected Behavior**:
  - Nut-free pastries available: Returns HTTP 200 with matching records (e.g. Butter Croissant, Blueberry Muffin, Cinnamon Roll).
  - No nut-free pastries available: Returns HTTP 200 with an empty collection `[]`.

#### Feature 2: Retrieve Pastry by ID (`GET /api/pastries/{id}`)
- **Objective**: Retrieve a specific pastry by its unique numeric ID.
- **Expected Behavior**:
  - Valid pastry ID: Returns HTTP 200 with the matching pastry record.
  - Non-existent ID or non-pastry product: Returns HTTP 404 with standard structured error JSON.

---

## 5. Database & Persistence Model

The SQLite database is initialized automatically with `schema.sql` and seeded with `data.sql`:

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    nut_free BOOLEAN NOT NULL
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer TEXT NOT NULL,
    location TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL,
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
```

---

## 6. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/pastries/nut-free` | **Feature 1**: Retrieve all nut-free pastries |
| `GET` | `/api/pastries/{id}` | **Feature 2**: Retrieve single pastry by ID (404 if not found) |
| `GET` | `/api/products` | Retrieve all products (optional `?category=...`) |
| `GET` | `/api/products/menu` | Location-specific menu (`?location=...&category=...&nutFreeOnly=true`) |
| `GET` | `/api/products/{id}` | Retrieve product by ID |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/{id}` | Update an existing product |
| `DELETE` | `/api/products/{id}` | Delete a product |
| `GET` | `/api/users` | List all system users |
| `POST` | `/api/users` | Create user account (`ADMIN` / `STAFF`) |
| `DELETE` | `/api/users/{id}` | Delete user account |
| `GET` | `/api/orders` | Retrieve list of all orders |
| `POST` | `/api/orders` | Place a new customer order |
| `PUT` | `/api/orders/{id}/status` | Update order status (`PENDING`, `PREPARING`, `COMPLETED`) |
| `GET` | `/api/availability` | Retrieve location availability matrix |
| `PUT` | `/api/availability/{productId}/{location}` | Toggle product availability at location |
| `GET` | `/swagger-ui.html` | Interactive Swagger API documentation |
| `GET` | `/actuator/health` | Application health check endpoint |

---

## 7. Testing & Quality Verification

Unit and mock tests are implemented using **JUnit 5**, **Mockito**, and **Spring MockMvc**:

- `PastryServiceTest`:
  - `shouldReturnMatchingPastriesWhenAvailable`
  - `shouldReturnEmptyListWhenNoNutFreePastries`
  - `shouldReturnPastryWhenValidId`
  - `shouldThrowExceptionWhenIdNotFound`
  - `shouldThrowExceptionWhenProductIsNotPastry`
- `PastryControllerTest`:
  - `testGetNutFreePastries` (HTTP 200 with JSON array)
  - `testGetNutFreePastriesEmpty` (HTTP 200 with empty array)
  - `testGetPastryByIdSuccess` (HTTP 200 with product details)
  - `testGetPastryByIdNotFound` (HTTP 404 with structured error response)
- `ExtendedServicesTest`:
  - Product updates, User management, Order calculations, Order status validation, Location availability matrix.

Run tests:
```bash
mvn test -f backend/pom.xml
```

---

## 8. Getting Started & Running the Application

### Option A: Running the Spring Boot Full-Stack Server (Single Port 8080)
The backend serves both the REST API and the bundled frontend:
```bash
# Compile and run Spring Boot backend
mvn spring-boot:run -f backend/pom.xml
```
- Open browser to **`http://localhost:8080/`** to view the application.
- Swagger UI: **`http://localhost:8080/swagger-ui.html`**
- Health Check: **`http://localhost:8080/actuator/health`**

### Option B: Running React Frontend in Development Mode (Vite)
```bash
# In frontend directory
cd frontend
npm install
npm run dev
```
- Frontend will run on **`http://localhost:5173/`** with hot-reload, proxying API requests to Spring Boot on port 8080.

---

## 9. Four-Week Development Journey
- **Week 1 — Project Understanding & Architecture**: Explored the multi-module Maven structure, Spring Boot 3, Java 21, and layered architecture principles (Controller &rarr; Service &rarr; Repository &rarr; SQLite).
- **Week 2 — Backend Retrieval Features**: Implemented nut-free pastry retrieval and ID lookup, edge-case exception handling, and comprehensive unit tests.
- **Week 3 — Frontend Development & Integration**: Built the coffee selection interface, administrative dashboards for users, inventory, location matrices, and order management.
- **Week 4 — Collaboration, Peer Code Reviews & Demonstration**: Participated in peer code reviews, resolved integration and data mapping issues, and presented the end-to-end working system.
