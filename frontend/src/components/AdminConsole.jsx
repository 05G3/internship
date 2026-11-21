import React, { useState } from 'react';

const LOCATIONS = ['Downtown', 'Airport', 'Campus'];

export default function AdminConsole({
  users,
  products,
  availability,
  orders,
  onAddUser,
  onDeleteUser,
  onUpdateProduct,
  onUpdateAvailability,
  onUpdateOrderStatus,
  showToast
}) {
  const [subTab, setSubTab] = useState('users');

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('STAFF');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.includes('@')) {
      showToast('Please enter a valid name and email address');
      return;
    }
    await onAddUser({ name: newName.trim(), email: newEmail.trim(), role: newRole });
    setNewName('');
    setNewEmail('');
  };

  return (
    <div>
      <h2>Admin Console</h2>

      <div className="sub">
        {[
          ['users', 'User Management'],
          ['products', 'Product Management'],
          ['avail', 'Product Availability by Location'],
          ['orders', 'Order Management']
        ].map(([key, label]) => (
          <button
            key={key}
            className={subTab === key ? 'on' : ''}
            onClick={() => setSubTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card">
        {/* USERS TAB */}
        {subTab === 'users' && (
          <div>
            <form onSubmit={handleCreateUser} className="row" style={{ background: 'var(--or-light)', padding: '12px', borderRadius: '12px' }}>
              <strong style={{ marginRight: '6px' }}>Add New User:</strong>
              <input
                placeholder="Full Name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                style={{ flex: 1, minWidth: '140px' }}
              />
              <input
                placeholder="email@brew.co"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                style={{ flex: 1, minWidth: '180px' }}
              />
              <select value={newRole} onChange={e => setNewRole(e.target.value)}>
                <option value="STAFF">STAFF</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <button type="submit">+ Add User</button>
            </form>

            <div className="wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td><strong>#{u.id}</strong></td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className="tag">{u.role}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="ghost"
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '4px 10px' }}
                          onClick={() => onDeleteUser(u.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {subTab === 'products' && (
          <div>
            <p style={{ margin: '4px 0 10px', fontSize: '0.85rem', color: 'var(--ink-light)' }}>
              Edit products inline. Changes are persisted immediately to SQLite via Spring Data JPA:
            </p>
            <div className="wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price ($)</th>
                    <th>Nut-Free</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td><strong>#{p.id}</strong></td>
                      <td>
                        <input
                          value={p.name}
                          onChange={e => onUpdateProduct(p.id, { ...p, name: e.target.value })}
                          style={{ width: '100%', minWidth: '150px' }}
                        />
                      </td>
                      <td><span className={`tag ${p.category.toLowerCase()}`}>{p.category}</span></td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          value={p.price}
                          onChange={e => onUpdateProduct(p.id, { ...p, price: Math.max(0, parseFloat(e.target.value) || 0) })}
                          style={{ width: '100px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={p.nutFree}
                          onChange={e => onUpdateProduct(p.id, { ...p, nutFree: e.target.checked })}
                          style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AVAILABILITY TAB */}
        {subTab === 'avail' && (
          <div>
            <p style={{ margin: '4px 0 10px', fontSize: '0.85rem', color: 'var(--ink-light)' }}>
              Toggle location availability across Downtown, Airport, and Campus branches:
            </p>
            <div className="wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    {LOCATIONS.map(l => (
                      <th key={l} style={{ textAlign: 'center' }}>{l}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.name}</strong> <small style={{ color: 'var(--ink-light)' }}>({p.category})</small>
                      </td>
                      {LOCATIONS.map(loc => {
                        const isAvail = availability[p.id] && availability[p.id][loc];
                        return (
                          <td key={loc} style={{ textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={!!isAvail}
                              onChange={e => onUpdateAvailability(p.id, loc, e.target.checked)}
                              style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {subTab === 'orders' && (
          <div>
            <div className="wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Location</th>
                    <th>Items Ordered</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map(o => (
                      <tr key={o.id}>
                        <td><strong>#{o.id}</strong></td>
                        <td>{o.customer}</td>
                        <td>{o.location}</td>
                        <td>{(o.items || []).map(i => i.productName || i).join(', ') || '—'}</td>
                        <td><strong className="price" style={{ fontSize: '1.05rem' }}>${o.total.toFixed(2)}</strong></td>
                        <td>
                          <select
                            value={o.status}
                            className={`status-pill status-${o.status}`}
                            onChange={e => onUpdateOrderStatus(o.id, e.target.value)}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>No orders recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
