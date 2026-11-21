-- ==========================================
-- The Coffee Haven - Master Seed Data
-- ==========================================

-- Initial Products (Categories: Drinks, Milkshakes, Sandwiches, Pastries)
-- Retain IDs 1-9 to keep legacy tests 100% happy, plus extended items
INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (1, 'Espresso', 'Drinks', 'Coffee', 'Rich, intense, full-bodied single origin shot topped with dense caramel crema.', 160.00, 'VEG', 1, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (2, 'Latte', 'Drinks', 'Coffee', 'Double shot of artisan espresso blended with silky micro-foamed milk.', 240.00, 'VEG', 1, 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (3, 'Cappuccino', 'Drinks', 'Coffee', 'Equal parts dark espresso, velvety steamed milk, and airy dusted foam.', 220.00, 'VEG', 1, 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (4, 'Caramel Macchiato', 'Drinks', 'Coffee', 'Vanilla-scented steamed milk marked with bold espresso and drizzled with caramel.', 260.00, 'VEG', 1, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (5, 'Butter Croissant', 'Pastries', 'Croissants', 'Golden, flaky, 27-layer French puff pastry made with pure Normandy butter.', 180.00, 'VEG', 1, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (6, 'Almond Croissant', 'Pastries', 'Croissants', 'Double-baked croissant filled with rich almond frangipane and toasted almond slivers.', 220.00, 'VEG', 0, 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (7, 'Blueberry Muffin', 'Pastries', 'Muffins', 'Moist vanilla batter loaded with wild blueberries and topped with cinnamon streusel.', 190.00, 'VEG', 1, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (8, 'Pecan Danish', 'Pastries', 'Danish', 'Sweet glazed pastry crown filled with maple custard and whole toasted pecans.', 230.00, 'VEG', 0, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (9, 'Cinnamon Roll', 'Pastries', 'Rolls', 'Warm, soft rolled brioche swirled with aromatic Saigon cinnamon and cream cheese glaze.', 210.00, 'VEG', 1, 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&q=80', 1);

-- More Drinks (Coffee & Tea)
INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (10, 'Cold Coffee', 'Drinks', 'Coffee', 'Slow-brewed dark roast shaken with chilled whole milk, cane sugar, and vanilla cream.', 210.00, 'VEG', 1, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (11, 'Hazelnut Mocha', 'Drinks', 'Coffee', 'Dark Dutch chocolate, fresh espresso shot, roasted hazelnut syrup, and whipped cream.', 270.00, 'VEG', 0, 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (12, 'Royal Masala Chai', 'Drinks', 'Tea', 'Assam Orthodox black tea simmered with fresh crushed cardamom, ginger, cloves, and whole milk.', 140.00, 'VEG', 1, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (13, 'Classic Earl Grey', 'Drinks', 'Tea', 'Fragrant black tea leaves infused with cold-pressed Calabrian bergamot essential oil.', 180.00, 'VEG', 1, 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (14, 'Organic Jasmine Green Tea', 'Drinks', 'Tea', 'Delicate high-grown green tea gently scented with midnight-blooming jasmine flowers.', 190.00, 'VEG', 1, 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&q=80', 1);

-- Milkshakes
INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (15, 'Belgian Chocolate Shake', 'Milkshakes', 'Chocolate', 'Decadent 70% dark Belgian chocolate ganache blended with creamy gelato and chocolate flakes.', 280.00, 'VEG', 1, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (16, 'Strawberry Velvet Shake', 'Milkshakes', 'Fruit', 'Fresh garden strawberries simmered into compote and blended with Madagascar vanilla bean milk.', 260.00, 'VEG', 1, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (17, 'Salted Caramel Pretzel Shake', 'Milkshakes', 'Caramel', 'Handcrafted salted butter caramel sauce blended with sweet cream and crushed pretzel crust.', 270.00, 'VEG', 1, 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (18, 'Oreo Dream Cookie Shake', 'Milkshakes', 'Cookies & Cream', 'Crisp chocolate Oreo cookies crushed and swirled into thick vanilla bean shake with cocoa rim.', 260.00, 'VEG', 1, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80', 1);

-- Sandwiches
INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (19, 'Veg Sandwich', 'Sandwiches', 'Panini', 'Fresh garden basil pesto, vine-ripened tomatoes, grilled zucchini and molten mozzarella on sourdough.', 240.00, 'VEG', 1, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (20, 'Paneer Tikka Grilled Sandwich', 'Sandwiches', 'Grilled', 'Charcoal-smoked marinated cottage cheese, crunchy capsicum, and mint coriander glaze in focaccia.', 250.00, 'VEG', 1, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (21, 'Classic Chicken Club Sandwich', 'Sandwiches', 'Club', 'Slow-herb-roasted chicken breast, sharp English cheddar, crisp lettuce, tomato and smoked aioli.', 290.00, 'NON_VEG', 1, 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=600&q=80', 1);

INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (22, 'Smoked Chicken & Jalapeno Melt', 'Sandwiches', 'Melt', 'Tender shredded hickory-smoked chicken, spicy fire-pickled jalapenos, and melted Monterey Jack.', 310.00, 'NON_VEG', 1, 'https://images.unsplash.com/photo-1521390188846-e2a39b7ef4a8?auto=format&fit=crop&w=600&q=80', 1);

-- More Pastries
INSERT OR IGNORE INTO products (id, name, category, subcategory, description, price, food_type, nut_free, image_url, available) 
VALUES (23, 'Belgian Chocolate Eclair', 'Pastries', 'Eclair', 'Crisp choux shell piped with silky dark chocolate pastry cream and finished with mirror glaze.', 230.00, 'VEG', 1, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80', 1);

-- ==========================================
-- Users (Admin, Staff, Customer)
-- ==========================================
-- Passwords: 'admin' hashed is 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
-- Also supports plain text fallback in AuthController
INSERT OR IGNORE INTO users (id, name, email, password, phone, role) 
VALUES (1, 'Haven Administrator', 'admin@thecoffeehaven.com', 'admin', '+91 99887 76655', 'ADMIN');

INSERT OR IGNORE INTO users (id, name, email, password, phone, role) 
VALUES (2, 'Store Manager', 'admin@coffeehaven.com', 'admin123', '+91 98480 12345', 'ADMIN');

INSERT OR IGNORE INTO users (id, name, email, password, phone, role) 
VALUES (3, 'Asha Rao', 'asha@brew.co', 'admin', '+91 98490 54321', 'ADMIN');

INSERT OR IGNORE INTO users (id, name, email, password, phone, role) 
VALUES (4, 'Rohan Sharma', 'customer@thecoffeehaven.com', 'customer123', '+91 98765 43210', 'CUSTOMER');

-- ==========================================
-- Product Availability by Location
-- Requirement 4.2 Example:
-- Menu Item     | Hyderabad | Vijayawada | Rajahmundry
-- Cappuccino(3) | Enabled   | Enabled    | Disabled
-- Cold Coffee(10)| Enabled   | Disabled   | Enabled
-- Veg Sandwich(19)| Disabled  | Enabled    | Enabled
-- ==========================================

-- Hyderabad
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (1, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (2, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (3, 'Hyderabad', 1); -- Cappuccino: Enabled
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (4, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (5, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (6, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (7, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (8, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (9, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (10, 'Hyderabad', 1); -- Cold Coffee: Enabled
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (11, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (12, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (13, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (14, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (15, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (16, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (17, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (18, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (19, 'Hyderabad', 0); -- Veg Sandwich: Disabled
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (20, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (21, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (22, 'Hyderabad', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (23, 'Hyderabad', 1);

-- Vijayawada
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (1, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (2, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (3, 'Vijayawada', 1); -- Cappuccino: Enabled
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (4, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (5, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (6, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (7, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (8, 'Vijayawada', 0);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (9, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (10, 'Vijayawada', 0); -- Cold Coffee: Disabled
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (11, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (12, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (13, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (14, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (15, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (16, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (17, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (18, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (19, 'Vijayawada', 1); -- Veg Sandwich: Enabled
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (20, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (21, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (22, 'Vijayawada', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (23, 'Vijayawada', 1);

-- Rajahmundry
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (1, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (2, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (3, 'Rajahmundry', 0); -- Cappuccino: Disabled
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (4, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (5, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (6, 'Rajahmundry', 0);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (7, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (8, 'Rajahmundry', 0);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (9, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (10, 'Rajahmundry', 1); -- Cold Coffee: Enabled
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (11, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (12, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (13, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (14, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (15, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (16, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (17, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (18, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (19, 'Rajahmundry', 1); -- Veg Sandwich: Enabled
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (20, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (21, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (22, 'Rajahmundry', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (23, 'Rajahmundry', 1);

-- Backward compatibility for tests (Downtown, Airport, Campus)
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (1, 'Downtown', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (2, 'Downtown', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (3, 'Downtown', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (4, 'Downtown', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (5, 'Downtown', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (6, 'Downtown', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (7, 'Downtown', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (8, 'Downtown', 1);
INSERT OR IGNORE INTO product_availability (product_id, location, available) VALUES (9, 'Downtown', 1);

-- Initial Orders
INSERT OR IGNORE INTO orders (id, customer, customer_email, customer_phone, location, total, status, payment_method, payment_status, created_at) 
VALUES (1, 'Rohan Sharma', 'customer@thecoffeehaven.com', '+91 98765 43210', 'Hyderabad', 460.00, 'CONFIRMED', 'UPI', 'PAID', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO order_items (id, order_id, product_name, price, quantity) VALUES (1, 1, 'Latte', 240.00, 1);
INSERT OR IGNORE INTO order_items (id, order_id, product_name, price, quantity) VALUES (2, 1, 'Cappuccino', 220.00, 1);

-- Initial Customer Feedbacks
INSERT OR IGNORE INTO feedback (id, name, email, message, rating, created_at)
VALUES (1, 'Priya Reddy', 'priya.reddy@example.com', 'The atmosphere at the Jubilee Hills cafe is unbelievable! The Caramel Macchiato paired with the Butter Croissant was pure perfection.', 5, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO feedback (id, name, email, message, rating, created_at)
VALUES (2, 'Vikram Varma', 'vikram.v@example.com', 'Best cold coffee in Rajahmundry hands down! The riverfront views make it the most peaceful coffee spot.', 5, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO feedback (id, name, email, message, rating, created_at)
VALUES (3, 'Ananya Sen', 'ananya.sen@example.com', 'Loved the Belgian Chocolate shake in Vijayawada! Super rich, prompt service, and very welcoming staff.', 5, CURRENT_TIMESTAMP);
