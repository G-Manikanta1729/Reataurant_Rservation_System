import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import CreateReservation from './CreateReservation';
import Spinner from '../common/Spinner';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations');
      setReservations(response.data);
    } catch (error) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await api.delete(`/reservations/${id}`);
      toast.success('Reservation cancelled successfully');
      fetchReservations();
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>My Reservations</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#4338ca'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4f46e5'}
        >
          New Reservation
        </button>
      </div>

      {/* FILTER BUTTONS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '0.25rem 0.75rem',
            backgroundColor: filter === 'all' ? '#4f46e5' : '#e5e7eb',
            color: filter === 'all' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          All ({reservations.length})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          style={{
            padding: '0.25rem 0.75rem',
            backgroundColor: filter === 'upcoming' ? '#4f46e5' : '#e5e7eb',
            color: filter === 'upcoming' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Upcoming ({reservations.filter(r => new Date(r.date) >= new Date() && r.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setFilter('past')}
          style={{
            padding: '0.25rem 0.75rem',
            backgroundColor: filter === 'past' ? '#4f46e5' : '#e5e7eb',
            color: filter === 'past' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Past ({reservations.filter(r => new Date(r.date) < new Date() && r.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          style={{
            padding: '0.25rem 0.75rem',
            backgroundColor: filter === 'cancelled' ? '#4f46e5' : '#e5e7eb',
            color: filter === 'cancelled' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Cancelled ({reservations.filter(r => r.status === 'cancelled').length})
        </button>
      </div>

      {showCreateForm && (
        <div style={{ marginBottom: '2rem' }}>
          <CreateReservation 
            onSuccess={() => {
              setShowCreateForm(false);
              fetchReservations();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {reservations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <p style={{ color: '#6b7280' }}>No reservations found. Create your first reservation!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {reservations
            .filter((reservation) => {
              if (filter === 'all') return true;
              
              // Get today's date at midnight for proper comparison
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              const reservationDate = new Date(reservation.date);
              reservationDate.setHours(0, 0, 0, 0);
              
              if (filter === 'upcoming') {
                // Show only confirmed reservations in the future
                return reservationDate >= today && reservation.status === 'confirmed';
              }
              
              if (filter === 'past') {
                // Show only confirmed reservations in the past
                return reservationDate < today && reservation.status === 'confirmed';
              }
              
              if (filter === 'cancelled') {
                // Show only cancelled reservations
                return reservation.status === 'cancelled';
              }
              
              return true;
            })
            .map((reservation) => (
              <div
                key={reservation._id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  padding: '1.5rem',
                  borderLeft: `4px solid ${reservation.status === 'cancelled' ? '#ef4444' : '#22c55e'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                    Table {reservation.table?.tableNumber || 'N/A'}
                  </h3>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      borderRadius: '9999px',
                      backgroundColor: reservation.status === 'confirmed' ? '#dcfce7' : '#fee2e2',
                      color: reservation.status === 'confirmed' ? '#166534' : '#991b1b'
                    }}
                  >
                    {reservation.status}
                  </span>
                </div>
                <p style={{ color: '#4b5563' }}>
                  <span style={{ fontWeight: '500' }}>Date:</span> {formatDate(reservation.date)}
                </p>
                <p style={{ color: '#4b5563' }}>
                  <span style={{ fontWeight: '500' }}>Time:</span> {reservation.timeSlot}
                </p>
                <p style={{ color: '#4b5563' }}>
                  <span style={{ fontWeight: '500' }}>Guests:</span> {reservation.guests}
                </p>
                <p style={{ color: '#4b5563' }}>
                  <span style={{ fontWeight: '500' }}>Capacity:</span> {reservation.table?.capacity || 'N/A'} guests
                </p>
                {reservation.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancelReservation(reservation._id)}
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                  >
                    Cancel Reservation
                  </button>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;