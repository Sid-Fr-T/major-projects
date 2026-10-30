// client/src/pages/Dashboard.jsx
// Role-based Dashboard:
// - Recruiters: Create, edit, and delete job postings; view applicant list per job
// - Applicants: Browse all open job listings and apply once per job

import { useState, useEffect, useMemo } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';

  // Job listings & page state
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search/filter for applicants
  const [searchTerm, setSearchTerm] = useState('');

  // Recruiter: New Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
  });
  const [createLoading, setCreateLoading] = useState(false);

  // Recruiter: Edit Job State
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
  });

  // Recruiter: Toggle expanded applicants view for a job
  const [expandedApplicantsJobId, setExpandedApplicantsJobId] = useState(null);

  // Applicant: Tracking application in-flight
  const [applyingId, setApplyingId] = useState(null);

  // Fetch jobs based on user role
  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      // Recruiters fetch their own jobs by default; applicants fetch all jobs
      const endpoint = isRecruiter ? '/jobs/my' : '/jobs';
      const res = await API.get(endpoint);
      setJobs(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecruiter]);

  // Handle new job form change
  const handleNewChange = (e) => {
    setNewJob((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Recruiter: Submit new job posting
  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newJob.title.trim() || !newJob.company.trim() || !newJob.location.trim() || !newJob.description.trim()) {
      alert('Please fill in title, company, location, and description.');
      return;
    }

    setCreateLoading(true);
    setError('');
    try {
      const res = await API.post('/jobs', newJob);
      setJobs((prev) => [res.data, ...prev]);
      setNewJob({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
      });
      setSuccessMsg('Job posting created successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create job posting.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Recruiter: Start editing a job
  const startEdit = (job) => {
    setEditingId(job._id);
    setEditFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary || '',
      description: job.description || '',
    });
  };

  // Recruiter: Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Recruiter: Save updated job
  const handleUpdateJob = async (id) => {
    if (!editFormData.title.trim() || !editFormData.company.trim() || !editFormData.location.trim() || !editFormData.description.trim()) {
      alert('Please fill in title, company, location, and description.');
      return;
    }

    try {
      const res = await API.put(`/jobs/${id}`, editFormData);
      setJobs((prev) => prev.map((j) => (j._id === id ? res.data : j)));
      setEditingId(null);
      setSuccessMsg('Job posting updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update job posting.');
    }
  };

  // Recruiter: Delete a job
  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) {
      return;
    }

    try {
      await API.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      if (expandedApplicantsJobId === id) {
        setExpandedApplicantsJobId(null);
      }
      setSuccessMsg('Job posting deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job posting.');
    }
  };

  // Recruiter: Toggle view applicants
  const toggleApplicants = (jobId) => {
    setExpandedApplicantsJobId((prev) => (prev === jobId ? null : jobId));
  };

  // Applicant: Apply to a job
  const handleApply = async (jobId) => {
    setApplyingId(jobId);
    try {
      const res = await API.post(`/jobs/${jobId}/apply`);
      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId
            ? { ...job, hasApplied: true, applicantCount: (job.applicantCount || 0) + 1 }
            : job
        )
      );
      setSuccessMsg(res.data.message || 'Application submitted successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply for job.');
    } finally {
      setApplyingId(null);
    }
  };

  // Filtered jobs for applicants
  const displayedJobs = useMemo(() => {
    if (!searchTerm.trim()) return jobs;
    const term = searchTerm.toLowerCase();
    return jobs.filter(
      (j) =>
        j.title?.toLowerCase().includes(term) ||
        j.company?.toLowerCase().includes(term) ||
        j.location?.toLowerCase().includes(term) ||
        j.description?.toLowerCase().includes(term)
    );
  }, [jobs, searchTerm]);

  return (
    <div className="dashboard-container">
      {/* Global Alerts */}
      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* ========================================================= */}
      {/* RECRUITER VIEW                                            */}
      {/* ========================================================= */}
      {isRecruiter ? (
        <>
          {/* Post New Job Section */}
          <section className="create-section">
            <div className="section-title-wrap">
              <h2>Post a New Job</h2>
              <p className="section-subtitle">Reach qualified candidates by listing your open position</p>
            </div>

            <form onSubmit={handleCreateJob} className="create-form">
              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="title">Job Title *</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={newJob.title}
                    onChange={handleNewChange}
                    placeholder="e.g. Senior Frontend Developer"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label htmlFor="company">Company Name *</label>
                  <input
                    id="company"
                    type="text"
                    name="company"
                    value={newJob.company}
                    onChange={handleNewChange}
                    placeholder="e.g. Stripe, Airbnb"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="location">Location *</label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={newJob.location}
                    onChange={handleNewChange}
                    placeholder="e.g. Remote, San Francisco, CA"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label htmlFor="salary">Salary (Optional)</label>
                  <input
                    id="salary"
                    type="text"
                    name="salary"
                    value={newJob.salary}
                    onChange={handleNewChange}
                    placeholder="e.g. $120,000 - $150,000 / year"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Job Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={newJob.description}
                  onChange={handleNewChange}
                  placeholder="Describe key responsibilities, qualifications, and perks..."
                  rows="4"
                  required
                />
              </div>

              <div>
                <button type="submit" className="btn btn-primary" disabled={createLoading}>
                  {createLoading ? 'Publishing...' : '+ Publish Job Posting'}
                </button>
              </div>
            </form>
          </section>

          {/* Recruiter's Job Postings */}
          <section className="items-section">
            <div className="items-header">
              <h2>Your Job Postings</h2>
              <span className="items-count">({jobs.length})</span>
            </div>

            {loading ? (
              <div className="loading-state">Loading your job postings...</div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <p>You haven't posted any jobs yet. Create your first listing using the form above!</p>
              </div>
            ) : (
              <div className="job-list">
                {jobs.map((job) => {
                  const isEditing = editingId === job._id;
                  const isApplicantsOpen = expandedApplicantsJobId === job._id;
                  const applicantList = job.applicants || [];

                  return (
                    <div key={job._id} className="job-card recruiter-card">
                      {isEditing ? (
                        // Edit Mode
                        <div className="card-edit-mode">
                          <h3>Edit Job Posting</h3>
                          <div className="form-row">
                            <div className="form-group flex-1">
                              <label>Job Title</label>
                              <input
                                type="text"
                                value={editFormData.title}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({ ...prev, title: e.target.value }))
                                }
                                required
                              />
                            </div>
                            <div className="form-group flex-1">
                              <label>Company</label>
                              <input
                                type="text"
                                value={editFormData.company}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({ ...prev, company: e.target.value }))
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group flex-1">
                              <label>Location</label>
                              <input
                                type="text"
                                value={editFormData.location}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({ ...prev, location: e.target.value }))
                                }
                                required
                              />
                            </div>
                            <div className="form-group flex-1">
                              <label>Salary</label>
                              <input
                                type="text"
                                value={editFormData.salary}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({ ...prev, salary: e.target.value }))
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Description</label>
                            <textarea
                              value={editFormData.description}
                              onChange={(e) =>
                                setEditFormData((prev) => ({ ...prev, description: e.target.value }))
                              }
                              rows="4"
                              required
                            />
                          </div>
                          <div className="card-actions">
                            <button
                              onClick={() => handleUpdateJob(job._id)}
                              className="btn btn-success-sm"
                            >
                              Save Changes
                            </button>
                            <button onClick={cancelEdit} className="btn btn-secondary-sm">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div className="job-card-header">
                            <div>
                              <h3 className="job-title">{job.title}</h3>
                              <div className="job-company-row">
                                <span className="job-company">{job.company}</span>
                                <span className="meta-dot">•</span>
                                <span className="job-location">{job.location}</span>
                                {job.salary && (
                                  <>
                                    <span className="meta-dot">•</span>
                                    <span className="job-salary">{job.salary}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <span className="card-date">
                              Posted {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="job-description">{job.description}</p>

                          <div className="job-card-footer">
                            <button
                              type="button"
                              onClick={() => toggleApplicants(job._id)}
                              className={`btn ${isApplicantsOpen ? 'btn-primary-sm' : 'btn-secondary-sm'} applicants-toggle-btn`}
                            >
                              Applicants ({applicantList.length})
                              <span className="toggle-indicator">{isApplicantsOpen ? '▲' : '▼'}</span>
                            </button>

                            <div className="card-actions">
                              <button onClick={() => startEdit(job)} className="btn btn-secondary-sm">
                                Edit
                              </button>
                              <button onClick={() => handleDeleteJob(job._id)} className="btn btn-danger-sm">
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Expanded Applicants Drawer */}
                          {isApplicantsOpen && (
                            <div className="applicants-drawer">
                              <h4 className="applicants-drawer-title">
                                Candidates for {job.title} ({applicantList.length})
                              </h4>
                              {applicantList.length === 0 ? (
                                <p className="applicants-empty">No applicants have applied to this job yet.</p>
                              ) : (
                                <div className="applicants-table-wrapper">
                                  <table className="applicants-table">
                                    <thead>
                                      <tr>
                                        <th>Applicant Name</th>
                                        <th>Email Address</th>
                                        <th>Applied On</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {applicantList.map((app, idx) => (
                                        <tr key={app._id || idx}>
                                          <td className="applicant-name">{app.name}</td>
                                          <td>
                                            <a href={`mailto:${app.email}`} className="applicant-email">
                                              {app.email}
                                            </a>
                                          </td>
                                          <td className="applicant-date">
                                            {new Date(app.appliedAt).toLocaleDateString()} at{' '}
                                            {new Date(app.appliedAt).toLocaleTimeString([], {
                                              hour: '2-digit',
                                              minute: '2-digit',
                                            })}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      ) : (
        /* ========================================================= */
        /* APPLICANT VIEW                                            */
        /* ========================================================= */
        <section className="items-section">
          <div className="applicant-header-card">
            <div>
              <h2>Browse Job Openings</h2>
              <p className="section-subtitle">Discover opportunities and apply with a single click</p>
            </div>
            <div className="search-wrap">
              <input
                type="text"
                placeholder="Search by title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="items-header">
            <h3>Available Listings</h3>
            <span className="items-count">({displayedJobs.length})</span>
          </div>

          {loading ? (
            <div className="loading-state">Loading job openings...</div>
          ) : displayedJobs.length === 0 ? (
            <div className="empty-state">
              <p>
                {searchTerm
                  ? 'No job listings match your search criteria.'
                  : 'No open jobs available at the moment. Please check back later!'}
              </p>
            </div>
          ) : (
            <div className="job-list">
              {displayedJobs.map((job) => {
                const hasApplied = !!job.hasApplied;
                const isApplyingThis = applyingId === job._id;

                return (
                  <div key={job._id} className="job-card applicant-card">
                    <div className="job-card-header">
                      <div>
                        <h3 className="job-title">{job.title}</h3>
                        <div className="job-company-row">
                          <span className="job-company">{job.company}</span>
                          <span className="meta-dot">•</span>
                          <span className="job-location">{job.location}</span>
                          {job.salary && (
                            <>
                              <span className="meta-dot">•</span>
                              <span className="job-salary">{job.salary}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="card-date">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="job-description">{job.description}</p>

                    <div className="job-card-footer">
                      <div className="applicant-meta">
                        <span className="applicant-count-chip">
                          {job.applicantCount || 0}{' '}
                          {job.applicantCount === 1 ? 'applicant' : 'applicants'}
                        </span>
                      </div>

                      <div className="card-actions">
                        {hasApplied ? (
                          <span className="badge-applied">✓ Applied</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApply(job._id)}
                            className="btn btn-primary"
                            disabled={isApplyingThis}
                          >
                            {isApplyingThis ? 'Applying...' : 'Apply Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Dashboard;
