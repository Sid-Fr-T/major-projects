// client/src/pages/Home.jsx
// Public home page showcasing portfolio about text, skills, and projects

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';

const Home = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState({
    name: '',
    title: '',
    about: '',
    skills: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Portfolio CMS | Home';

    let ignore = false;
    API.get('/portfolio')
      .then((res) => {
        if (!ignore) {
          setPortfolio(res.data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load portfolio content.');
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="home-container">
      {/* Admin Quick Action Banner */}
      {user?.role === 'admin' && (
        <div className="admin-banner">
          <span>✨ You are logged in as an <strong>Admin</strong>.</span>
          <Link to="/admin" className="btn btn-primary-sm">
            Go to Admin Panel &rarr;
          </Link>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Loading portfolio...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <>
          {/* Hero & About Section */}
          <section className="portfolio-hero">
            <div className="hero-content">
              <span className="hero-eyebrow">Portfolio Showcase</span>
              <h1 className="hero-title">{portfolio.name || 'Developer Portfolio'}</h1>
              <p className="hero-subtitle">{portfolio.title || 'Full Stack Web Developer'}</p>
            </div>

            <div className="about-card">
              <h2 className="section-title">About Me</h2>
              <p className="about-text">
                {portfolio.about || 'Welcome to my portfolio! Check out my skills and latest projects below.'}
              </p>
            </div>
          </section>

          {/* Skills Section */}
          <section className="skills-section">
            <h2 className="section-title">Skills &amp; Technologies</h2>
            {portfolio.skills && portfolio.skills.length > 0 ? (
              <div className="skills-grid">
                {portfolio.skills.map((skill, index) => (
                  <span key={index} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="empty-text">No skills listed yet.</p>
            )}
          </section>

          {/* Projects Section */}
          <section className="projects-section">
            <div className="section-header">
              <h2 className="section-title">Featured Projects</h2>
              <span className="section-count">
                ({portfolio.projects ? portfolio.projects.length : 0})
              </span>
            </div>

            {portfolio.projects && portfolio.projects.length > 0 ? (
              <div className="projects-grid">
                {portfolio.projects.map((project) => (
                  <article key={project._id} className="project-card">
                    <div className="project-image-wrapper">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="project-image"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      ) : (
                        <div className="project-image-placeholder">
                          <span>💻 {project.title}</span>
                        </div>
                      )}
                    </div>

                    <div className="project-body">
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-description">
                        {project.description || 'No project description provided.'}
                      </p>
                    </div>

                    <div className="project-footer">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary-sm project-link-btn"
                        >
                          View Project &rarr;
                        </a>
                      ) : (
                        <span className="no-link-label">Link not provided</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No projects added to the portfolio yet.</p>
                {user?.role === 'admin' ? (
                  <Link to="/admin" className="btn btn-primary-sm" style={{ marginTop: '12px' }}>
                    Add Your First Project in Admin Panel
                  </Link>
                ) : (
                  <p className="empty-hint">Check back soon for upcoming projects!</p>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Home;

