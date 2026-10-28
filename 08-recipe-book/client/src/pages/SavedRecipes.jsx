// client/src/pages/SavedRecipes.jsx
// Displays recipes saved/favorited by the authenticated user

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';

const DEFAULT_RECIPE_IMAGE =
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';

const SavedRecipes = () => {
  const { user } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    document.title = 'Saved Recipes - Recipe Book';
  }, []);

  const fetchSavedRecipes = async () => {
    setLoading(true);
    try {
      const res = await API.get('/recipes/saved');
      setSavedRecipes(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load saved recipes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  // Handle unsaving a recipe
  const handleRemoveFavorite = async (recipeId) => {
    try {
      await API.post(`/recipes/${recipeId}/favorite`);
      setSavedRecipes((prev) => prev.filter((r) => r._id !== recipeId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove from saved recipes.');
    }
  };

  // Toggle view details
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Filter saved recipes by search term locally for instant search
  const filteredRecipes = savedRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="saved-recipes-container">
      {/* Header banner */}
      <div className="page-header">
        <div>
          <h1>My Saved Recipes</h1>
          <p className="page-subtitle">
            All your favorite dishes and culinary bookmarks in one place
          </p>
        </div>
        <Link to="/" className="btn btn-secondary">
          ← Back to All Recipes
        </Link>
      </div>

      {/* Filter / Search within saved recipes */}
      {savedRecipes.length > 0 && (
        <div className="search-filter-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search within saved recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading your saved recipes...</div>
      ) : savedRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍳</div>
          <h3>No saved recipes yet</h3>
          <p>
            Browse our recipe collection and click the <strong>Save</strong> button on recipes you love!
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Explore Recipes
          </Link>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="empty-state">
          <p>No saved recipes match "{searchTerm}".</p>
          <button
            onClick={() => setSearchTerm('')}
            className="btn btn-secondary-sm"
            style={{ marginTop: '10px' }}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {filteredRecipes.map((recipe) => {
            const isExpanded = expandedId === recipe._id;

            return (
              <div key={recipe._id} className="recipe-card">
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
                    onClick={() => handleRemoveFavorite(recipe._id)}
                    className="favorite-btn active"
                    title="Remove from Saved Recipes"
                    aria-label="Remove from Saved Recipes"
                  >
                    ❤️ Saved
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
                      onClick={() => toggleExpand(recipe._id)}
                      className="btn btn-secondary-sm"
                    >
                      {isExpanded ? 'Hide Details' : 'View Full Recipe'}
                    </button>
                    <button
                      onClick={() => handleRemoveFavorite(recipe._id)}
                      className="btn btn-danger-sm"
                    >
                      Remove
                    </button>
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

export default SavedRecipes;

