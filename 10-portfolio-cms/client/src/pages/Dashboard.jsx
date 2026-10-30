// client/src/pages/Dashboard.jsx
// Admin Panel: Edit portfolio content (about text, skills, and projects)

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  // About and Skills state
  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    about: '',
    skills: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Projects state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectError, setProjectError] = useState('');

  // New Project Form state
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    link: '',
    imageUrl: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState({ type: '', text: '' });

  // Project editing state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    link: '',
    imageUrl: '',
  });
  const [editLoading, setEditLoading] = useState(false);

  // Set page title and fetch existing portfolio data
  useEffect(() => {
    document.title = 'Portfolio CMS | Admin Panel';

    let ignore = false;
    API.get('/portfolio')
      .then((res) => {
        if (!ignore) {
          const { name, title, about, skills, projects: fetchedProjects } = res.data;
          setProfileData({
            name: name || '',
            title: title || '',
            about: about || '',
            skills: Array.isArray(skills) ? skills.join(', ') : '',
          });
          setProjects(fetchedProjects || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setProjectError(err.response?.data?.message || 'Failed to fetch portfolio data.');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Handle Profile (About & Skills) input changes
  const handleProfileChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (profileMessage.text) setProfileMessage({ type: '', text: '' });
  };

  // Submit Profile update (about text, skills, title, name)
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });

    try {
      const skillsArray = profileData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await API.put('/portfolio', {
        name: profileData.name,
        title: profileData.title,
        about: profileData.about,
        skills: skillsArray,
      });

      setProfileMessage({
        type: 'success',
        text: res.data.message || 'Portfolio details updated successfully!',
      });
    } catch (err) {
      setProfileMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update portfolio details.',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle New Project input change
  const handleNewProjectChange = (e) => {
    setNewProject((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (createMessage.text) setCreateMessage({ type: '', text: '' });
  };

  // Create Project submit
  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) {
      setCreateMessage({ type: 'error', text: 'Project title is required.' });
      return;
    }

    setCreateLoading(true);
    setCreateMessage({ type: '', text: '' });

    try {
      const res = await API.post('/projects', newProject);
      setProjects((prev) => [res.data.project, ...prev]);
      setNewProject({ title: '', description: '', link: '', imageUrl: '' });
      setCreateMessage({ type: 'success', text: 'Project added successfully!' });
    } catch (err) {
      setCreateMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to add project.',
      });
    } finally {
      setCreateLoading(false);
    }
  };

  // Start editing a project
  const startEditProject = (project) => {
    setEditingId(project._id);
    setEditFormData({
      title: project.title,
      description: project.description || '',
      link: project.link || '',
      imageUrl: project.imageUrl || '',
    });
  };

  // Cancel project edit
  const cancelEditProject = () => {
    setEditingId(null);
    setEditFormData({ title: '', description: '', link: '', imageUrl: '' });
  };

  // Save updated project
  const handleUpdateProjectSubmit = async (id) => {
    if (!editFormData.title.trim()) {
      alert('Project title is required.');
      return;
    }

    setEditLoading(true);
    try {
      const res = await API.put(`/projects/${id}`, editFormData);
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? res.data.project : p))
      );
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update project.');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await API.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project.');
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Dashboard Top Header */}
      <div className="dashboard-header-card">
        <div>
          <h2>Admin Portfolio CMS</h2>
          <p className="dashboard-subtitle">
            Logged in as <strong>{user?.name}</strong> ({user?.role}). Manage your public portfolio content here.
          </p>
        </div>
        <Link to="/" className="btn btn-secondary-sm">
          Preview Public Portfolio &rarr;
        </Link>
      </div>

      {/* SECTION 1: Edit About & Skills */}
      <section className="admin-section">
        <div className="section-header-box">
          <h3>Edit About Text &amp; Skills</h3>
          <p className="section-subtext">Update your bio, headline, and technology stack.</p>
        </div>

        {profileMessage.text && (
          <div
            className={`alert ${
              profileMessage.type === 'success' ? 'alert-success' : 'alert-error'
            }`}
          >
            {profileMessage.text}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="cms-form">
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="name">Display Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="e.g. Alex Morgan"
              />
            </div>
            <div className="form-group flex-1">
              <label htmlFor="title">Professional Headline / Role</label>
              <input
                id="title"
                type="text"
                name="title"
                value={profileData.title}
                onChange={handleProfileChange}
                placeholder="e.g. Full Stack Web Developer"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="about">About Text</label>
            <textarea
              id="about"
              name="about"
              value={profileData.about}
              onChange={handleProfileChange}
              rows="4"
              placeholder="Write a brief introduction or bio..."
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills &amp; Technologies (comma separated)</label>
            <input
              id="skills"
              type="text"
              name="skills"
              value={profileData.skills}
              onChange={handleProfileChange}
              placeholder="e.g. React, Node.js, Express, MongoDB, JavaScript, TypeScript, CSS"
            />
            <span className="field-hint">
              Separate each skill with a comma (e.g., React, Express, MongoDB).
            </span>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={profileLoading}
            >
              {profileLoading ? 'Saving Changes...' : 'Save Portfolio Profile'}
            </button>
          </div>
        </form>
      </section>

      {/* SECTION 2: Add New Project */}
      <section className="admin-section">
        <div className="section-header-box">
          <h3>Add New Project</h3>
          <p className="section-subtext">Add a project with title, description, link, and image URL (no file uploads).</p>
        </div>

        {createMessage.text && (
          <div
            className={`alert ${
              createMessage.type === 'success' ? 'alert-success' : 'alert-error'
            }`}
          >
            {createMessage.text}
          </div>
        )}

        <form onSubmit={handleCreateProjectSubmit} className="cms-form">
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="project-title">Project Title *</label>
              <input
                id="project-title"
                type="text"
                name="title"
                value={newProject.title}
                onChange={handleNewProjectChange}
                placeholder="e.g. Real-Time Chat App"
                required
              />
            </div>
            <div className="form-group flex-1">
              <label htmlFor="project-link">Project Link (URL)</label>
              <input
                id="project-link"
                type="text"
                name="link"
                value={newProject.link}
                onChange={handleNewProjectChange}
                placeholder="https://github.com/username/project or https://live-demo.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="project-imageUrl">Image URL</label>
            <input
              id="project-imageUrl"
              type="text"
              name="imageUrl"
              value={newProject.imageUrl}
              onChange={handleNewProjectChange}
              placeholder="https://images.unsplash.com/photo-..."
            />
            <span className="field-hint">
              Provide a direct image URL (HTTPS recommended). No file uploads required.
            </span>
          </div>

          {newProject.imageUrl && (
            <div className="image-preview-box">
              <span className="preview-label">Image Preview:</span>
              <img
                src={newProject.imageUrl}
                alt="Preview"
                className="image-preview-thumb"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              name="description"
              value={newProject.description}
              onChange={handleNewProjectChange}
              rows="3"
              placeholder="Describe what the project does, key features, and stack..."
            ></textarea>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createLoading}
            >
              {createLoading ? 'Adding Project...' : 'Add Project'}
            </button>
          </div>
        </form>
      </section>

      {/* SECTION 3: Manage Existing Projects */}
      <section className="admin-section">
        <div className="section-header-box flex-between">
          <div>
            <h3>Manage Projects</h3>
            <p className="section-subtext">Edit or delete existing portfolio projects.</p>
          </div>
          <span className="section-count">Total: {projects.length}</span>
        </div>

        {projectError && <div className="alert alert-error">{projectError}</div>}

        {loading ? (
          <div className="loading-state">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <p>No projects created yet. Use the form above to add your first project.</p>
          </div>
        ) : (
          <div className="card-grid">
            {projects.map((project) => {
              const isEditing = editingId === project._id;

              return (
                <div key={project._id} className="item-card project-admin-card">
                  {isEditing ? (
                    // In-card editing mode
                    <div className="card-edit-mode">
                      <div className="form-group">
                        <label>Title *</label>
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
                        <label>Project Link</label>
                        <input
                          type="text"
                          value={editFormData.link}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              link: e.target.value,
                            }))
                          }
                          className="edit-input"
                          placeholder="https://..."
                        />
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
                          placeholder="https://..."
                        />
                      </div>

                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={editFormData.description}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="edit-textarea"
                          rows="3"
                        ></textarea>
                      </div>

                      <div className="card-actions">
                        <button
                          onClick={() => handleUpdateProjectSubmit(project._id)}
                          className="btn btn-success-sm"
                          disabled={editLoading}
                        >
                          {editLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEditProject}
                          className="btn btn-secondary-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Normal view mode
                    <>
                      <div className="admin-project-thumb-container">
                        {project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="admin-project-thumb"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                        ) : (
                          <div className="admin-project-placeholder">
                            <span>No image</span>
                          </div>
                        )}
                      </div>

                      <div className="card-header">
                        <h4 className="card-title">{project.title}</h4>
                      </div>

                      <p className="card-description">
                        {project.description || 'No description provided.'}
                      </p>

                      {project.link && (
                        <div className="project-card-link-preview">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-ext-link"
                          >
                            🔗 {project.link}
                          </a>
                        </div>
                      )}

                      <div className="card-footer">
                        <span className="card-date">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <div className="card-actions">
                          <button
                            onClick={() => startEditProject(project)}
                            className="btn btn-secondary-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="btn btn-danger-sm"
                          >
                            Delete
                          </button>
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
