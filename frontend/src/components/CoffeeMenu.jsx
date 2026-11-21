import React, { useState } from 'react';
import ApiExplorer from './ApiExplorer';

const LOCATIONS = ['Downtown', 'Airport', 'Campus'];

export default function CoffeeMenu({
  products,
  availability,
  selectedLoc,
  setSelectedLoc,
  onPlaceOrder,
  showToast
}) {
  const [category, setCategory] = useState('All');
  const [nutOnly, setNutOnly] = useState(false);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');

  // Filter products by location availability, category, and nutFree condition
  const availableItems = products.filter(p => {
    const locAvail = availability[p.id];
    if (locAvail && !locAvail[selectedLoc]) return false;
    if (category !== 'All' && p.category.toLowerCase() !== category.toLowerCase()) return false;
    if (nutOnly && p.category === 'Pastry' && !p.nutFree) return false;
    return true;
  });

  const cartProducts = cart.map(id => products.find(p => p.id === id)).filter(Boolean);
  const cartTotal = cartProducts.reduce((sum, p) => sum + p.price, 0);

  const handleAddToCart = (id) => {
    setCart([...cart, id]);
    showToast('Added to your order!');
  };

  const handleRemoveFromCart = (index) => {
    const next = [...cart];
    next.splice(index, 1);
    setCart(next);
  };

  const handleOrderSubmit = async () => {
    if (cart.length === 0) return;
    await onPlaceOrder(customerName, selectedLoc, cart);
    setCart([]);
    setCustomerName('');
  };

  return (
    <div>
      <h2>Pick your coffee &amp; pastries</h2>

      <div className="row">
        <label>
          <strong>Location: </strong>
          <select
            value={selectedLoc}
            onChange={e => {
              setSelectedLoc(e.target.value);
              setCart([]);
            }}
          >
            {LOCATIONS.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Coffee', 'Pastry'].map(c => (
            <button
              key={c}
              className={category === c ? '' : 'ghost'}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="checkbox"
            checked={nutOnly}
            onChange={e => setNutOnly(e.target.checked)}
          />
          <strong>Nut-free pastries only</strong>
        </label>
      </div>

      <div className="grid">
        {availableItems.length > 0 ? (
          availableItems.map(p => (
            <div key={p.id} className="card product-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span className={`tag ${p.category.toLowerCase()}`}>{p.category}</span>
                  {p.category === 'Pastry' && (
                    p.nutFree ? (
                      <span className="tag nut-free">✓ Nut-Free</span>
                    ) : (
                      <span className="tag contains-nuts">⚠️ Nuts</span>
                    )
                  )}
                </div>
                <h3>{p.name}</h3>
                <div className="price">${p.price.toFixed(2)}</div>
                <p style={{ margin: '4px 0' }}><small style={{ color: 'var(--ink-light)' }}>ID #{p.id}</small></p>
              </div>
              <button
                style={{ width: '100%', marginTop: '10px' }}
                onClick={() => handleAddToCart(p.id)}
              >
                Add to order
              </button>
            </div>
          ))
        ) : (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <p>No products available for this selection at {selectedLoc}.</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Your order ({selectedLoc} branch)</h2>
        {cartProducts.length > 0 ? (
          <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '12px' }}>
            {cartProducts.map((p, i) => (
              <div key={`${p.id}-${i}`} className="cart-item">
                <span><strong>{p.name}</strong> ({p.category})</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 700 }}>${p.price.toFixed(2)}</span>
                  <button
                    className="ghost"
                    style={{ padding: '4px 8px' }}
                    onClick={() => handleRemoveFromCart(i)}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--ink-light)', margin: '10px 0' }}>
            Your cart is currently empty. Pick items from the menu above!
          </p>
        )}

        <div className="row" style={{ marginTop: '12px', justifyContent: 'space-between' }}>
          <input
            placeholder="Customer name (e.g. Asha, Alex)"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            style={{ flex: 1, maxWidth: '320px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '1.1rem' }}>
              Total: <strong className="price">${cartTotal.toFixed(2)}</strong>
            </span>
            <button
              disabled={cartProducts.length === 0}
              onClick={handleOrderSubmit}
            >
              Place order
            </button>
          </div>
        </div>
      </div>

      <ApiExplorer />
    </div>
  );
}
