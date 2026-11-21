import React, { useState, useEffect, useMemo } from 'react';
import { API } from '../services/api';

export default function CustomerDashboard({
  user,
  selectedLoc,
  onSelectLoc,
  cart,
  onUpdateCart,
  onClearCart,
  accountOpen,
  onCloseAccount,
  onUpdateUserProfile,
  onOpenAuth,
  showToast
}) {
  // Categories & Subcategories State
  const [activeCategory, setActiveCategory] = useState('Drinks');
  const [activeSubcategory, setActiveSubcategory] = useState('Coffee'); // for Drinks: 'Coffee' or 'Tea'
  const [dietaryFilter, setDietaryFilter] = useState('All'); // 'All', 'VEG', 'NON_VEG', 'NUT_FREE'

  // Server state
  const [allProducts, setAllProducts] = useState([]);
  const [availabilityMatrix, setAvailabilityMatrix] = useState({});
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Checkout & Payment State
  const [checkoutStep, setCheckoutStep] = useState(null); // null | 'checkout' | 'paying' | 'confirmation'
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [customerDetails, setCustomerDetails] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? (user.phone || '') : '',
    orderType: 'Pickup', // 'Pickup' | 'Dine-In' | 'Takeaway'
    notes: ''
  });
  const [paymentForm, setPaymentForm] = useState({
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    bank: 'HDFC Bank'
  });

  // Account Modal Active Tab
  const [accountTab, setAccountTab] = useState('profile'); // 'profile' | 'cart' | 'orders'
  const [profileForm, setProfileForm] = useState({
    name: user ? user.name : '',
    phone: user ? (user.phone || '') : ''
  });

  const locations = [
    { id: 'Hyderabad', name: 'Hyderabad — Jubilee Hills', tag: 'Glasshouse Garden Cafe' },
    { id: 'Vijayawada', name: 'Vijayawada — MG Road', tag: 'Acoustic Brick Lounge' },
    { id: 'Rajahmundry', name: 'Rajahmundry — Riverfront', tag: 'Godavari Deck' }
  ];

  // Category navigation cards
  const categories = [
    {
      id: 'Drinks',
      title: 'Drinks',
      subtitle: 'Artisan Coffee & Botanical Teas',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'Milkshakes',
      title: 'Milkshakes',
      subtitle: 'Velvety Thickshakes & Gelato Blends',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'Sandwiches',
      title: 'Sandwiches',
      subtitle: 'Artisanal Paninis, Melts & Clubs',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'Pastries',
      title: 'Pastries',
      subtitle: 'Flaky Croissants & Fresh Bakes',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80'
    }
  ];

  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, avails] = await Promise.all([
        API.fetchProducts(),
        API.fetchAvailability()
      ]);
      setAllProducts(prods);
      setAvailabilityMatrix(avails);

      if (user && user.email) {
        const ords = await API.fetchOrders({ customerEmail: user.email });
        setPastOrders(ords);
      }
    } catch (err) {
      console.error('Failed to load menu data:', err);
      showToast('Error syncing with backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedLoc, user]);

  useEffect(() => {
    if (user) {
      setCustomerDetails(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
      setProfileForm({
        name: user.name || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Reset subcategory / dietary filters when main category changes
  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    setDietaryFilter('All');
    if (catId === 'Drinks') {
      setActiveSubcategory('Coffee');
    } else {
      setActiveSubcategory('');
    }
  };

  // Location-based filtering:
  // Item must be overall available (product.available !== false) AND enabled for the selected location in availabilityMatrix!
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      // 1. Overall product availability check
      if (p.available === false) return false;

      // 2. Location availability check (requirement 3.4 & 4.2)
      // Check matrix for product id and selected location
      const locMap = availabilityMatrix[p.id];
      if (locMap) {
        // If explicitly set to false for this location, hide it!
        if (locMap[selectedLoc] === false) return false;
      }

      // 3. Category match
      // Also match legacy names ('Coffee' -> 'Drinks', 'Pastry' -> 'Pastries')
      const catMatch =
        p.category.toLowerCase() === activeCategory.toLowerCase() ||
        (activeCategory === 'Drinks' && (p.category.toLowerCase() === 'coffee' || p.category.toLowerCase() === 'drinks')) ||
        (activeCategory === 'Pastries' && (p.category.toLowerCase() === 'pastry' || p.category.toLowerCase() === 'pastries'));

      if (!catMatch) return false;

      // 4. Drinks subcategory filtering: Coffee vs Tea
      if (activeCategory === 'Drinks') {
        if (activeSubcategory === 'Coffee') {
          const isCoffee = (p.subcategory && p.subcategory.toLowerCase() === 'coffee') ||
            p.category.toLowerCase() === 'coffee' ||
            p.name.toLowerCase().includes('espresso') ||
            p.name.toLowerCase().includes('latte') ||
            p.name.toLowerCase().includes('cappuccino') ||
            p.name.toLowerCase().includes('macchiato') ||
            p.name.toLowerCase().includes('mocha') ||
            p.name.toLowerCase().includes('cold coffee');
          if (!isCoffee) return false;
        } else if (activeSubcategory === 'Tea') {
          const isTea = (p.subcategory && p.subcategory.toLowerCase() === 'tea') ||
            p.name.toLowerCase().includes('tea') ||
            p.name.toLowerCase().includes('chai') ||
            p.name.toLowerCase().includes('grey');
          if (!isTea) return false;
        }
      }

      // 5. Dietary & allergen filters
      if (dietaryFilter === 'VEG') {
        if (p.foodType && p.foodType.toUpperCase() === 'NON_VEG') return false;
      } else if (dietaryFilter === 'NON_VEG') {
        if (p.foodType && p.foodType.toUpperCase() !== 'NON_VEG') return false;
      } else if (dietaryFilter === 'NUT_FREE') {
        if (p.nutFree === false) return false;
      }

      return true;
    });
  }, [allProducts, availabilityMatrix, selectedLoc, activeCategory, activeSubcategory, dietaryFilter]);

  // Cart quantity helpers
  const getItemQty = (productId) => {
    return cart[productId] || 0;
  };

  const handleIncrement = (productId) => {
    if (!user) {
      showToast('Please sign in with a customer account to add items to cart.');
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    onUpdateCart(productId, getItemQty(productId) + 1);
  };

  const handleDecrement = (productId) => {
    if (!user) {
      showToast('Please sign in with a customer account.');
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    const current = getItemQty(productId);
    if (current > 0) {
      onUpdateCart(productId, current - 1);
    }
  };

  // Cart calculations
  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([idStr, qty]) => {
        const id = Number(idStr);
        const product = allProducts.find(p => p.id === id);
        return {
          product,
          productId: id,
          quantity: qty,
          subtotal: product ? product.price * qty : 0
        };
      })
      .filter(item => item.product != null);
  }, [cart, allProducts]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  }, [cartItems]);

  const taxAmount = useMemo(() => {
    return Math.round(cartSubtotal * 0.05 * 100) / 100; // 5% GST
  }, [cartSubtotal]);

  const finalTotal = useMemo(() => {
    return Math.round((cartSubtotal + taxAmount) * 100) / 100;
  }, [cartSubtotal, taxAmount]);

  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, q) => sum + q, 0);
  }, [cart]);

  // Place Order handler with realistic secure gateway simulation
  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in with a customer account to place an order.');
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    if (cartItems.length === 0) {
      showToast('Your cart is empty.');
      return;
    }

    setCheckoutStep('paying');

    // Simulate secure 256-bit gateway handshake
    setTimeout(async () => {
      try {
        // Expand product IDs matching quantities
        const productIds = [];
        cartItems.forEach(item => {
          for (let i = 0; i < item.quantity; i++) {
            productIds.push(item.productId);
          }
        });

        const orderPayload = {
          customer: customerDetails.name.trim() || (user ? user.name : 'Valued Patron'),
          customerEmail: customerDetails.email.trim() || (user ? user.email : ''),
          customerPhone: customerDetails.phone.trim() || '',
          location: selectedLoc,
          productIds,
          paymentMethod,
          paymentStatus: 'PAID'
        };

        const created = await API.placeOrder(orderPayload);
        setConfirmedOrder(created);
        onClearCart();
        setCheckoutStep('confirmation');
        showToast(`Order #${created.id} confirmed!`);

        // Refresh past orders
        if (user && user.email) {
          const ords = await API.fetchOrders({ customerEmail: user.email });
          setPastOrders(ords);
        }
      } catch (err) {
        console.error('Payment/Order failed:', err);
        showToast('Payment processing failed: ' + err.message);
        setCheckoutStep('checkout');
      }
    }, 1400);
  };

  // Profile update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user || !user.id) return;
    try {
      const updated = await API.updateProfile(user.id, profileForm);
      onUpdateUserProfile(updated);
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast('Failed to update profile: ' + err.message);
    }
  };

  return (
    <div className="customer-dashboard">
      {/* Location Selector Bar (Requirement 3.4) */}
      <section className="location-bar-container">
        <div className="location-bar">
          <div className="location-bar-label">
            <span className="pin-icon">📍</span>
            <div>
              <strong>Order Branch:</strong>
              <span className="location-hint">Menu automatically adjusts to branch availability</span>
            </div>
          </div>

          <div className="location-selector-buttons" role="group" aria-label="Select coffee shop location">
            {locations.map(loc => (
              <button
                key={loc.id}
                className={`loc-btn ${selectedLoc === loc.id ? 'active' : ''}`}
                onClick={() => onSelectLoc(loc.id)}
              >
                <span className="loc-name">{loc.id}</span>
                <span className="loc-tag">{loc.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Guest Notice Banner when not logged in */}
      {!user && (
        <div className="guest-menu-banner">
          <div className="guest-banner-content">
            <span className="guest-banner-icon">💡</span>
            <div>
              <strong>Browsing as Guest:</strong> You can view all our artisan coffee, shakes, pastries, and sandwiches. 
              To add items to your cart and place an order, please sign in with your customer account.
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => onOpenAuth('login')}>
            Sign In / Register →
          </button>
        </div>
      )}

      {/* Main Categories Section (Requirement 3.2) */}
      <section className="menu-categories-section">
        <div className="section-title-wrap">
          <h2>Handcrafted Offerings</h2>
          <p>Select a category to explore our freshly brewed and baked selections</p>
        </div>

        <div className="categories-grid">
          {categories.map(cat => (
            <div
              key={cat.id}
              className={`category-card ${activeCategory === cat.id ? 'selected' : ''}`}
              onClick={() => handleSelectCategory(cat.id)}
              role="button"
              tabIndex={0}
            >
              <div className="cat-img-wrap">
                <img src={cat.image} alt={cat.title} className="cat-img" />
                <div className="cat-overlay"></div>
              </div>
              <div className="cat-info">
                <h3 className="cat-title">{cat.title}</h3>
                <p className="cat-subtitle">{cat.subtitle}</p>
                <span className="cat-indicator">
                  {activeCategory === cat.id ? '● Selected' : 'Explore →'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subcategory & Dietary Filter Bar */}
      <section className="subcat-filters-section">
        <div className="subcat-container">
          {/* A. Drinks Subcategories: Coffee vs Tea (Requirement 3.2 A) */}
          {activeCategory === 'Drinks' && (
            <div className="subcat-switch" role="group" aria-label="Drinks subcategory">
              <button
                className={`subcat-pill ${activeSubcategory === 'Coffee' ? 'active' : ''}`}
                onClick={() => setActiveSubcategory('Coffee')}
              >
                ☕ Specialty Coffee
              </button>
              <button
                className={`subcat-pill ${activeSubcategory === 'Tea' ? 'active' : ''}`}
                onClick={() => setActiveSubcategory('Tea')}
              >
                🍵 Botanical &amp; Spiced Tea
              </button>
            </div>
          )}

          {/* C. Sandwiches Filters: Veg / Non-Veg (Requirement 3.2 C) */}
          {activeCategory === 'Sandwiches' && (
            <div className="subcat-switch" role="group" aria-label="Sandwich dietary filter">
              <button
                className={`subcat-pill ${dietaryFilter === 'All' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('All')}
              >
                All Sandwiches
              </button>
              <button
                className={`subcat-pill ${dietaryFilter === 'VEG' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('VEG')}
              >
                🟢 Pure Vegetarian
              </button>
              <button
                className={`subcat-pill ${dietaryFilter === 'NON_VEG' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('NON_VEG')}
              >
                🔴 Non-Vegetarian
              </button>
            </div>
          )}

          {/* D. Pastries Filters: Nut-Free / All (Requirement 3.2 D) */}
          {activeCategory === 'Pastries' && (
            <div className="subcat-switch" role="group" aria-label="Pastry preference filter">
              <button
                className={`subcat-pill ${dietaryFilter === 'All' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('All')}
              >
                All Pastries
              </button>
              <button
                className={`subcat-pill ${dietaryFilter === 'NUT_FREE' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('NUT_FREE')}
              >
                🥜 Nut-Free Only
              </button>
            </div>
          )}

          {/* B. Milkshakes Filters (Requirement 3.2 B) */}
          {activeCategory === 'Milkshakes' && (
            <div className="subcat-switch" role="group" aria-label="Milkshake filter">
              <button
                className={`subcat-pill ${dietaryFilter === 'All' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('All')}
              >
                All Shakes
              </button>
              <button
                className={`subcat-pill ${dietaryFilter === 'NUT_FREE' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('NUT_FREE')}
              >
                Nut-Free Varieties
              </button>
            </div>
          )}

          <div className="branch-status-note">
            Showing items live at: <strong>{selectedLoc}</strong> ({filteredProducts.length} items)
          </div>
        </div>
      </section>

      {/* Product Display Cards (Requirement 3.3) */}
      <section className="products-grid-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Brewing the menu for {selectedLoc}...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-menu-box">
            <span className="empty-icon">☕</span>
            <h3>No items currently available</h3>
            <p>
              Items in this category may be temporarily sold out or disabled by the administrator for the <strong>{selectedLoc}</strong> branch.
            </p>
            <p className="empty-tip">Try selecting another location or category to explore available treats!</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => {
              const qty = getItemQty(product.id);
              const isVeg = product.foodType !== 'NON_VEG';

              return (
                <div key={product.id} className="product-card">
                  <div className="product-img-wrapper">
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80'}
                      alt={product.name}
                      className="product-img"
                      loading="lazy"
                    />
                    <div className="badge-row">
                      <span className={`dietary-badge ${isVeg ? 'veg' : 'non-veg'}`} title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}>
                        {isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                      </span>
                      {product.nutFree && (
                        <span className="allergen-badge nut-free" title="Safe for nut allergies">
                          Nut-Free
                        </span>
                      )}
                      {!product.nutFree && (
                        <span className="allergen-badge contains-nuts" title="Contains tree nuts">
                          Contains Nuts
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="product-details">
                    <div className="product-header">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-price">₹{product.price.toFixed(2)}</div>
                    </div>

                    <p className="product-desc">{product.description || 'Artisanal preparation handcrafted fresh to order.'}</p>

                    <div className="product-card-footer">
                      <div className="stock-status in-stock">
                        <span className="dot"></span> Available at {selectedLoc}
                      </div>

                      {/* Dynamic Quantity Controller directly on card (Requirement 3.3) */}
                      <div className="card-qty-controller">
                        {!user ? (
                          <button
                            className="btn btn-add-initial btn-login-required"
                            onClick={() => {
                              showToast('Please sign in with a customer account to add items to cart.');
                              if (onOpenAuth) onOpenAuth('login');
                            }}
                            aria-label={`Sign in to order ${product.name}`}
                          >
                            🔒 Sign in to Order
                          </button>
                        ) : qty === 0 ? (
                          <button
                            className="btn btn-add-initial"
                            onClick={() => handleIncrement(product.id)}
                            aria-label={`Add ${product.name} to cart`}
                          >
                            + Add to Order
                          </button>
                        ) : (
                          <div className="qty-button-group">
                            <button
                              className="qty-btn btn-minus"
                              onClick={() => handleDecrement(product.id)}
                              aria-label={`Decrease ${product.name} quantity`}
                            >
                              −
                            </button>
                            <span className="qty-display">{qty}</span>
                            <button
                              className="qty-btn btn-plus"
                              onClick={() => handleIncrement(product.id)}
                              aria-label={`Increase ${product.name} quantity`}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Floating Bottom Cart Bar when items are in cart */}
      {user && totalCartCount > 0 && !checkoutStep && (
        <div className="floating-cart-bar">
          <div className="floating-cart-info">
            <span className="floating-cart-badge">{totalCartCount}</span>
            <div>
              <strong>{totalCartCount} item{totalCartCount > 1 ? 's' : ''} in cart</strong>
              <div className="floating-cart-sub">Subtotal: ₹{cartSubtotal.toFixed(2)} + 5% GST</div>
            </div>
          </div>
          <button
            className="btn btn-primary btn-checkout-trigger"
            onClick={() => setCheckoutStep('checkout')}
          >
            Review &amp; Checkout (₹{finalTotal.toFixed(2)}) →
          </button>
        </div>
      )}

      {/* Checkout Modal / Process (Requirement 3.5) */}
      {checkoutStep && (
        <div className="modal-backdrop" onClick={() => checkoutStep !== 'paying' && setCheckoutStep(null)}>
          <div className="checkout-modal-card" onClick={e => e.stopPropagation()}>
            {checkoutStep !== 'paying' && (
              <button
                className="modal-close-btn"
                onClick={() => setCheckoutStep(null)}
                aria-label="Close checkout"
              >
                ×
              </button>
            )}

            {/* Step 1: Review & Payment Options */}
            {checkoutStep === 'checkout' && (
              <div className="checkout-flow">
                <div className="checkout-header">
                  <img src="/logo.jpg" alt="Logo" className="checkout-logo" />
                  <h2>Complete Your Order</h2>
                  <p className="checkout-branch">
                    📍 Pickup Location: <strong>The Coffee Haven ({selectedLoc})</strong>
                  </p>
                </div>

                <div className="checkout-grid">
                  {/* Left: Order Summary */}
                  <div className="order-summary-box">
                    <h3>1. Order Summary</h3>
                    <div className="checkout-items-list">
                      {cartItems.map(item => (
                        <div key={item.productId} className="summary-item-row">
                          <img
                            src={item.product.imageUrl || '/logo.jpg'}
                            alt={item.product.name}
                            className="summary-item-img"
                          />
                          <div className="summary-item-info">
                            <strong>{item.product.name}</strong>
                            <span className="summary-item-calc">
                              ₹{item.product.price.toFixed(2)} × {item.quantity}
                            </span>
                          </div>
                          <div className="summary-item-price">
                            ₹{item.subtotal.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="price-breakdown">
                      <div className="price-row">
                        <span>Items Subtotal:</span>
                        <span>₹{cartSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="price-row">
                        <span>Applicable Taxes (5% GST):</span>
                        <span>₹{taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="price-row total-row">
                        <strong>Total Payable:</strong>
                        <strong className="grand-total">₹{finalTotal.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Right: Customer Details & Payment Options */}
                  <div className="payment-config-box">
                    <h3>2. Customer &amp; Pickup Details</h3>
                    <form onSubmit={handleProceedToPayment}>
                      <div className="form-group">
                        <label>Your Name *</label>
                        <input
                          type="text"
                          value={customerDetails.name}
                          onChange={e => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                          placeholder="e.g. Maya Patel"
                          required
                        />
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Email Address *</label>
                          <input
                            type="email"
                            value={customerDetails.email}
                            onChange={e => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                            placeholder="e.g. maya@example.com"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone Number *</label>
                          <input
                            type="tel"
                            value={customerDetails.phone}
                            onChange={e => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Order Preference</label>
                        <select
                          value={customerDetails.orderType}
                          onChange={e => setCustomerDetails({ ...customerDetails, orderType: e.target.value })}
                        >
                          <option value="Pickup">Express Counter Pickup</option>
                          <option value="Dine-In">Dine-In (Table Service)</option>
                          <option value="Takeaway">Carefully Packaged Takeaway</option>
                        </select>
                      </div>

                      <h3>3. Secure Payment Gateway</h3>
                      <div className="payment-methods-grid">
                        <label className={`pm-card ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="pm"
                            value="UPI"
                            checked={paymentMethod === 'UPI'}
                            onChange={() => setPaymentMethod('UPI')}
                          />
                          <span className="pm-icon">⚡</span>
                          <strong>UPI / QR</strong>
                          <span className="pm-sub">GPay, PhonePe, Paytm</span>
                        </label>

                        <label className={`pm-card ${paymentMethod === 'CARD' ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="pm"
                            value="CARD"
                            checked={paymentMethod === 'CARD'}
                            onChange={() => setPaymentMethod('CARD')}
                          />
                          <span className="pm-icon">💳</span>
                          <strong>Credit / Debit</strong>
                          <span className="pm-sub">Visa, Mastercard, RuPay</span>
                        </label>

                        <label className={`pm-card ${paymentMethod === 'NET_BANKING' ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="pm"
                            value="NET_BANKING"
                            checked={paymentMethod === 'NET_BANKING'}
                            onChange={() => setPaymentMethod('NET_BANKING')}
                          />
                          <span className="pm-icon">🏦</span>
                          <strong>Net Banking</strong>
                          <span className="pm-sub">All Major Banks</span>
                        </label>

                        <label className={`pm-card ${paymentMethod === 'CASH' ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="pm"
                            value="CASH"
                            checked={paymentMethod === 'CASH'}
                            onChange={() => setPaymentMethod('CASH')}
                          />
                          <span className="pm-icon">💵</span>
                          <strong>Pay at Counter</strong>
                          <span className="pm-sub">Cash or Card upon pickup</span>
                        </label>
                      </div>

                      {/* Payment method specific fields */}
                      {paymentMethod === 'UPI' && (
                        <div className="gateway-input-box">
                          <label>Enter UPI VPA / ID (e.g. mobile@upi, username@okaxis)</label>
                          <input
                            type="text"
                            placeholder="yourname@okaxis"
                            value={paymentForm.upiId}
                            onChange={e => setPaymentForm({ ...paymentForm, upiId: e.target.value })}
                          />
                          <span className="gateway-note">🔒 Encrypted via The Haven Secure Payments (Mock Gateway)</span>
                        </div>
                      )}

                      {paymentMethod === 'CARD' && (
                        <div className="gateway-input-box">
                          <div className="form-group">
                            <label>Card Number</label>
                            <input
                              type="text"
                              placeholder="4111 •••• •••• 1234"
                              maxLength="19"
                              value={paymentForm.cardNumber}
                              onChange={e => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                            />
                          </div>
                          <div className="form-row-2">
                            <div className="form-group">
                              <label>Expiry Date</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                maxLength="5"
                                value={paymentForm.cardExpiry}
                                onChange={e => setPaymentForm({ ...paymentForm, cardExpiry: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>CVV</label>
                              <input
                                type="password"
                                placeholder="•••"
                                maxLength="4"
                                value={paymentForm.cardCvv}
                                onChange={e => setPaymentForm({ ...paymentForm, cardCvv: e.target.value })}
                              />
                            </div>
                          </div>
                          <span className="gateway-note">🔒 256-Bit SSL Encrypted. Sensitive credentials are never stored.</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="btn btn-primary btn-block btn-pay-now"
                      >
                        Authorize &amp; Pay ₹{finalTotal.toFixed(2)} →
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Processing Payment Animation */}
            {checkoutStep === 'paying' && (
              <div className="payment-processing-card">
                <div className="processing-spinner"></div>
                <h3>Processing Payment Securely</h3>
                <p>Connecting to The Haven Payment Gateway...</p>
                <div className="gateway-badges">
                  <span>🔒 PCI-DSS Compliant</span>
                  <span>🛡️ 256-bit SSL</span>
                  <span>✓ 3D Secure</span>
                </div>
              </div>
            )}

            {/* Step 3: Order Confirmation & Receipt */}
            {checkoutStep === 'confirmation' && confirmedOrder && (
              <div className="confirmation-card">
                <div className="success-icon-wrap">✓</div>
                <h2>Order Placed Successfully!</h2>
                <p className="conf-tagline">Your artisan brew and freshly baked goods are being prepared.</p>

                <div className="receipt-box">
                  <div className="receipt-header">
                    <div>
                      <span className="receipt-order-id">Order ID: #{confirmedOrder.id}</span>
                      <div className="receipt-loc">📍 Branch: {confirmedOrder.location}</div>
                    </div>
                    <span className="receipt-status-badge">{confirmedOrder.status}</span>
                  </div>

                  <div className="receipt-items">
                    {confirmedOrder.items && confirmedOrder.items.map((it, idx) => (
                      <div key={idx} className="receipt-item-row">
                        <span>{it.quantity}× {it.productName}</span>
                        <span>₹{(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="receipt-total-row">
                    <span>Grand Total:</span>
                    <strong>₹{confirmedOrder.total.toFixed(2)}</strong>
                  </div>

                  <div className="receipt-meta">
                    <span>Payment: {confirmedOrder.paymentMethod || 'UPI'} ({confirmedOrder.paymentStatus || 'PAID'})</span>
                    <span>Placed at: {new Date(confirmedOrder.createdAt || Date.now()).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="conf-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setCheckoutStep(null);
                      setAccountTab('orders');
                    }}
                  >
                    View in Past Orders
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setCheckoutStep(null)}
                  >
                    Continue Browsing Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Account Section Modal (Requirement 3.6) */}
      {accountOpen && (
        <div className="modal-backdrop" onClick={onCloseAccount}>
          <div className="account-modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onCloseAccount} aria-label="Close account">×</button>

            <div className="account-modal-header">
              <img src="/logo.jpg" alt="Logo" className="account-avatar-logo" />
              <div>
                <h2>Customer Account Hub</h2>
                <p>{user ? user.email : 'Patron'}</p>
              </div>
            </div>

            <div className="account-tabs-nav">
              <button
                className={`tab-btn ${accountTab === 'profile' ? 'active' : ''}`}
                onClick={() => setAccountTab('profile')}
              >
                👤 My Profile
              </button>
              <button
                className={`tab-btn ${accountTab === 'cart' ? 'active' : ''}`}
                onClick={() => setAccountTab('cart')}
              >
                🛒 My Cart ({totalCartCount})
              </button>
              <button
                className={`tab-btn ${accountTab === 'orders' ? 'active' : ''}`}
                onClick={() => setAccountTab('orders')}
              >
                📋 Past Orders ({pastOrders.length})
              </button>
            </div>

            <div className="account-tab-body">
              {/* Tab A: My Profile */}
              {accountTab === 'profile' && (
                <div className="profile-tab-content">
                  <h3>Personal Information</h3>
                  <p className="tab-hint">Update your contact information for expedited checkouts and order notifications.</p>

                  <form onSubmit={handleSaveProfile} className="profile-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={user ? user.email : ''}
                        disabled
                        className="input-disabled"
                      />
                      <small className="field-note">Email address cannot be changed.</small>
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="form-group">
                      <label>Account Role</label>
                      <div className="role-pill">Verified Patron ({user ? user.role : 'CUSTOMER'})</div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                      Save Profile Changes
                    </button>
                  </form>
                </div>
              )}

              {/* Tab B: My Cart */}
              {accountTab === 'cart' && (
                <div className="cart-tab-content">
                  <h3>Your Active Cart</h3>
                  {cartItems.length === 0 ? (
                    <div className="empty-cart-state">
                      <p>Your shopping cart is currently empty.</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          onCloseAccount();
                        }}
                      >
                        Explore Menu &amp; Add Items
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="cart-items-table">
                        {cartItems.map(item => (
                          <div key={item.productId} className="cart-item-row">
                            <img
                              src={item.product.imageUrl || '/logo.jpg'}
                              alt={item.product.name}
                              className="cart-thumb"
                            />
                            <div className="cart-item-meta">
                              <h4>{item.product.name}</h4>
                              <span className="unit-price">₹{item.product.price.toFixed(2)} each</span>
                            </div>
                            <div className="cart-qty-ctrl">
                              <button
                                className="qty-btn"
                                onClick={() => handleDecrement(item.productId)}
                              >
                                −
                              </button>
                              <span className="qty-num">{item.quantity}</span>
                              <button
                                className="qty-btn"
                                onClick={() => handleIncrement(item.productId)}
                              >
                                +
                              </button>
                            </div>
                            <div className="cart-row-total">
                              ₹{item.subtotal.toFixed(2)}
                            </div>
                            <button
                              className="cart-remove-btn"
                              onClick={() => onUpdateCart(item.productId, 0)}
                              title="Remove item"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="cart-modal-summary">
                        <div className="modal-price-row">
                          <span>Subtotal:</span>
                          <span>₹{cartSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="modal-price-row">
                          <span>Taxes (5% GST):</span>
                          <span>₹{taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="modal-price-row grand-total-row">
                          <strong>Payable Amount:</strong>
                          <strong>₹{finalTotal.toFixed(2)}</strong>
                        </div>

                        <div className="cart-modal-actions">
                          <button
                            className="btn btn-outline"
                            onClick={() => onClearCart()}
                          >
                            Clear Cart
                          </button>
                          <button
                            className="btn btn-primary btn-checkout"
                            onClick={() => {
                              onCloseAccount();
                              setCheckoutStep('checkout');
                            }}
                          >
                            Proceed to Checkout →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab C: Past Orders */}
              {accountTab === 'orders' && (
                <div className="orders-tab-content">
                  <h3>Order History</h3>
                  <p className="tab-hint">Review your previous orders and check real-time preparation status.</p>

                  {pastOrders.length === 0 ? (
                    <div className="empty-orders-state">
                      <p>You haven't placed any orders yet.</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => onCloseAccount()}
                      >
                        Place Your First Order
                      </button>
                    </div>
                  ) : (
                    <div className="past-orders-list">
                      {pastOrders.map(order => (
                        <div key={order.id} className="order-history-card">
                          <div className="order-history-header">
                            <div>
                              <span className="history-order-id">Order #{order.id}</span>
                              <span className="history-date">
                                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <span className={`status-badge status-${(order.status || 'pending').toLowerCase()}`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="order-history-details">
                            <div className="history-loc">
                              📍 <strong>Location:</strong> {order.location}
                            </div>
                            <div className="history-items-summary">
                              {order.items && order.items.map((it, idx) => (
                                <span key={idx} className="order-item-chip">
                                  {it.quantity}× {it.productName}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="order-history-footer">
                            <span className="history-payment">
                              💳 {order.paymentMethod || 'UPI'} • {order.paymentStatus || 'PAID'}
                            </span>
                            <div className="history-total">
                              Total: <strong>₹{order.total.toFixed(2)}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
