import React, { useState } from 'react';
import { API } from '../services/api';

export default function ApiExplorer() {
  const [pastryId, setPastryId] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchNutFree = async () => {
    setLoading(true);
    try {
      const res = await API.getNutFreePastries();
      setResponse(res);
    } catch (err) {
      setResponse({ status: 500, body: { error: err.message } });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchById = async () => {
    if (!pastryId.trim()) return;
    setLoading(true);
    try {
      const res = await API.getPastryById(pastryId.trim());
      setResponse(res);
    } catch (err) {
      setResponse({ status: 500, body: { error: err.message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Live Pastry API Explorer (SSI Challenge Contributions)</h2>
      <p style={{ margin: '4px 0 12px', fontSize: '0.9rem', color: 'var(--ink-light)' }}>
        Directly test the two specific backend retrieval endpoints developed in Week 2:
      </p>

      <div className="row">
        <button className="ghost" onClick={handleFetchNutFree} disabled={loading}>
          <span className="api-badge">GET</span> /api/pastries/nut-free
        </button>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Pastry ID (e.g. 5, 6, 999)"
            value={pastryId}
            onChange={e => setPastryId(e.target.value)}
            style={{ width: '180px' }}
          />
          <button className="ghost" onClick={handleFetchById} disabled={loading || !pastryId}>
            <span className="api-badge">GET</span> /api/pastries/&#123;id&#125;
          </button>
        </div>
      </div>

      {response && (
        <div style={{ marginTop: '10px' }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: response.status === 200 ? 'var(--success)' : 'var(--danger)'
          }}>
            HTTP Status: {response.status} {response.status === 200 ? 'OK' : 'Error'}
          </div>
          <pre>{JSON.stringify(response.body, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
