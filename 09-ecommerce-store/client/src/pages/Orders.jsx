// client/src/pages/Orders.jsx
// Displays customer order history with item breakdown and dummy "Pay Now" functionality

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [paymentNotice, setPaymentNotice] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders');
      setOrders(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    document.title = 'My Orders | ShopSphere';
  }, []);

  const handlePayNow = async (orderId) => {
    setPayingOrderId(orderId);
    setPaymentNotice('');

    try {
      const res = await API.put(`/orders/${orderId}/pay`);
      const updatedOrder = res.data.order;

      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? (updatedOrder || { ...ord, status: 'paid' }) : ord))
      );

      setPaymentNotice(`Order #${orderId.slice(-6)} has been marked as Paid!`);
      setTimeout(() => {
        setPaymentNotice('');
      }, 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Payment simulation failed.');
    } finally {
      setPayingOrderId(null);
    }
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div>
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">View and track all your recent orders</p>
        </div>
        <Link to="/" className="btn btn-secondary-sm">
          Browse Products
        </Link>
      </div>

      {paymentNotice && <div className="alert alert-success">{paymentNotice}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const isPending = order.status === 'pending';
            const isPaid = order.status === 'paid';

            return (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-meta">
                    <span className="order-id">
                      Order <strong>#{order._id}</strong>
                    </span>
                    <span className="order-date">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="order-header-right">
                    <span className={`status-badge status-${order.status || 'pending'}`}>
                      {order.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>

                    {isPending && (
                      <button
                        onClick={() => handlePayNow(order._id)}
                        disabled={payingOrderId === order._id}
                        className="btn btn-primary-sm btn-pay-now"
                      >
                        {payingOrderId === order._id ? 'Processing...' : '💳 Pay Now'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="order-items-list">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="order-item-thumbnail"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                      )}
                      <div className="order-item-info">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-unit">
                          ${Number(item.price).toFixed(2)} each
                        </span>
                      </div>
                      <div className="order-item-qty">Qty: {item.quantity}</div>
                      <div className="order-item-subtotal">
                        ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="order-status-desc">
                    {isPaid ? (
                      <span className="text-success">✓ Payment Confirmed</span>
                    ) : (
                      <span className="text-warning">⚠ Awaiting payment</span>
                    )}
                  </div>
                  <div className="order-total-block">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">${Number(order.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;

