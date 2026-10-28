// client/src/pages/Dashboard.jsx
// Main Recipe Book feed with title search, category filter, recipe creation, and favorites

import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';

const DEFAULT_RECIPE_IMAGE =
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';

const CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snack',
  'Beverage',
  'Other',
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Category Filters
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Form visibility & state for creating a new recipe
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    category: 'Dinner',
    imageUrl: '',
    ingredients: '',
    steps: '',
  });
  const [createLoading, setCreateLoading] = useState(false);

  // Edit Recipe state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: 'Dinner',
    imageUrl: '',
    ingredients: '',
    steps: '',
  });

  // Track which card has full details expanded
  const [expandedId, setExpandedId] = useState(null);

  // Set page title
  useEffect(() => {
    document.title = 'Recipe Book - Discover & Share Recipes';
  }, []);

  // Fetch recipes with search query and category filter
  const fetchRecipes = useCallback(async (searchQuery = searchInput, category = activeCategory) => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (category && category !== 'All') {
        params.category = category;
      }
      const res = await API.get('/recipes', { params });
      setRecipes(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recipes.');
    } finally {
      setLoading(false);
    }
  }, [searchInput, activeCategory]);

  // Initial load
  useEffect(() => {
    fetchRecipes(searchInput, activeCategory);
  }, [activeCategory]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecipes(searchInput, activeCategory);
  };

  // Reset search
  const handleClearSearch = () => {
    setSearchInput('');
    fetchRecipes('', activeCategory);
  };

  // Form input changes for new recipe
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new recipe
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newRecipe.title.trim()) return;

    if (!user) {
      navigate('/login');
      return;
    }

    setCreateLoading(true);
    try {
      const res = await API.post('/recipes', newRecipe);
      setRecipes((prev) => [res.data, ...prev]);
      setNewRecipe({
        title: '',
        category: 'Dinner',
        imageUrl: '',
        ingredients: '',
        steps: '',
      });
      setShowCreateForm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create recipe.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Start editing a recipe
  const startEdit = (recipe) => {
    setEditingId(recipe._id);
    setEditFormData({
      title: recipe.title,
      category: recipe.category || 'General',
      imageUrl: recipe.imageUrl || '',
      ingredients: Array.isArray(recipe.ingredients)
        ? recipe.ingredients.join('\n')
        : recipe.ingredients,
      steps: recipe.steps || '',
    });
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({
      title: '',
      category: 'Dinner',
      imageUrl: '',
      ingredients: '',
      steps: '',
    });
  };

  // Save updated recipe
  const handleUpdateSubmit = async (id) => {
    if (!editFormData.title.trim()) return;

    try {
      const res = await API.put(`/recipes/${id}`, editFormData);
      setRecipes((prev) => prev.map((r) => (r._id === id ? res.data : r)));
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update recipe.');
    }
  };

  // Delete recipe
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await API.delete(`/recipes/${id}`);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete recipe.');
    }
  };

  // Toggle favorite / save recipe
  const handleToggleFavorite = async (recipe) => {
    if (!user) {
      if (window.confirm('Please log in to save recipes to your favorites. Go to Login now?')) {
        navigate('/login');
      }
      return;
    }

    try {
      const res = await API.post(`/recipes/${recipe._id}/favorite`);
      const updated = res.data.recipe;
      setRecipes((prev) => prev.map((r) => (r._id === recipe._id ? updated : r)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update favorite status.');
    }
  };

  // Helper to check if current user has saved the recipe
  const isRecipeSaved = (recipe) => {
    if (!user || !recipe.savedBy) return false;
    return recipe.savedBy.some(
      (savedUser) => (savedUser._id || savedUser).toString() === user._id.toString()
    );
  };

  // Helper to check if current user is author of the recipe
  const isAuthor = (recipe) => {
    if (!user || !recipe.user) return false;
    const authorId = recipe.user._id || recipe.user;
    return authorId.toString() === user._id.toString();
  };

  return (
    <div className="dashboard-container">
      {/* Hero / Header Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Discover, Cook & Share Recipes</h1>
          <p>
            Explore flavorful recipes created by home cooks and food lovers around the world.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search recipes by title (e.g. Pasta, Pancakes, Curry)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="btn btn-secondary"
              >
                Clear
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Category Filter Pills */}
      <div className="category-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-pill-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Action / Banner for Logged-in vs Guest */}
      {user ? (
        <section className="create-section">
          <div className="create-section-header">
            <div>
              <h2>{showCreateForm ? 'Create a New Recipe' : 'Share Your Recipe'}</h2>
              <p className="section-hint">
                Add your favorite dish to the community cookbook.
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="btn btn-primary"
            >
              {showCreateForm ? '✕ Close Form' : '+ Add Recipe'}
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreateSubmit} className="recipe-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="title">Recipe Title *</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={newRecipe.title}
                    onChange={handleNewChange}
                    placeholder="e.g. Creamy Tuscan Garlic Chicken"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={newRecipe.category}
                    onChange={handleNewChange}
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Snack">Snack</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Image URL (Optional)</label>
                <input
                  id="imageUrl"
                  type="text"
                  name="imageUrl"
                  value={newRecipe.imageUrl}
                  onChange={handleNewChange}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="ingredients">
                  Ingredients * <span className="label-tip">(One per line or comma-separated)</span>
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  value={newRecipe.ingredients}
                  onChange={handleNewChange}
                  placeholder="2 chicken breasts&#10;2 cloves garlic, minced&#10;1 cup heavy cream&#10;1 cup baby spinach"
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="steps">Preparation Steps *</label>
                <textarea
                  id="steps"
                  name="steps"
                  value={newRecipe.steps}
                  onChange={handleNewChange}
                  placeholder="1. Season chicken breasts with salt and pepper.&#10;2. Sear in a hot skillet for 5 minutes per side.&#10;3. Add garlic and cream, simmer until thickened."
                  rows="4"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createLoading}
                >
                  {createLoading ? 'Publishing...' : 'Publish Recipe'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      ) : (
        <div className="guest-banner">
          <div>
            <h3>Love Cooking? Join Recipe Book!</h3>
            <p>
              Log in to publish your original recipes, create personalized collections, and bookmark your favorite dishes.
            </p>
          </div>
          <div className="guest-actions">
            <Link to="/login" className="btn btn-primary">
              Log In
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* Recipes Section */}
      <section className="recipes-section">
        <div className="recipes-header">
          <h2>
            {searchInput ? `Search Results for "${searchInput}"` : `${activeCategory} Recipes`}
          </h2>
          <span className="recipes-count">({recipes.length} found)</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading delicious recipes...</div>
        ) : recipes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍳</div>
            <h3>No recipes found</h3>
            <p>
              {searchInput
                ? `No recipes match "${searchInput}". Try another keyword or clear search.`
                : 'No recipes have been added yet in this category.'}
            </p>
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="btn btn-secondary-sm"
                style={{ marginTop: '14px' }}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="card-grid">
            {recipes.map((recipe) => {
              const isEditing = editingId === recipe._id;
              const isExpanded = expandedId === recipe._id;
              const saved = isRecipeSaved(recipe);
              const owner = isAuthor(recipe);

              return (
                <div key={recipe._id} className="recipe-card">
                  {isEditing ? (
                    /* Edit Mode */
                    <div className="card-edit-mode">
                      <h3>Edit Recipe</h3>
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="edit-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Category</label>
                        <select
                          value={editFormData.category}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="edit-select"
                        >
                          <option value="Breakfast">Breakfast</option>
                          <option value="Lunch">Lunch</option>
                          <option value="Dinner">Dinner</option>
                          <option value="Dessert">Dessert</option>
                          <option value="Snack">Snack</option>
                          <option value="Beverage">Beverage</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Image URL</label>
                        <input
                          type="text"
                          value={editFormData.imageUrl}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              imageUrl: e.target.value,
                            }))
                          }
                          className="edit-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Ingredients (one per line or comma-separated)</label>
                        <textarea
                          value={editFormData.ingredients}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              ingredients: e.target.value,
                            }))
                          }
                          className="edit-textarea"
                          rows="3"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Preparation Steps</label>
                        <textarea
                          value={editFormData.steps}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              steps: e.target.value,
                            }))
                          }
                          className="edit-textarea"
                          rows="3"
                          required
                        />
                      </div>

                      <div className="card-actions">
                        <button
                          onClick={() => handleUpdateSubmit(recipe._id)}
                          className="btn btn-success-sm"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn btn-secondary-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <>
                      <div className="recipe-image-wrap">
                        <img
                          src={recipe.imageUrl || DEFAULT_RECIPE_IMAGE}
                          alt={recipe.title}
                          className="recipe-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_RECIPE_IMAGE;
                          }}
                        />
                        <span className="category-pill">{recipe.category || 'General'}</span>
                        <button
                          onClick={() => handleToggleFavorite(recipe)}
                          className={`favorite-btn ${saved ? 'active' : ''}`}
                          title={saved ? 'Remove from Favorites' : 'Save to Favorites'}
                          aria-label={saved ? 'Saved' : 'Save'}
                        >
                          {saved ? '❤️ Saved' : '🤍 Save'}
                        </button>
                      </div>

                      <div className="recipe-content">
                        <h3 className="recipe-title">{recipe.title}</h3>
                        <div className="recipe-meta">
                          <span>By {recipe.user?.name || 'Chef'}</span>
                          <span>•</span>
                          <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="recipe-section-preview">
                          <h4>Ingredients ({recipe.ingredients?.length || 0})</h4>
                          <ul className="ingredients-list">
                            {(isExpanded
                              ? recipe.ingredients
                              : recipe.ingredients?.slice(0, 3)
                            )?.map((ingredient, idx) => (
                              <li key={idx}>{ingredient}</li>
                            ))}
                            {!isExpanded && recipe.ingredients?.length > 3 && (
                              <li className="more-ingredients">
                                +{recipe.ingredients.length - 3} more...
                              </li>
                            )}
                          </ul>
                        </div>

                        {isExpanded && (
                          <div className="recipe-steps-expanded">
                            <h4>Instructions / Steps</h4>
                            <p className="recipe-steps-text">{recipe.steps}</p>
                          </div>
                        )}

                        <div className="recipe-card-footer">
                          <button
                            onClick={() =>
                              setExpandedId((prev) =>
                                prev === recipe._id ? null : recipe._id
                              )
                            }
                            className="btn btn-secondary-sm"
                          >
                            {isExpanded ? 'Hide Details' : 'View Full Recipe'}
                          </button>

                          {owner && (
                            <div className="owner-actions">
                              <button
                                onClick={() => startEdit(recipe)}
                                className="btn btn-secondary-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(recipe._id)}
                                className="btn btn-danger-sm"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
