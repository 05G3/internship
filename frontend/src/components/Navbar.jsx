import React from 'react';

export default function Navbar({
  currentView,
  onNavigate,
  user,
  onOpenAuth,
  onLogout,
  theme,
  onToggleTheme,
  cartCount,
  onOpenCart,
  onOpenAccount
}) {
  const handleBrandClick = () => {
    if (!user) {
      onNavigate('home');
    } else if (user.role === 'ADMIN') {
      onNavigate('admin');
    } else {
      onNavigate('menu');
    }
  };

  return (
    <header className="haven-navbar">
      <div className="navbar-brand" onClick={handleBrandClick} role="button" tabIndex={0}>
        <img src="/logo.jpg" alt="The Coffee Haven Logo" className="brand-logo" />
        <div className="brand-text">
          <h1 className="brand-title">The Coffee Haven</h1>
          <span className="brand-tagline">BREW • BITE • RELAX</span>
        </div>
      </div>

      <nav className="navbar-links">
        {/* Home button is ONLY visible when NOT logged in */}
        {!user && (
          <button
            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
        )}

        {(!user || user.role === 'CUSTOMER') && (
          <button
            className={`nav-link ${currentView === 'menu' ? 'active' : ''}`}
            onClick={() => onNavigate('menu')}
          >
            ☕ Our Menu
          </button>
        )}

        {user && user.role === 'ADMIN' && (
          <button
            className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            ⚙️ Admin Dashboard
          </button>
        )}
      </nav>

      <div className="navbar-actions">
        {/* Dark/Light mode toggle */}
        <button
          className="btn-theme-toggle"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle dark/light theme"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        {/* When not logged in */}
        {!user && (
          <div className="auth-buttons">
            <button
              className="btn btn-outline"
              onClick={() => onOpenAuth('login')}
            >
              Login
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onOpenAuth('signup')}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* When customer is logged in */}
        {user && user.role === 'CUSTOMER' && (
          <div className="customer-actions">
            <button
              className="btn btn-cart"
              onClick={onOpenCart}
              title="View Cart"
            >
              🛒 <span className="cart-label">Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            <button
              className="btn btn-account"
              onClick={onOpenAccount}
              title="My Account"
            >
              👤 <span className="user-name">{user.name ? user.name.split(' ')[0] : 'Account'}</span>
            </button>

            <button
              className="btn btn-logout"
              onClick={onLogout}
              title="Log out"
            >
              Logout
            </button>
          </div>
        )}

        {/* When admin is logged in */}
        {user && user.role === 'ADMIN' && (
          <div className="admin-actions">
            <span className="admin-badge">Admin: {user.name}</span>
            <button
              className="btn btn-logout"
              onClick={onLogout}
              title="Log out"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
