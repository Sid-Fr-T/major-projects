// client/src/pages/Dashboard.jsx
// Main quiz dashboard: browse quizzes, start taking a quiz, or create a custom quiz

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const emptyQuestion = () => ({
  text: '',
  options: ['', '', '', ''],
  correctAnswer: '',
});

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Form state for creating a new quiz
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    questions: [emptyQuestion()],
  });

  const navigate = useNavigate();

  // Fetch all available quizzes
  const fetchQuizzes = async () => {
    try {
      const res = await API.get('/quizzes');
      setQuizzes(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load quizzes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Handle Quiz general info change
  const handleQuizInfoChange = (e) => {
    const { name, value } = e.target;
    setNewQuiz((prev) => ({ ...prev, [name]: value }));
  };

  // Handle question text change
  const handleQuestionTextChange = (qIndex, text) => {
    setNewQuiz((prev) => {
      const questions = [...prev.questions];
      questions[qIndex] = { ...questions[qIndex], text };
      return { ...prev, questions };
    });
  };

  // Handle question option change
  const handleOptionChange = (qIndex, optIndex, value) => {
    setNewQuiz((prev) => {
      const questions = [...prev.questions];
      const options = [...questions[qIndex].options];
      const prevOptVal = options[optIndex];
      options[optIndex] = value;

      // If this option was selected as correctAnswer, update it
      let correctAnswer = questions[qIndex].correctAnswer;
      if (correctAnswer === prevOptVal) {
        correctAnswer = value;
      }

      questions[qIndex] = { ...questions[qIndex], options, correctAnswer };
      return { ...prev, questions };
    });
  };

  // Handle correct answer selection
  const handleCorrectAnswerChange = (qIndex, value) => {
    setNewQuiz((prev) => {
      const questions = [...prev.questions];
      questions[qIndex] = { ...questions[qIndex], correctAnswer: value };
      return { ...prev, questions };
    });
  };

  // Add question field block
  const addQuestionField = () => {
    setNewQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, emptyQuestion()],
    }));
  };

  // Remove question field block
  const removeQuestionField = (qIndex) => {
    if (newQuiz.questions.length <= 1) {
      alert('A quiz must have at least one question.');
      return;
    }
    setNewQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== qIndex),
    }));
  };

  // Submit new quiz
  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!newQuiz.title.trim()) {
      alert('Please provide a quiz title.');
      return;
    }

    // Validate questions
    for (let i = 0; i < newQuiz.questions.length; i++) {
      const q = newQuiz.questions[i];
      if (!q.text.trim()) {
        alert(`Question #${i + 1} is missing question text.`);
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) {
          alert(`Question #${i + 1}, Option ${String.fromCharCode(65 + j)} cannot be empty.`);
          return;
        }
      }
      if (!q.correctAnswer.trim()) {
        alert(`Question #${i + 1} must have a designated correct answer.`);
        return;
      }
    }

    setCreateLoading(true);
    try {
      await API.post('/quizzes', newQuiz);
      alert('Quiz created successfully!');
      setNewQuiz({
        title: '',
        description: '',
        questions: [emptyQuestion()],
      });
      setShowCreateForm(false);
      fetchQuizzes();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create quiz.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Delete a quiz
  const handleDeleteQuiz = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await API.delete(`/quizzes/${id}`);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete quiz.');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Top Banner */}
      <section className="dashboard-banner">
        <div>
          <h2>Available Quizzes</h2>
          <p className="text-muted">
            Choose a quiz to test your knowledge, submit answers to see your score, and review your history.
          </p>
        </div>
        <div className="banner-actions">
          <Link to="/history" className="btn btn-secondary">
            📊 View Score History
          </Link>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-primary"
          >
            {showCreateForm ? '✕ Close Form' : '+ Create Custom Quiz'}
          </button>
        </div>
      </section>

      {/* Collapsible Create Quiz Section */}
      {showCreateForm && (
        <section className="create-section">
          <h2>Create a New Quiz</h2>
          <p className="text-muted mb-4">
            Add a quiz title, description, and multiple-choice questions with 4 options each.
          </p>

          <form onSubmit={handleCreateSubmit} className="create-form">
            <div className="form-group">
              <label htmlFor="quiz-title">Quiz Title *</label>
              <input
                id="quiz-title"
                type="text"
                name="title"
                value={newQuiz.title}
                onChange={handleQuizInfoChange}
                placeholder="e.g. Python Basics & Data Structures"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quiz-desc">Quiz Description (optional)</label>
              <textarea
                id="quiz-desc"
                name="description"
                value={newQuiz.description}
                onChange={handleQuizInfoChange}
                placeholder="Brief summary of what this quiz covers..."
                rows="2"
              ></textarea>
            </div>

            <div className="questions-form-list">
              <h3>Questions ({newQuiz.questions.length})</h3>

              {newQuiz.questions.map((q, qIdx) => (
                <div key={qIdx} className="question-builder-card">
                  <div className="question-builder-header">
                    <h4>Question #{qIdx + 1}</h4>
                    {newQuiz.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestionField(qIdx)}
                        className="btn btn-danger-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Question Text *</label>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                      placeholder="e.g. What is the keyword to define a function in Python?"
                      required
                    />
                  </div>

                  <div className="options-grid">
                    {q.options.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      return (
                        <div key={oIdx} className="form-group option-input-group">
                          <label>Option {letter} *</label>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(qIdx, oIdx, e.target.value)
                            }
                            placeholder={`Option ${letter}`}
                            required
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="form-group">
                    <label>Correct Answer *</label>
                    <select
                      value={q.correctAnswer}
                      onChange={(e) => handleCorrectAnswerChange(qIdx, e.target.value)}
                      required
                    >
                      <option value="">-- Select Correct Answer --</option>
                      {q.options.map((opt, oIdx) => {
                        const letter = String.fromCharCode(65 + oIdx);
                        return (
                          <option key={oIdx} value={opt} disabled={!opt.trim()}>
                            {letter}: {opt || '(Fill option text first)'}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addQuestionField}
                className="btn btn-secondary-sm add-question-btn"
              >
                + Add Another Question
              </button>
            </div>

            <div className="create-form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createLoading}
              >
                {createLoading ? 'Creating Quiz...' : 'Save & Publish Quiz'}
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
        </section>
      )}

      {/* Quizzes List Section */}
      <section className="items-section">
        <div className="items-header">
          <h2>All Quizzes</h2>
          <span className="items-count">({quizzes.length} available)</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading quizzes...</div>
        ) : quizzes.length === 0 ? (
          <div className="empty-state">
            <p>No quizzes available yet. Create your first quiz using the button above!</p>
          </div>
        ) : (
          <div className="card-grid">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="quiz-card">
                <div className="card-header">
                  <h3 className="card-title">{quiz.title}</h3>
                  <span className="status-badge status-in-progress">
                    {quiz.totalQuestions} Questions
                  </span>
                </div>

                <p className="card-description">
                  {quiz.description || 'No description provided.'}
                </p>

                <div className="card-footer">
                  <span className="card-date">
                    Added: {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                  <div className="card-actions">
                    <button
                      onClick={() => navigate(`/quiz/${quiz._id}`)}
                      className="btn btn-primary-sm"
                    >
                      Take Quiz →
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz._id, quiz.title)}
                      className="btn btn-danger-sm"
                      title="Delete Quiz"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
