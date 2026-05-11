'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordClient() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [ready, setReady]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8)  { setError('Password must be at least 8 characters'); return; }

    setLoading(true);
    try {
      const { error: sbError } = await supabase.auth.updateUser({ password });
      if (sbError) throw sbError;
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 380, padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Reset Password</h1>
          <p style={{ color: '#64748b', marginTop: '0.4rem', fontSize: '0.9rem' }}>Enter your new password below</p>
        </div>

        <div style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
          padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
              <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Password updated!</p>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                You can now sign in with your new password.
              </p>
              <a
                href="http://localhost:5173/login"
                style={{
                  display: 'inline-block', background: '#1e293b', color: '#fff',
                  padding: '0.6rem 1.4rem', borderRadius: 8, fontSize: '0.875rem',
                  fontWeight: 600, textDecoration: 'none',
                }}
              >
                Go to CMS login
              </a>
            </div>
          ) : !ready ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#1e293b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Verifying reset link…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.35rem' }}>
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  autoFocus
                  style={{
                    width: '100%', border: '1px solid #e2e8f0', borderRadius: 8,
                    padding: '0.55rem 0.75rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.35rem' }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  required
                  style={{
                    width: '100%', border: '1px solid #e2e8f0', borderRadius: 8,
                    padding: '0.55rem 0.75rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              {error && (
                <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0 }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#1e293b', color: '#fff', border: 'none', borderRadius: 8,
                  padding: '0.65rem', fontSize: '0.875rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
