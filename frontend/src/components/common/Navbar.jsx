import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '1rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 'bold' }}>
          🍽️ Restaurant Reservation
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <span style={{ fontSize: '0.875rem' }}>
                {user.name} ({user.role})
              </span>
              <Link
                to="/dashboard"
                style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0.75rem', borderRadius: '0.375rem' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0.75rem', borderRadius: '0.375rem' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0.75rem', borderRadius: '0.375rem' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#4338ca'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4f46e5'}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;