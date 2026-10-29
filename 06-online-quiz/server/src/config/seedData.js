// server/src/config/seedData.js
// Sample quizzes with 5 questions each (text, 4 options, correct answer)
import Quiz from '../models/Quiz.js';

export const sampleQuizzes = [
  {
    title: 'JavaScript Fundamentals',
    description: 'Test your core understanding of JavaScript variables, data types, functions, and array methods.',
    questions: [
      {
        text: 'What will typeof NaN return in JavaScript?',
        options: ['"number"', '"NaN"', '"undefined"', '"object"'],
        correctAnswer: '"number"',
      },
      {
        text: 'Which keyword declares a block-scoped variable that cannot be reassigned?',
        options: ['const', 'let', 'var', 'immutable'],
        correctAnswer: 'const',
      },
      {
        text: 'Which array method returns a new array with all elements that pass the provided condition?',
        options: ['filter()', 'map()', 'find()', 'forEach()'],
        correctAnswer: 'filter()',
      },
      {
        text: 'What is the boolean evaluation of an empty string ("") in JavaScript?',
        options: ['false', 'true', 'undefined', 'null'],
        correctAnswer: 'false',
      },
      {
        text: 'Which method converts a JavaScript object into a JSON-formatted string?',
        options: ['JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'JSON.encode()'],
        correctAnswer: 'JSON.stringify()',
      },
    ],
  },
  {
    title: 'Web Development & React',
    description: 'Assess your knowledge of modern web development standards, HTTP, and React basics.',
    questions: [
      {
        text: 'Which React hook is used to perform side effects such as data fetching or subscriptions?',
        options: ['useEffect', 'useState', 'useMemo', 'useRef'],
        correctAnswer: 'useEffect',
      },
      {
        text: 'What does JSX stand for in React development?',
        options: [
          'JavaScript XML',
          'JavaScript Extension',
          'JSON Syntax XML',
          'Java Standard X-Markup',
        ],
        correctAnswer: 'JavaScript XML',
      },
      {
        text: 'What is the Virtual DOM in React?',
        options: [
          'A lightweight in-memory representation of the real DOM',
          'A direct replacement for the browser DOM',
          'A server-side database cache',
          'A CSS styling engine',
        ],
        correctAnswer: 'A lightweight in-memory representation of the real DOM',
      },
      {
        text: 'Which HTTP status code signifies that a request was successful?',
        options: ['200 OK', '404 Not Found', '500 Internal Server Error', '301 Moved Permanently'],
        correctAnswer: '200 OK',
      },
      {
        text: 'In React, which unique prop must be provided when rendering elements in a list?',
        options: ['key', 'id', 'ref', 'index'],
        correctAnswer: 'key',
      },
    ],
  },
];

/**
 * Automatically seeds the sample quizzes if no quizzes exist in the database.
 */
export const autoSeedQuizzes = async () => {
  try {
    const count = await Quiz.countDocuments();
    if (count === 0) {
      console.log('No quizzes found. Seeding initial 2 sample quizzes...');
      await Quiz.insertMany(sampleQuizzes);
      console.log('Sample quizzes seeded successfully.');
    }
  } catch (error) {
    console.error(`Error auto-seeding quizzes: ${error.message}`);
  }
};
