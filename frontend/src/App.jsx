import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';

export default function App() {
  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('the_haven_theme') || 'dark';
  });

  // User auth state: { id, name, email, phone, role }
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('the_haven_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation view: 'home' | 'menu' | 'admin'
  const [currentView, setCurrentView] = useState(() => {
    try {
      const saved = localStorage.getItem('the_haven_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'ADMIN') return 'admin';
        return 'menu';
      }
    } catch {
      // fallback
    }
    return 'home';
  });

  // Selected shop location: 'Hyderabad' | 'Vijayawada' | 'Rajahmundry'
  const [selectedLoc, setSelectedLoc] = useState(() => {
    return localStorage.getItem('the_haven_location') || 'Hyderabad';
  });

  // Cart state: { [productId]: quantity }
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('the_haven_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sync theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('the_haven_theme', theme);
  }, [theme]);

  // Sync user to storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('the_haven_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('the_haven_user');
    }
  }, [user]);

  // Sync location to storage
  useEffect(() => {
    localStorage.setItem('the_haven_location', selectedLoc);
  }, [selectedLoc]);

  // Sync cart to storage
  useEffect(() => {
    localStorage.setItem('the_haven_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavigate = (view) => {
    // If logged in, Home page cannot be accessed until logged out
    if (view === 'home' && user) {
      if (user.role === 'ADMIN') {
        setCurrentView('admin');
      } else {
        setCurrentView('menu');
      }
      return;
    }
    if (view === 'admin' && (!user || user.role !== 'ADMIN')) {
      showToast('Restricted: Admin access only. Please sign in as Administrator.');
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    showToast(`Welcome, ${authenticatedUser.name}!`);

    // Role-based redirection (Requirement 2):
    if (authenticatedUser.role === 'ADMIN') {
      setCurrentView('admin');
    } else {
      setCurrentView('menu');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    setCart({});
    showToast('You have been logged out.');
  };

  const handleUpdateCart = (productId, quantity) => {
    setCart(prev => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  const handleUpdateUserProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  const totalCartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  return (
    <div className={`haven-app-root theme-${theme}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="haven-toast-banner" role="status">
          <span className="toast-sparkle">✦</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar (Requirement 1, 3.1, 4) */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        cartCount={totalCartCount}
        onOpenCart={() => setAccountModalOpen(true)}
        onOpenAccount={() => setAccountModalOpen(true)}
      />

      {/* Main Views */}
      <main className="haven-main-content">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectLocation={(locId) => setSelectedLoc(locId)}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'menu' && (
          <CustomerDashboard
            user={user}
            selectedLoc={selectedLoc}
            onSelectLoc={(locId) => setSelectedLoc(locId)}
            cart={cart}
            onUpdateCart={handleUpdateCart}
            onClearCart={handleClearCart}
            accountOpen={accountModalOpen}
            onCloseAccount={() => setAccountModalOpen(false)}
            onUpdateUserProfile={handleUpdateUserProfile}
            onOpenAuth={handleOpenAuth}
            showToast={showToast}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard showToast={showToast} />
        )}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Common Footer (Requirement 1 & 5) */}
      <Footer onNavigate={handleNavigate} user={user} />
    </div>
  );
}
