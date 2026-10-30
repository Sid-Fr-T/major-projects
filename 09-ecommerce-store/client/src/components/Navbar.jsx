// client/src/components/Navbar.jsx
// Navigation bar with branding, store navigation, cart badge, and user authentication

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🛒</span>
          <span>ShopSphere</span>
        </Link>

        {/* Navigation & Actions */}
        <div className="nav-actions">
          {user ? (
            <>
              <div className="nav-links">
                <Link to="/" className={`nav-link ${isActive('/')}`}>
                  Products
                </Link>
                <Link to="/cart" className={`nav-link cart-link ${isActive('/cart')}`}>
                  Cart
                  {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
                </Link>
                <Link to="/orders" className={`nav-link ${isActive('/orders')}`}>
                  My Orders
                </Link>
              </div>

              <div className="user-section">
                <span className="nav-user">
                  Hello, <strong>{user.name}</strong>
                </span>
                <button onClick={handleLogout} className="btn btn-secondary-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-links">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link btn btn-primary-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
