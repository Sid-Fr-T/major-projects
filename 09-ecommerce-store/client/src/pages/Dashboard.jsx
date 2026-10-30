// client/src/pages/Dashboard.jsx
// Product Catalog dashboard: lists products, allows adding to cart, and provides a form to add products

import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useCart } from '../context/useCart';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedNotice, setAddedNotice] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { addToCart, cart } = useCart();

  // State for adding a new product
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    imageUrl: '',
    description: '',
    stock: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      setProducts(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    document.title = 'Products | ShopSphere';
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!newProduct.name.trim() || !newProduct.price || !newProduct.imageUrl.trim()) {
      setFormError('Please fill in name, price, and image URL.');
      return;
    }

    setCreateLoading(true);
    try {
      const payload = {
        name: newProduct.name.trim(),
        price: parseFloat(newProduct.price),
        imageUrl: newProduct.imageUrl.trim(),
        description: newProduct.description.trim(),
        stock: parseInt(newProduct.stock, 10) || 0,
      };

      const res = await API.post('/products', payload);
      setProducts((prev) => [res.data, ...prev]);
      setNewProduct({
        name: '',
        price: '',
        imageUrl: '',
        description: '',
        stock: '',
      });
      setShowAddForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add product.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedNotice(product._id);
    setTimeout(() => {
      setAddedNotice((current) => (current === product._id ? null : current));
    }, 1500);
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="store-container">
      {/* Hero / Header Section */}
      <section className="store-header">
        <div>
          <h1 className="page-title">Explore Products</h1>
          <p className="page-subtitle">
            Browse our curated collection of tech gear, accessories, and essentials.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          {showAddForm ? 'Close Form' : '+ Add Product'}
        </button>
      </section>

      {/* Add Product Collapsible Section */}
      {showAddForm && (
        <section className="create-section">
          <h2>Add New Product</h2>
          {formError && <div className="alert alert-error">{formError}</div>}
          <form onSubmit={handleCreateSubmit} className="create-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Wireless Noise Canceling Headphones"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="e.g. 199.99"
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  placeholder="e.g. 25"
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={newProduct.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Brief description of the product features..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createLoading}
              >
                {createLoading ? 'Saving...' : 'Save Product'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Search and Stats bar */}
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search products by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="results-count">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Product Grid */}
      {loading ? (
        <div className="loading-state">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No products found {searchQuery ? `matching "${searchQuery}"` : ''}.</p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="btn btn-secondary-sm"
              style={{ marginTop: '12px' }}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const inCartItem = cart.find((i) => i._id === product._id);
            const inCartQty = inCartItem ? inCartItem.quantity : 0;
            const isOutOfStock = product.stock <= 0;
            const isMaxInCart = inCartQty >= product.stock;

            return (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <span
                    className={`stock-pill ${isOutOfStock ? 'stock-out' : 'stock-in'}`}
                  >
                    {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
                  </span>
                </div>

                <div className="product-body">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-price">${Number(product.price).toFixed(2)}</p>
                  <p className="product-desc">{product.description || 'No description provided.'}</p>
                </div>

                <div className="product-footer">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock || isMaxInCart}
                    className={`btn ${addedNotice === product._id ? 'btn-success-sm' : 'btn-primary-sm'} btn-block`}
                  >
                    {addedNotice === product._id
                      ? '✓ Added to Cart!'
                      : isOutOfStock
                      ? 'Sold Out'
                      : isMaxInCart
                      ? 'Max in Cart'
                      : `Add to Cart ${inCartQty > 0 ? `(${inCartQty})` : ''}`}
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(product._id, product.name)}
                    className="btn-delete-link"
                    title="Delete product"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
