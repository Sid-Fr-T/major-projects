// server/src/controllers/quizController.js
// Handles fetching quizzes, retrieving quiz questions, submitting answers, scoring, and quiz creation

import mongoose from 'mongoose';
import Quiz from '../models/Quiz.js';
import Score from '../models/Score.js';

/**
 * @desc    Get all available quizzes
 * @route   GET /api/quizzes
 * @access  Private
 */
export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });

    // Format output with total question counts
    const formatted = quizzes.map((quiz) => ({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      totalQuestions: quiz.questions.length,
      createdBy: quiz.createdBy,
      createdAt: quiz.createdAt,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error(`Get Quizzes Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving quizzes', error: error.message });
  }
};

/**
 * @desc    Get a single quiz by ID with questions (correct answers omitted for test taking)
 * @route   GET /api/quizzes/:id
 * @access  Private
 */
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Quiz not found (invalid ID format)' });
    }

    const quiz = await Quiz.findById(id).lean();

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Exclude correctAnswer from response to prevent client-side inspection cheating
    const sanitizedQuestions = quiz.questions.map((q) => ({
      _id: q._id,
      text: q.text,
      options: q.options,
    }));

    return res.status(200).json({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questions: sanitizedQuestions,
      totalQuestions: quiz.questions.length,
      createdAt: quiz.createdAt,
    });
  } catch (error) {
    console.error(`Get Quiz Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving quiz', error: error.message });
  }
};

/**
 * @desc    Submit answers for a quiz, compute score, record history, and return results
 * @route   POST /api/quizzes/:id/submit
 * @access  Private
 */
export const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // Map: { [questionId]: selectedOptionString }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Quiz not found (invalid ID format)' });
    }

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const submittedAnswers = answers || {};
    let score = 0;

    const breakdown = quiz.questions.map((q) => {
      const qIdStr = q._id.toString();
      const selected = submittedAnswers[qIdStr] !== undefined ? submittedAnswers[qIdStr] : null;
      const isCorrect = selected === q.correctAnswer;

      if (isCorrect) {
        score += 1;
      }

      return {
        questionId: q._id,
        text: q.text,
        options: q.options,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    // Save score attempt to history
    const scoreRecord = await Score.create({
      user: req.user._id,
      quiz: quiz._id,
      quizTitle: quiz.title,
      score,
      totalQuestions,
      percentage,
    });

    return res.status(200).json({
      message: 'Quiz submitted successfully',
      scoreRecord,
      breakdown,
    });
  } catch (error) {
    console.error(`Submit Quiz Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error evaluating quiz', error: error.message });
  }
};

/**
 * @desc    Create a new quiz with questions
 * @route   POST /api/quizzes
 * @access  Private
 */
export const createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Quiz title is required' });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one question' });
    }

    // Validate each question structure
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text || !q.text.trim()) {
        return res.status(400).json({ message: `Question #${i + 1} must have question text` });
      }

      if (!Array.isArray(q.options) || q.options.length !== 4) {
        return res.status(400).json({ message: `Question #${i + 1} must have exactly 4 options` });
      }

      const hasEmptyOption = q.options.some((opt) => !opt || !opt.trim());
      if (hasEmptyOption) {
        return res.status(400).json({ message: `Question #${i + 1} cannot have blank options` });
      }

      if (!q.correctAnswer || !q.correctAnswer.trim()) {
        return res.status(400).json({ message: `Question #${i + 1} must specify a correct answer` });
      }

      if (!q.options.includes(q.correctAnswer.trim())) {
        return res.status(400).json({
          message: `Question #${i + 1} correct answer must match one of the 4 options`,
        });
      }
    }

    const quiz = await Quiz.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      questions: questions.map((q) => ({
        text: q.text.trim(),
        options: q.options.map((opt) => opt.trim()),
        correctAnswer: q.correctAnswer.trim(),
      })),
      createdBy: req.user._id,
    });

    return res.status(201).json(quiz);
  } catch (error) {
    console.error(`Create Quiz Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating quiz', error: error.message });
  }
};

/**
 * @desc    Delete a quiz by ID
 * @route   DELETE /api/quizzes/:id
 * @access  Private
 */
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Quiz not found (invalid ID format)' });
    }

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await quiz.deleteOne();

    return res.status(200).json({ message: 'Quiz deleted successfully', id });
  } catch (error) {
    console.error(`Delete Quiz Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting quiz', error: error.message });
  }
};

