import React, { useState, useEffect, useMemo } from 'react';
import { API } from '../services/api';

export default function AdminDashboard({ showToast }) {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'availability' | 'orders'

  // Data states
  const [products, setProducts] = useState([]);
  const [availability, setAvailability] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Location availability selector (Requirement 4.2)
  const [selectedAdminLoc, setSelectedAdminLoc] = useState('Hyderabad');
  const locations = ['Hyderabad', 'Vijayawada', 'Rajahmundry'];

  // Orders filters (Requirement 4.3)
  const [orderLocFilter, setOrderLocFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderDateFilter, setOrderDateFilter] = useState('');

  // Product modal (Add / Edit)
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding new
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Drinks',
    subcategory: 'Coffee',
    description: '',
    price: '',
    foodType: 'VEG',
    nutFree: true,
    imageUrl: '',
    available: true
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, avails, ords] = await Promise.all([
        API.fetchProducts(),
        API.fetchAvailability(),
        API.fetchOrders()
      ]);
      setProducts(prods);
      setAvailability(avails);
      setOrders(ords);
    } catch (err) {
      console.error('Error loading admin data:', err);
      showToast('Error syncing with server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Menu Management Handlers (4.1) ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Drinks',
      subcategory: 'Coffee',
      description: '',
      price: '',
      foodType: 'VEG',
      nutFree: true,
      imageUrl: '',
      available: true
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      subcategory: prod.subcategory || '',
      description: prod.description || '',
      price: prod.price,
      foodType: prod.foodType || 'VEG',
      nutFree: prod.nutFree !== false,
      imageUrl: prod.imageUrl || '',
      available: prod.available !== false
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price)
      };

      if (editingProduct) {
        await API.updateProduct(editingProduct.id, payload);
        showToast(`Updated "${payload.name}" successfully!`);
      } else {
        await API.createProduct(payload);
        showToast(`Added new item "${payload.name}"!`);
      }

      setProductModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to save item: ' + err.message);
    }
  };

  const handleDeleteProduct = async (prodId, prodName) => {
    if (!window.confirm(`Are you sure you want to remove "${prodName}" from the menu?`)) {
      return;
    }
    try {
      await API.deleteProduct(prodId);
      showToast(`Removed "${prodName}" from catalog.`);
      loadData();
    } catch (err) {
      showToast('Failed to delete product: ' + err.message);
    }
  };

  // --- Location Availability Handlers (4.2) ---
  const handleToggleLocationAvailability = async (productId, location, currentVal) => {
    const newVal = !currentVal;
    try {
      // Optimistic local update
      setAvailability(prev => ({
        ...prev,
        [productId]: {
          ...(prev[productId] || {}),
          [location]: newVal
        }
      }));

      await API.updateAvailability(productId, location, newVal);
      showToast(`Item ${newVal ? 'Enabled' : 'Disabled'} for ${location}`);
    } catch (err) {
      showToast('Failed to update availability: ' + err.message);
      loadData();
    }
  };

  // --- Order Management Handlers (4.3) ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await API.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`Order #${orderId} marked as ${newStatus}`);
    } catch (err) {
      showToast('Failed to update status: ' + err.message);
    }
  };

  // Filtered orders computation
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Location filter
      if (orderLocFilter !== 'All' && order.location.toLowerCase() !== orderLocFilter.toLowerCase()) {
        return false;
      }
      // Status filter
      if (orderStatusFilter !== 'All') {
        const norm = orderStatusFilter.toUpperCase().replace(' ', '_');
        if (order.status.toUpperCase() !== norm && order.status.toUpperCase() !== orderStatusFilter.toUpperCase()) {
          return false;
        }
      }
      // Date filter
      if (orderDateFilter) {
        const orderDateStr = new Date(order.createdAt).toISOString().split('T')[0];
        if (orderDateStr !== orderDateFilter) return false;
      }
      // Search filter (Order ID or customer name/phone/email)
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchesId = String(order.id).includes(q);
        const matchesName = order.customer && order.customer.toLowerCase().includes(q);
        const matchesEmail = order.customerEmail && order.customerEmail.toLowerCase().includes(q);
        const matchesPhone = order.customerPhone && order.customerPhone.includes(q);
        if (!matchesId && !matchesName && !matchesEmail && !matchesPhone) return false;
      }
      return true;
    });
  }, [orders, orderLocFilter, orderStatusFilter, orderDateFilter, orderSearch]);

  const orderStatuses = [
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'COMPLETED',
    'CANCELLED'
  ];

  return (
    <div className="admin-dashboard-container">
      {/* Admin Subheader & Tab Navigation */}
      <div className="admin-header-panel">
        <div className="admin-title-wrap">
          <img src="/logo.jpg" alt="Logo" className="admin-header-logo" />
          <div>
            <h2>Centralized Administrative Console</h2>
            <p className="admin-portal-sub">The Coffee Haven • Multi-Branch Operations &amp; Inventory Control</p>
          </div>
        </div>

        <div className="admin-tabs-nav" role="tablist">
          <button
            className={`admin-tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            📋 4.1 Menu Management
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            📍 4.2 Branch Availability
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 4.3 Order Management ({orders.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading operational records...</p>
        </div>
      ) : (
        <div className="admin-content-area">
          {/* ========================================================= */}
          {/* 4.1 Menu Management */}
          {/* ========================================================= */}
          {activeTab === 'menu' && (
            <div className="admin-section menu-management-section">
              <div className="section-toolbar">
                <div>
                  <h3>Master Menu Catalog</h3>
                  <p className="toolbar-hint">
                    Add, edit, or remove menu items. Changes reflect across customer dashboards based on branch availability.
                  </p>
                </div>
                <button
                  className="btn btn-primary btn-add-item"
                  onClick={handleOpenAddProduct}
                >
                  + Add New Menu Item
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Item Name</th>
                      <th>Category &amp; Subcat</th>
                      <th>Food Type</th>
                      <th>Allergens</th>
                      <th>Price</th>
                      <th>Overall Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={p.imageUrl || '/logo.jpg'}
                            alt={p.name}
                            className="admin-table-thumb"
                          />
                        </td>
                        <td>
                          <strong>{p.name}</strong>
                          <div className="table-subtext">{p.description}</div>
                        </td>
                        <td>
                          <span className="badge category-badge">{p.category}</span>
                          {p.subcategory && (
                            <span className="badge subcategory-badge">{p.subcategory}</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${p.foodType === 'NON_VEG' ? 'badge-nonveg' : 'badge-veg'}`}>
                            {p.foodType === 'NON_VEG' ? '🔴 Non-Veg' : '🟢 Veg'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${p.nutFree ? 'badge-nutfree' : 'badge-nuts'}`}>
                            {p.nutFree ? 'Nut-Free' : 'Contains Nuts'}
                          </span>
                        </td>
                        <td>
                          <strong className="table-price">₹{p.price.toFixed(2)}</strong>
                        </td>
                        <td>
                          <span className={`status-pill ${p.available !== false ? 'pill-active' : 'pill-inactive'}`}>
                            {p.available !== false ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td>
                          <div className="table-action-btns">
                            <button
                              className="btn btn-sm btn-edit"
                              onClick={() => handleOpenEditProduct(p)}
                              title="Edit item"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn-sm btn-delete"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              title="Delete item"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4.2 Location-Based Item Availability */}
          {/* ========================================================= */}
          {activeTab === 'availability' && (
            <div className="admin-section availability-section">
              <div className="section-toolbar">
                <div>
                  <h3>Location-Specific Menu Availability</h3>
                  <p className="toolbar-hint">
                    Control product visibility individually per branch. When disabled for a location, the item immediately vanishes from customer menus at that branch without affecting other branches.
                  </p>
                </div>

                <div className="loc-selector-pill-group">
                  <span className="selector-label">Select Branch:</span>
                  {locations.map(loc => (
                    <button
                      key={loc}
                      className={`admin-loc-pill ${selectedAdminLoc === loc ? 'active' : ''}`}
                      onClick={() => setSelectedAdminLoc(loc)}
                    >
                      📍 {loc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="availability-summary-banner">
                <span>Currently configuring availability for: <strong>{selectedAdminLoc}</strong></span>
                <span className="banner-tip">💡 Tip: Toggling a switch saves immediately and syncs with customer ordering.</span>
              </div>

              <div className="admin-table-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status at {selectedAdminLoc}</th>
                      <th>Availability Toggle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => {
                      const locMap = availability[p.id] || {};
                      // If undefined in map, defaults to true or product's available state
                      const isEnabled = locMap[selectedAdminLoc] !== false;

                      return (
                        <tr key={p.id} className={isEnabled ? '' : 'row-disabled'}>
                          <td>
                            <div className="prod-cell">
                              <img
                                src={p.imageUrl || '/logo.jpg'}
                                alt={p.name}
                                className="admin-table-thumb"
                              />
                              <div>
                                <strong>{p.name}</strong>
                                <span className="table-subtext">{p.foodType === 'NON_VEG' ? '🔴 Non-Veg' : '🟢 Veg'}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge category-badge">{p.category}</span>
                          </td>
                          <td>₹{p.price.toFixed(2)}</td>
                          <td>
                            <span className={`status-pill ${isEnabled ? 'pill-enabled' : 'pill-disabled'}`}>
                              {isEnabled ? '● Visible to Customers' : '○ Hidden from Customers'}
                            </span>
                          </td>
                          <td>
                            <label className="switch-toggle" aria-label={`Toggle ${p.name} for ${selectedAdminLoc}`}>
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={() => handleToggleLocationAvailability(p.id, selectedAdminLoc, isEnabled)}
                              />
                              <span className="slider round"></span>
                              <span className="toggle-text-status">
                                {isEnabled ? 'Enabled' : 'Disabled'}
                              </span>
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4.3 Order Management */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="admin-section orders-management-section">
              <div className="section-toolbar">
                <div>
                  <h3>Customer Order Operations</h3>
                  <p className="toolbar-hint">
                    Monitor incoming orders, filter by branch location, search customer details, and track prep lifecycle.
                  </p>
                </div>
              </div>

              {/* Filters toolbar (Requirement 4.3) */}
              <div className="orders-filter-bar">
                <div className="filter-item search-filter">
                  <label>🔍 Search Orders</label>
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer name, email, or phone..."
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                  />
                </div>

                <div className="filter-item">
                  <label>📍 Shop Location</label>
                  <select
                    value={orderLocFilter}
                    onChange={e => setOrderLocFilter(e.target.value)}
                  >
                    <option value="All">All Locations</option>
                    {locations.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-item">
                  <label>📊 Order Status</label>
                  <select
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    {orderStatuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-item">
                  <label>📅 Filter by Date</label>
                  <input
                    type="date"
                    value={orderDateFilter}
                    onChange={e => setOrderDateFilter(e.target.value)}
                  />
                </div>

                {(orderSearch || orderLocFilter !== 'All' || orderStatusFilter !== 'All' || orderDateFilter) && (
                  <button
                    className="btn btn-outline btn-clear-filters"
                    onClick={() => {
                      setOrderSearch('');
                      setOrderLocFilter('All');
                      setOrderStatusFilter('All');
                      setOrderDateFilter('');
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="orders-count-banner">
                Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> total orders
              </div>

              {/* Orders Table */}
              <div className="admin-table-container">
                {filteredOrders.length === 0 ? (
                  <div className="empty-orders-view">
                    <p>No orders match the selected search criteria or filters.</p>
                  </div>
                ) : (
                  <table className="admin-data-table orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer Details</th>
                        <th>Branch</th>
                        <th>Ordered Items &amp; Qty</th>
                        <th>Total &amp; Payment</th>
                        <th>Date &amp; Time</th>
                        <th>Live Status</th>
                        <th>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => (
                        <tr key={order.id}>
                          <td>
                            <strong className="order-num">#{order.id}</strong>
                          </td>
                          <td>
                            <strong>{order.customer}</strong>
                            {order.customerPhone && (
                              <div className="table-subtext">📞 {order.customerPhone}</div>
                            )}
                            {order.customerEmail && (
                              <div className="table-subtext">✉️ {order.customerEmail}</div>
                            )}
                          </td>
                          <td>
                            <span className="location-pill">📍 {order.location}</span>
                          </td>
                          <td>
                            <div className="order-items-breakdown">
                              {order.items && order.items.map((item, idx) => (
                                <div key={idx} className="item-line">
                                  <strong>{item.quantity}×</strong> {item.productName}
                                  <span className="item-price-tag">(₹{(item.price * item.quantity).toFixed(2)})</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="total-cell">
                              <strong>₹{order.total.toFixed(2)}</strong>
                              <span className="payment-pill">
                                {order.paymentMethod || 'UPI'} • {order.paymentStatus || 'PAID'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="table-datetime">
                              {new Date(order.createdAt).toLocaleDateString()}
                              <br />
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge status-${(order.status || 'pending').toLowerCase()}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <select
                              className="status-selector-dropdown"
                              value={order.status}
                              onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                            >
                              {orderStatuses.map(st => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Product Modal (Requirement 4.1) */}
      {productModalOpen && (
        <div className="modal-backdrop" onClick={() => setProductModalOpen(false)}>
          <div className="product-form-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setProductModalOpen(false)}>×</button>

            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Menu Product' : 'Add New Menu Product'}</h3>
              <p>Configure product attributes, categories, and pricing.</p>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-product-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vanilla Bean Iced Latte"
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="e.g. 240.00"
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Primary Category *</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="Drinks">Drinks</option>
                    <option value="Milkshakes">Milkshakes</option>
                    <option value="Sandwiches">Sandwiches</option>
                    <option value="Pastries">Pastries</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Subcategory (e.g. Coffee, Tea, Panini)</label>
                  <input
                    type="text"
                    placeholder="e.g. Coffee, Tea, Fruit, Croissant"
                    value={productForm.subcategory}
                    onChange={e => setProductForm({ ...productForm, subcategory: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Food Type</label>
                  <select
                    value={productForm.foodType}
                    onChange={e => setProductForm({ ...productForm, foodType: e.target.value })}
                  >
                    <option value="VEG">🟢 Vegetarian</option>
                    <option value="NON_VEG">🔴 Non-Vegetarian</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Nut-Free Indicator</label>
                  <select
                    value={productForm.nutFree ? 'true' : 'false'}
                    onChange={e => setProductForm({ ...productForm, nutFree: e.target.value === 'true' })}
                  >
                    <option value="true">Nut-Free (Safe)</option>
                    <option value="false">Contains Nuts</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Overall Active</label>
                  <select
                    value={productForm.available ? 'true' : 'false'}
                    onChange={e => setProductForm({ ...productForm, available: e.target.value === 'true' })}
                  >
                    <option value="true">Active in Catalog</option>
                    <option value="false">Globally Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Product Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.imageUrl}
                  onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Short Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe tasting notes, ingredients, or artisan preparation..."
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingProduct ? 'Save Changes' : 'Create Menu Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
