// client/src/pages/ScoreHistory.jsx
// Dedicated page to display all quiz attempt records, scores, and statistics for the user

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ScoreHistory = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch all scores for the logged-in user
  const fetchScores = async () => {
    try {
      const res = await API.get('/scores');
      setScores(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load score history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  // Delete a score attempt
  const handleDeleteScore = async (id) => {
    if (!window.confirm('Delete this score record from your history?')) return;

    try {
      await API.delete(`/scores/${id}`);
      setScores((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete score record.');
    }
  };

  // Compute summary stats
  const totalAttempts = scores.length;
  const avgPercentage =
    totalAttempts > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.percentage, 0) / totalAttempts)
      : 0;
  const highestPercentage =
    totalAttempts > 0 ? Math.max(...scores.map((s) => s.percentage)) : 0;

  return (
    <div className="history-container">
      <div className="history-header">
        <div>
          <h2>Your Score History</h2>
          <p className="text-muted">
            Track your performance, review past attempts, and retake quizzes to improve.
          </p>
        </div>
        <Link to="/" className="btn btn-primary">
          📝 Explore Quizzes
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Summary Metrics */}
      {totalAttempts > 0 && (
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Quizzes Completed</span>
            <span className="stat-value">{totalAttempts}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{avgPercentage}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Highest Score</span>
            <span className="stat-value text-success">{highestPercentage}%</span>
          </div>
        </div>
      )}

      {/* Scores Table / List */}
      {loading ? (
        <div className="loading-state">Loading your score history...</div>
      ) : scores.length === 0 ? (
        <div className="empty-state">
          <h3>No Quiz Attempts Yet</h3>
          <p className="text-muted mb-4">
            You haven't completed any quizzes yet. Pick a quiz and test your skills!
          </p>
          <Link to="/" className="btn btn-primary">
            Start a Quiz Now
          </Link>
        </div>
      ) : (
        <div className="history-table-card">
          <table className="history-table">
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Date Attempted</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((record) => {
                let badgeClass = 'status-pending';
                if (record.percentage >= 80) badgeClass = 'status-done';
                else if (record.percentage >= 60) badgeClass = 'status-in-progress';

                return (
                  <tr key={record._id}>
                    <td className="quiz-name-cell">
                      <strong>{record.quizTitle}</strong>
                    </td>
                    <td>
                      <span className="score-count">
                        {record.score} / {record.totalQuestions}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${badgeClass}`}>
                        {record.percentage}%
                      </span>
                    </td>
                    <td className="text-muted">
                      {new Date(record.createdAt).toLocaleDateString()} at{' '}
                      {new Date(record.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="text-right">
                      <div className="table-actions">
                        {record.quiz && (
                          <button
                            onClick={() => navigate(`/quiz/${record.quiz}`)}
                            className="btn btn-primary-sm"
                            title="Retake Quiz"
                          >
                            Retake
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteScore(record._id)}
                          className="btn btn-danger-sm"
                          title="Delete Record"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScoreHistory;

