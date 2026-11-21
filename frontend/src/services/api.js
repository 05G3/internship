const BASE_URL = '';

export const API = {
  async fetchProducts() {
    const res = await fetch(`${BASE_URL}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async fetchMenu(location, category, nutFreeOnly) {
    let url = `${BASE_URL}/api/products/menu?location=${encodeURIComponent(location)}`;
    if (category && category !== 'All') url += `&category=${encodeURIComponent(category)}`;
    if (nutFreeOnly) url += `&nutFreeOnly=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch menu');
    return res.json();
  },

  async createProduct(product) {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create product');
    }
    return res.json();
  },

  async updateProduct(id, product) {
    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${BASE_URL}/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  async fetchUsers() {
    const res = await fetch(`${BASE_URL}/api/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async createUser(user) {
    const res = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create user');
    }
    return res.json();
  },

  async deleteUser(id) {
    const res = await fetch(`${BASE_URL}/api/users/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete user');
  },

  async login(email, password) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }
    return data;
  },

  async register(userData) {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    return data;
  },

  async updateProfile(id, profileData) {
    const res = await fetch(`${BASE_URL}/api/auth/profile/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async fetchOrders(params = {}) {
    let url = `${BASE_URL}/api/orders`;
    const query = new URLSearchParams();
    if (params.location && params.location !== 'All') query.set('location', params.location);
    if (params.customerEmail) query.set('customerEmail', params.customerEmail);
    if (params.status && params.status !== 'All') query.set('status', params.status);
    const qs = query.toString();
    if (qs) url += `?${qs}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async placeOrder(orderPayload) {
    // If orderPayload is string customer, location, productIds (legacy support):
    let body;
    if (typeof orderPayload === 'string') {
      const [customer, location, productIds] = arguments;
      body = { customer, location, productIds };
    } else {
      body = orderPayload;
    }

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to place order');
    }
    return res.json();
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${BASE_URL}/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async fetchAvailability() {
    const res = await fetch(`${BASE_URL}/api/availability`);
    if (!res.ok) throw new Error('Failed to fetch availability');
    return res.json();
  },

  async updateAvailability(productId, location, available) {
    const res = await fetch(`${BASE_URL}/api/availability/${productId}/${encodeURIComponent(location)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available })
    });
    if (!res.ok) throw new Error('Failed to update availability');
    return res.json();
  },

  async fetchFeedback() {
    const res = await fetch(`${BASE_URL}/api/feedback`);
    if (!res.ok) throw new Error('Failed to fetch feedback');
    return res.json();
  },

  async submitFeedback(feedback) {
    const res = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback)
    });
    if (!res.ok) throw new Error('Failed to submit feedback');
    return res.json();
  },

  async getNutFreePastries() {
    const res = await fetch(`${BASE_URL}/api/pastries/nut-free`);
    const body = await res.json();
    return { status: res.status, body };
  },

  async getPastryById(id) {
    const res = await fetch(`${BASE_URL}/api/pastries/${id}`);
    const body = await res.json();
    return { status: res.status, body };
  }
};
