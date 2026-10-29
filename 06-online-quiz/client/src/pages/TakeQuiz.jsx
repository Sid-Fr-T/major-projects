// client/src/pages/TakeQuiz.jsx
// Interactive quiz taking interface with radio option inputs, scoring, and breakdown review

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected answers: { [questionId]: selectedOptionString }
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Result state after submission: { scoreRecord, breakdown }
  const [result, setResult] = useState(null);

  // Load quiz questions
  useEffect(() => {
    let ignore = false;
    setLoading(true);

    API.get(`/quizzes/${id}`)
      .then((res) => {
        if (!ignore) {
          setQuiz(res.data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load quiz details.');
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
  }, [id]);

  // Handle selecting an option
  const handleSelectOption = (questionId, option) => {
    if (result) return; // Prevent changing after submit
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // Submit answers
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quiz || submitting) return;

    const totalQuestions = quiz.questions.length;
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to submit now?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      const res = await API.post(`/quizzes/${id}/submit`, { answers });
      setResult(res.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  // Retake quiz
  const handleRetake = () => {
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="take-quiz-container">
        <div className="loading-state">Loading quiz questions...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="take-quiz-container">
        <div className="alert alert-error">{error || 'Quiz not found'}</div>
        <Link to="/" className="btn btn-secondary">
          ← Back to Quizzes
        </Link>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;

  return (
    <div className="take-quiz-container">
      {/* Quiz Header */}
      <div className="quiz-taking-header">
        <Link to="/" className="back-link">
          ← Back to Quizzes
        </Link>
        <h2>{quiz.title}</h2>
        {quiz.description && <p className="text-muted">{quiz.description}</p>}
      </div>

      {/* RESULT VIEW (shown after submit) */}
      {result ? (
        <section className="quiz-result-section">
          <div className="score-hero-card">
            <h3>Quiz Completed!</h3>
            <div className="score-display">
              <span className="score-fraction">
                {result.scoreRecord.score} / {result.scoreRecord.totalQuestions}
              </span>
              <span className="score-percent">
                ({result.scoreRecord.percentage}%)
              </span>
            </div>

            <div className="result-badge-wrap">
              {result.scoreRecord.percentage === 100 && (
                <span className="status-badge status-done">🏆 Perfect Score! Outstanding!</span>
              )}
              {result.scoreRecord.percentage >= 80 && result.scoreRecord.percentage < 100 && (
                <span className="status-badge status-done">🌟 Great Job! Excellent Performance!</span>
              )}
              {result.scoreRecord.percentage >= 60 && result.scoreRecord.percentage < 80 && (
                <span className="status-badge status-in-progress">👍 Good Effort! You Passed!</span>
              )}
              {result.scoreRecord.percentage < 60 && (
                <span className="status-badge status-pending">📚 Keep Practicing! Review answers below.</span>
              )}
            </div>

            <div className="result-actions">
              <button onClick={handleRetake} className="btn btn-primary">
                🔄 Retake Quiz
              </button>
              <button
                onClick={() => navigate('/history')}
                className="btn btn-secondary"
              >
                📊 View Score History
              </button>
              <button onClick={() => navigate('/')} className="btn btn-secondary">
                🏠 Back to Quizzes
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="breakdown-container">
            <h3>Answer Review</h3>
            <div className="breakdown-list">
              {result.breakdown.map((item, idx) => (
                <div
                  key={item.questionId}
                  className={`breakdown-card ${item.isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <div className="breakdown-header">
                    <span className="breakdown-qnum">Question {idx + 1}</span>
                    <span
                      className={`breakdown-status ${
                        item.isCorrect ? 'badge-correct' : 'badge-incorrect'
                      }`}
                    >
                      {item.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>

                  <p className="breakdown-text">{item.text}</p>

                  <div className="breakdown-answers">
                    <div className="answer-row">
                      <span className="answer-label">Your Answer:</span>
                      <span
                        className={`answer-val ${
                          item.isCorrect ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {item.selectedAnswer !== null ? item.selectedAnswer : '(Skipped)'}
                      </span>
                    </div>

                    {!item.isCorrect && (
                      <div className="answer-row">
                        <span className="answer-label">Correct Answer:</span>
                        <span className="answer-val text-success">
                          {item.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* QUIZ TAKING FORM */
        <form onSubmit={handleSubmit} className="quiz-form">
          <div className="progress-banner">
            <span>
              Progress: <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions answered
            </span>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${(answeredCount / totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="questions-list">
            {quiz.questions.map((q, qIdx) => {
              const selectedOpt = answers[q._id];

              return (
                <div key={q._id} className="quiz-question-card">
                  <div className="question-header">
                    <span className="question-number">Question {qIdx + 1} of {totalQuestions}</span>
                  </div>

                  <h3 className="question-title">{q.text}</h3>

                  <div className="options-container">
                    {q.options.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isSelected = selectedOpt === opt;

                      return (
                        <label
                          key={oIdx}
                          className={`option-choice-label ${isSelected ? 'selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name={`question-${q._id}`}
                            value={opt}
                            checked={isSelected}
                            onChange={() => handleSelectOption(q._id, opt)}
                            className="option-radio-input"
                          />
                          <span className="option-letter">{letter}</span>
                          <span className="option-text">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="quiz-submit-bar">
            <button
              type="submit"
              className="btn btn-primary btn-submit-quiz"
              disabled={submitting}
            >
              {submitting ? 'Submitting Answers...' : 'Submit Quiz →'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TakeQuiz;

