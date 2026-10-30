// client/src/pages/Cart.jsx
// Shopping Cart page: view cart items, modify quantities, remove items, and checkout to create an order

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import API from '../api/axios';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [payingLoading, setPayingLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Shopping Cart | ShopSphere';
  }, []);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setCheckoutLoading(true);
    setCheckoutError('');

    try {
      const orderPayload = {
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        total: parseFloat(totalPrice.toFixed(2)),
      };

      const res = await API.post('/orders', orderPayload);
      clearCart();
      setCreatedOrder(res.data);
    } catch (err) {
      setCheckoutError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePayNow = async (orderId) => {
    setPayingLoading(true);
    try {
      const res = await API.put(`/orders/${orderId}/pay`);
      setCreatedOrder(res.data.order || { ...createdOrder, status: 'paid' });
      setPaymentSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Payment simulation failed.');
    } finally {
      setPayingLoading(false);
    }
  };

  // Order Placement Success Screen
  if (createdOrder) {
    const isPaid = createdOrder.status === 'paid' || paymentSuccess;

    return (
      <div className="cart-container">
        <div className="checkout-success-card">
          <div className="success-icon">{isPaid ? '🎉' : '🛍️'}</div>
          <h2>{isPaid ? 'Payment Successful!' : 'Order Placed Successfully!'}</h2>
          <p className="order-number">
            Order Reference: <strong>#{createdOrder._id}</strong>
          </p>
          <div className="order-status-badge-container">
            Status:{' '}
            <span className={`status-badge status-${isPaid ? 'paid' : 'pending'}`}>
              {isPaid ? 'Paid' : 'Pending Payment'}
            </span>
          </div>

          <div className="success-items-list">
            {createdOrder.items?.map((item, idx) => (
              <div key={idx} className="success-item-row">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="success-total-row">
              <strong>Total Amount:</strong>
              <strong>${Number(createdOrder.total).toFixed(2)}</strong>
            </div>
          </div>

          <div className="success-actions">
            {!isPaid && (
              <button
                onClick={() => handlePayNow(createdOrder._id)}
                className="btn btn-primary btn-block btn-pay-now"
                disabled={payingLoading}
              >
                {payingLoading ? 'Processing Dummy Payment...' : '💳 Pay Now (Dummy Payment)'}
              </button>
            )}

            <button
              onClick={() => navigate('/orders')}
              className="btn btn-secondary btn-block"
            >
              View in My Orders
            </button>
            <Link to="/" className="btn btn-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart-card">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Explore our store and add some amazing items to your shopping cart!</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Discover Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="page-title">Shopping Cart</h1>

      {checkoutError && <div className="alert alert-error">{checkoutError}</div>}

      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items-section">
          {cart.map((item) => (
            <div key={item._id} className="cart-item-card">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="cart-item-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
                }}
              />

              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-unit-price">${Number(item.price).toFixed(2)} each</p>

                <div className="cart-quantity-controls">
                  <span className="qty-label">Qty:</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="qty-btn"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="qty-btn"
                    disabled={item.stock !== undefined && item.quantity >= item.stock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item-price-col">
                <span className="cart-item-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="btn-remove-item"
                  title="Remove item"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Card */}
        <aside className="cart-summary-card">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Estimated Shipping</span>
            <span className="text-free">FREE</span>
          </div>
          <div className="summary-row">
            <span>Estimated Tax</span>
            <span>$0.00</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="btn btn-primary btn-block"
            style={{ marginTop: '20px' }}
          >
            {checkoutLoading ? 'Placing Order...' : 'Proceed to Checkout'}
          </button>

          <button
            onClick={clearCart}
            className="btn btn-secondary-sm btn-block"
            style={{ marginTop: '10px' }}
          >
            Clear Cart
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;

