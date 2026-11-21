import React, { useState, useEffect } from 'react';
import { API } from '../services/api';

export default function HomePage({ onNavigate, onSelectLocation, onOpenAuth }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  const locations = [
    {
      id: 'Hyderabad',
      name: 'The Coffee Haven — Jubilee Hills, Hyderabad',
      city: 'Hyderabad',
      address: 'Plot 42, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
      contact: '+91 40 2355 8899',
      email: 'hyd@thecoffeehaven.com',
      hours: '7:00 AM – 11:30 PM (Mon - Sun)',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      description: 'Our flagship architectural glasshouse featuring lush indoor botanical gardens, private booth seating, and a pour-over brew bar.'
    },
    {
      id: 'Vijayawada',
      name: 'The Coffee Haven — MG Road, Vijayawada',
      city: 'Vijayawada',
      address: 'Trendset Tower, MG Road, Governor Peta, Vijayawada, Andhra Pradesh 520010',
      contact: '+91 866 248 1122',
      email: 'vja@thecoffeehaven.com',
      hours: '7:30 AM – 11:00 PM (Mon - Sun)',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      description: 'A cozy sanctuary with warm acoustic brick arches, community tables, artisanal milkshakes, and specialty espresso flights.'
    },
    {
      id: 'Rajahmundry',
      name: 'The Coffee Haven — Riverfront, Rajahmundry',
      city: 'Rajahmundry',
      address: '18-4-2 Riverview Boulevard, Near Godavari Pushkar Ghat, Rajahmundry, Andhra Pradesh 533101',
      contact: '+91 883 244 5566',
      email: 'rjy@thecoffeehaven.com',
      hours: '7:00 AM – 10:30 PM (Mon - Sun)',
      image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
      description: 'Breathtaking open-air riverside deck overlooking the serene Godavari, where crisp morning breezes meet warm cinnamon rolls.'
    }
  ];

  const loadFeedbacks = async () => {
    try {
      const data = await API.fetchFeedback();
      setFeedbacks(data);
    } catch (err) {
      console.warn('Could not load feedbacks:', err);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackError('');
    setFeedbackSuccess('');
    setSubmitting(true);

    try {
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        throw new Error('Please fill in all feedback fields.');
      }

      await API.submitFeedback({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        rating: Number(formData.rating)
      });

      setFeedbackSuccess('Thank you for sharing your experience! Your feedback has been recorded.');
      setFormData({ name: '', email: '', message: '', rating: 5 });
      loadFeedbacks();
    } catch (err) {
      setFeedbackError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOrderFromLocation = (locId) => {
    onSelectLocation(locId);
    onNavigate('menu');
  };

  return (
    <div className="haven-home-page">
      {/* Hero / Introduction Section */}
      <section className="haven-hero">
        <div className="hero-backdrop-glow"></div>
        <div className="hero-container">
          <div className="hero-brand-badge">
            <span className="sparkle">✦</span>
            <span>Artisanal Coffee &amp; Bakery Experience</span>
            <span className="sparkle">✦</span>
          </div>

          <div className="hero-logo-wrapper">
            <img src="/logo.jpg" alt="The Coffee Haven Logo" className="hero-logo-img" />
          </div>

          <h1 className="hero-title">The Coffee Haven</h1>
          <p className="hero-tagline">BREW • BITE • RELAX</p>

          <p className="hero-story">
            Founded with a passion for exceptional roasts and unhurried hospitality, 
            <strong> The Coffee Haven</strong> brings together shade-grown high-altitude 
            Arabica beans, delicate floral teas, rich handcrafted milkshakes, and 
            Viennese-style flaky pastries. Inspired by the quiet beauty of moonlit blooms 
            and tranquil mountain dawns, every corner of our haven invites you to slow down, 
            savor each sip, and feel truly at home.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn btn-hero-primary"
              onClick={() => onNavigate('menu')}
            >
              ☕ Explore Our Menu &amp; Order
            </button>
            <a href="#locations" className="btn btn-hero-secondary">
              📍 Find Our Locations
            </a>
            <button
              className="btn btn-hero-outline"
              onClick={() => onOpenAuth('signup')}
            >
              ✨ Create Customer Account
            </button>
          </div>

          {/* Value pillars */}
          <div className="hero-features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>100% Specialty Arabica</h3>
              <p>Ethically direct-trade sourced from micro-lot farms and roasted to showcase notes of chocolate, caramel, and floral citrus.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🥐</div>
              <h3>Handcrafted Patisserie</h3>
              <p>Freshly baked each morning: European layered butter croissants, warm cinnamon rolls, savory paninis, and artisanal danishes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌸</div>
              <h3>Serene Sanctuary</h3>
              <p>Designed with warm wood, calming greenery, and soothing acoustic atmospheres to provide your ideal escape for brew and relax.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Seamless Order &amp; Pickup</h3>
              <p>Check real-time branch availability in Hyderabad, Vijayawada, and Rajahmundry, customize dietary choices, and pick up fresh.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Locations Section */}
      <section id="locations" className="haven-section locations-section">
        <div className="section-header">
          <span className="section-eyebrow">Visit Our Branches</span>
          <h2 className="section-title">Our Coffee Shop Locations</h2>
          <p className="section-subtitle">
            Find The Coffee Haven in prime destinations across Telangana and Andhra Pradesh. 
            Experience our distinctive ambiance and location-tailored menu offerings.
          </p>
        </div>

        <div className="locations-grid">
          {locations.map(loc => (
            <div key={loc.id} className="location-card">
              <div className="location-image-wrapper">
                <img src={loc.image} alt={loc.name} className="location-img" />
                <span className="location-city-badge">{loc.city}</span>
              </div>
              <div className="location-content">
                <h3 className="location-title">{loc.name}</h3>
                <p className="location-desc">{loc.description}</p>

                <div className="location-details">
                  <div className="detail-row">
                    <span className="icon">📍</span>
                    <span>{loc.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="icon">⏰</span>
                    <span>{loc.hours}</span>
                  </div>
                  <div className="detail-row">
                    <span className="icon">📞</span>
                    <span>{loc.contact}</span>
                  </div>
                  <div className="detail-row">
                    <span className="icon">✉️</span>
                    <span>{loc.email}</span>
                  </div>
                </div>

                <div className="location-card-footer">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => handleOrderFromLocation(loc.id)}
                  >
                    Select &amp; Order from {loc.city} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Feedback Section */}
      <section id="feedback" className="haven-section feedback-section">
        <div className="section-header">
          <span className="section-eyebrow">Customer Voices</span>
          <h2 className="section-title">Share Your Experience</h2>
          <p className="section-subtitle">
            Your impressions shape every cup we brew. Tell us about your visit to The Coffee Haven.
          </p>
        </div>

        <div className="feedback-layout">
          {/* Feedback Form */}
          <div className="feedback-form-card">
            <h3>We Value Your Feedback</h3>
            <p>Leave a review, rating, or suggestion for our baristas and culinary team.</p>

            {feedbackSuccess && (
              <div className="feedback-alert success">{feedbackSuccess}</div>
            )}
            {feedbackError && (
              <div className="feedback-alert error">{feedbackError}</div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="feedback-form">
              <div className="form-group">
                <label htmlFor="fb-name">Your Name *</label>
                <input
                  id="fb-name"
                  type="text"
                  placeholder="e.g. Sreya Rao"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fb-email">Email Address *</label>
                <input
                  id="fb-email"
                  type="email"
                  placeholder="e.g. sreya@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Overall Rating *</label>
                <div className="star-rating-selector" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${formData.rating >= star ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      aria-label={`${star} star rating`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="rating-label-hint">
                    ({formData.rating} out of 5 stars)
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="fb-message">Your Feedback / Review *</label>
                <textarea
                  id="fb-message"
                  rows="4"
                  placeholder="Tell us what you loved about our brews, food, or ambiance..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Customer Feedback 💌'}
              </button>
            </form>
          </div>

          {/* Recent Reviews Display */}
          <div className="recent-reviews-column">
            <h3>Recent Customer Reviews</h3>
            <div className="reviews-list">
              {feedbacks.length === 0 ? (
                <div className="empty-reviews">
                  Be the first to leave a review for The Coffee Haven!
                </div>
              ) : (
                feedbacks.slice(0, 5).map((fb) => (
                  <div key={fb.id} className="review-card">
                    <div className="review-card-header">
                      <div className="review-author-info">
                        <div className="author-avatar">{fb.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <strong className="author-name">{fb.name}</strong>
                          <span className="verified-badge">✓ Verified Patron</span>
                        </div>
                      </div>
                      <div className="stars-display">
                        {'★'.repeat(fb.rating)}
                        {'☆'.repeat(5 - fb.rating)}
                      </div>
                    </div>
                    <p className="review-text">"{fb.message}"</p>
                    <span className="review-time">
                      {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
