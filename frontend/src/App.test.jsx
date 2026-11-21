import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Navbar from './components/Navbar';

describe('Navbar Component', () => {
  it('renders Home, brand name, and auth buttons when user is NOT logged in', () => {
    const handleNavigate = vi.fn();
    render(
      <Navbar
        currentView="home"
        onNavigate={handleNavigate}
        user={null}
        onOpenAuth={vi.fn()}
        onLogout={vi.fn()}
        theme="dark"
        onToggleTheme={vi.fn()}
        cartCount={0}
        onOpenCart={vi.fn()}
        onOpenAccount={vi.fn()}
      />
    );

    expect(screen.getByText(/The Coffee Haven/i)).toBeDefined();
    expect(screen.getByText(/BREW • BITE • RELAX/i)).toBeDefined();
    // Home button should be visible when logged out
    expect(screen.getByText(/^Home$/i)).toBeDefined();
    expect(screen.getByText(/Login/i)).toBeDefined();
    expect(screen.getByText(/Sign Up/i)).toBeDefined();
  });

  it('HIDES Home button and renders customer account when customer is logged in', () => {
    const customerUser = { id: 1, name: 'Rohan Sharma', email: 'rohan@example.com', role: 'CUSTOMER' };
    render(
      <Navbar
        currentView="menu"
        onNavigate={vi.fn()}
        user={customerUser}
        onOpenAuth={vi.fn()}
        onLogout={vi.fn()}
        theme="dark"
        onToggleTheme={vi.fn()}
        cartCount={2}
        onOpenCart={vi.fn()}
        onOpenAccount={vi.fn()}
      />
    );

    expect(screen.getByText(/Rohan/i)).toBeDefined();
    expect(screen.getByText(/Logout/i)).toBeDefined();
    // Home button MUST NOT be visible when customer is logged in
    expect(screen.queryByText(/^Home$/i)).toBeNull();
    expect(screen.queryByText(/Sign Up/i)).toBeNull();
  });

  it('HIDES Home button and renders admin badge when admin is logged in', () => {
    const adminUser = { id: 99, name: 'Haven Admin', email: 'admin@thecoffeehaven.com', role: 'ADMIN' };
    render(
      <Navbar
        currentView="admin"
        onNavigate={vi.fn()}
        user={adminUser}
        onOpenAuth={vi.fn()}
        onLogout={vi.fn()}
        theme="dark"
        onToggleTheme={vi.fn()}
        cartCount={0}
        onOpenCart={vi.fn()}
        onOpenAccount={vi.fn()}
      />
    );

    expect(screen.getByText(/Admin Dashboard/i)).toBeDefined();
    expect(screen.getByText(/Logout/i)).toBeDefined();
    // Home button MUST NOT be visible when admin is logged in
    expect(screen.queryByText(/^Home$/i)).toBeNull();
  });
});
