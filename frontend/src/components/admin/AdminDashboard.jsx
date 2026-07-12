import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [showTableManagement, setShowTableManagement] = useState(false);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, cancelled: 0 });

  useEffect(() => {
    fetchAllReservations();
  }, []);

  const fetchAllReservations = async () => {
    try {
      const response = await api.get('/reservations');
      setReservations(response.data);
      setFilteredReservations(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const confirmed = response.data.filter(r => r.status === 'confirmed').length;
      const cancelled = response.data.filter(r => r.status === 'cancelled').length;
      setStats({ total, confirmed, cancelled });
    } catch (error) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (!date) {
      setFilteredReservations(reservations);
      return;
    }

    try {
      const response = await api.get(`/reservations/date?date=${date}`);
      setFilteredReservations(response.data);
    } catch (error) {
      toast.error('Failed to filter reservations');
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await api.delete(`/reservations/${id}`);
      toast.success('Reservation cancelled successfully');
      fetchAllReservations();
      setSelectedDate('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem', backgroundColor: '#f0f4ff', minHeight: '100vh' }}>
      
      {/* ADMIN HEADER - Dark with Red Accent */}
      <div style={{
        backgroundColor: '#1a1a2e',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        borderLeft: '6px solid #ef4444'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '2rem' }}>🔐</span>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Admin Dashboard</h1>
              <span style={{
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '0.7rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontWeight: 'bold',
                letterSpacing: '0.05em'
              }}>
                ADMIN
              </span>
            </div>
            <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
              🏢 Full system control • Manage reservations & tables
            </p>
          </div>
          <button
            onClick={() => setShowTableManagement(!showTableManagement)}
            style={{
              backgroundColor: showTableManagement ? '#ef4444' : '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            {showTableManagement ? '📋 View Reservations' : '🪑 Manage Tables'}
          </button>
        </div>
      </div>

      {/* STATISTICS CARDS - Admin Only */}
      {!showTableManagement && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            borderBottom: '4px solid #3b82f6',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>{stats.total}</div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Reservations</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            borderBottom: '4px solid #22c55e',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>{stats.confirmed}</div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>✅ Confirmed</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            borderBottom: '4px solid #ef4444',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>{stats.cancelled}</div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>❌ Cancelled</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            borderBottom: '4px solid #8b5cf6',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed' }}>
              {Math.round((stats.confirmed / (stats.total || 1)) * 100)}%
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>📊 Occupancy Rate</div>
          </div>
        </div>
      )}

      {showTableManagement ? (
        <TableManagement />
      ) : (
        <>
          {/* ADMIN FILTER - Distinct Style */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                📅 Filter by Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateFilter}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  fontSize: '0.875rem'
                }}
              />
              {selectedDate && (
                <button
                  onClick={() => {
                    setSelectedDate('');
                    setFilteredReservations(reservations);
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#e2e8f0',
                    color: '#334155',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  ✕ Clear
                </button>
              )}
              <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: '#64748b' }}>
                Showing {filteredReservations.length} of {reservations.length} reservations
              </span>
            </div>
          </div>

          {/* ADMIN RESERVATIONS - Different Card Style */}
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {filteredReservations.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '4rem 0',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                border: '2px dashed #cbd5e1'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No reservations found</p>
              </div>
            ) : (
              filteredReservations.map((reservation) => (
                <div
                  key={reservation._id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0',
                    borderTop: `5px solid ${reservation.status === 'cancelled' ? '#ef4444' : '#3b82f6'}`,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  }}
                >
                  {/* Admin Badge - Shows this is admin view */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        fontSize: '0.65rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        fontWeight: '600'
                      }}>
                        ADMIN VIEW
                      </span>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.7rem',
                          borderRadius: '9999px',
                          backgroundColor: reservation.status === 'confirmed' ? '#dcfce7' : '#fee2e2',
                          color: reservation.status === 'confirmed' ? '#166534' : '#991b1b',
                          fontWeight: '600'
                        }}
                      >
                        {reservation.status.toUpperCase()}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      #{reservation._id.slice(-6)}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                    Table {reservation.table?.tableNumber || 'N/A'}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 1rem', fontSize: '0.9rem' }}>
                    <p style={{ color: '#475569' }}>
                      <span style={{ fontWeight: '500', color: '#334155' }}>👤 Customer:</span> {reservation.user?.name || 'Unknown'}
                    </p>
                    <p style={{ color: '#475569' }}>
                      <span style={{ fontWeight: '500', color: '#334155' }}>📧 Email:</span> {reservation.user?.email || 'N/A'}
                    </p>
                    <p style={{ color: '#475569' }}>
                      <span style={{ fontWeight: '500', color: '#334155' }}>📅 Date:</span> {formatDate(reservation.date)}
                    </p>
                    <p style={{ color: '#475569' }}>
                      <span style={{ fontWeight: '500', color: '#334155' }}>⏰ Time:</span> {reservation.timeSlot}
                    </p>
                    <p style={{ color: '#475569' }}>
                      <span style={{ fontWeight: '500', color: '#334155' }}>👥 Guests:</span> {reservation.guests}
                    </p>
                    <p style={{ color: '#475569' }}>
                      <span style={{ fontWeight: '500', color: '#334155' }}>💺 Capacity:</span> {reservation.table?.capacity || 'N/A'}
                    </p>
                  </div>

                  {reservation.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelReservation(reservation._id)}
                      style={{
                        width: '100%',
                        marginTop: '1rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.6rem 1rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                    >
                      ❌ Cancel Reservation
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTable, setNewTable] = useState({ tableNumber: '', capacity: '' });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await api.get('/tables');
      setTables(response.data);
    } catch (error) {
      toast.error('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tables', newTable);
      toast.success('Table created successfully');
      setShowCreateForm(false);
      setNewTable({ tableNumber: '', capacity: '' });
      fetchTables();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create table');
    }
  };

  const handleDeleteTable = async (id) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return;
    try {
      await api.delete(`/tables/${id}`);
      toast.success('Table deleted successfully');
      fetchTables();
    } catch (error) {
      toast.error('Failed to delete table');
    }
  };

  const handleSeedTables = async () => {
    if (!window.confirm('This will delete all existing tables and create default ones. Continue?')) return;
    try {
      await api.post('/tables/seed');
      toast.success('Tables seeded successfully');
      fetchTables();
    } catch (error) {
      toast.error('Failed to seed tables');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading tables...</div>;
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>🪑 Table Management</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            + Add Table
          </button>
          <button
            onClick={handleSeedTables}
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#7c3aed'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#8b5cf6'}
          >
            🔄 Seed Tables
          </button>
        </div>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateTable} style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.25rem' }}>
                Table Number
              </label>
              <input
                type="number"
                value={newTable.tableNumber}
                onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.25rem' }}>
                Capacity
              </label>
              <input
                type="number"
                value={newTable.capacity}
                onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#22c55e',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#16a34a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#22c55e'}
            >
              ✅ Create Table
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              style={{
                backgroundColor: '#e2e8f0',
                color: '#475569',
                border: 'none',
                padding: '0.6rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {tables.map((table) => (
          <div key={table._id} style={{
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            padding: '1.25rem',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🪑</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>Table {table.tableNumber}</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>Capacity: {table.capacity} guests</p>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              Status: 
              <span style={{ color: table.isAvailable ? '#16a34a' : '#dc2626', fontWeight: '600' }}>
                {table.isAvailable ? ' Available' : ' Unavailable'}
              </span>
            </p>
            <button
              onClick={() => handleDeleteTable(table._id)}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.4rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600',
                width: '100%'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;