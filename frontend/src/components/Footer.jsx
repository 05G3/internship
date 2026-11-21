import React from 'react';

export default function Footer({ onNavigate, user }) {
  return (
    <footer className="haven-footer">
      <div className="footer-top">
        <div className="footer-column brand-column">
          <div className="footer-brand">
            <img src="/logo.jpg" alt="The Coffee Haven" className="footer-logo" />
            <div>
              <h3>The Coffee Haven</h3>
              <p className="tagline">BREW • BITE • RELAX</p>
            </div>
          </div>
          <p className="footer-desc">
            A sanctuary where artisanal coffee craftsmanship meets peaceful moments. 
            From single-origin beans roasted to perfection to freshly baked Viennoiserie, 
            every visit is an escape to warmth and serenity.
          </p>
          <div className="social-links">
            <a href="#instagram" aria-label="Instagram" className="social-icon">📷 Instagram</a>
            <a href="#facebook" aria-label="Facebook" className="social-icon">📘 Facebook</a>
            <a href="#twitter" aria-label="X / Twitter" className="social-icon">✖️ Twitter</a>
            <a href="#linkedin" aria-label="LinkedIn" className="social-icon">💼 LinkedIn</a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            {!user && (
              <li><button onClick={() => onNavigate('home')}>Home Page</button></li>
            )}
            {(!user || user.role === 'CUSTOMER') && (
              <li><button onClick={() => onNavigate('menu')}>Our Artisan Menu</button></li>
            )}
            {user && user.role === 'ADMIN' && (
              <li><button onClick={() => onNavigate('admin')}>Admin Dashboard</button></li>
            )}
            <li><a href="#locations">Our Branches</a></li>
            <li><a href="#feedback">Customer Feedback</a></li>
            <li><a href="/swagger-ui.html" target="_blank" rel="noreferrer">OpenAPI / Swagger</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Our Locations</h4>
          <ul className="footer-locations">
            <li>
              <strong>Hyderabad (Jubilee Hills)</strong>
              <p>Plot 42, Road No. 36 • 7:00 AM - 11:30 PM</p>
            </li>
            <li>
              <strong>Vijayawada (MG Road)</strong>
              <p>Opp. Trendset Mall • 7:30 AM - 11:00 PM</p>
            </li>
            <li>
              <strong>Rajahmundry (Riverfront)</strong>
              <p>Near Godavari Ghat • 7:00 AM - 10:30 PM</p>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Contact &amp; Inquiries</h4>
          <p><strong>Hotline:</strong> +91 40 2355 8899</p>
          <p><strong>Email:</strong> contact@thecoffeehaven.com</p>
          <p><strong>Catering:</strong> events@thecoffeehaven.com</p>
          <p><strong>Hours:</strong> Open 7 Days a week</p>
          <div className="trust-badge">
            ☕ 100% Arabica Specialty Roasts
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} The Coffee Haven. All rights reserved. Handcrafted with passion.</p>
        <div className="footer-legal">
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Terms of Service</span>
          <span>•</span>
          <span>FSSAI Certified</span>
        </div>
      </div>
    </footer>
  );
}
