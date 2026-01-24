// src/services/db.js
// This file acts as a mock database fetcher using local JSON data.

// ------------------- Theory/Quiz Content Data -------------------
// NOTE: This array is your MongoDB content collection. 
// You can expand this array with more levels and languages.

const CONTENT_DATA = [
  // --- JAVASCRIPT LEVEL 1 ---
  {
    "languageKey": "javascript",
    "levelId": "js_01_variables",
    "levelTitle": "Level 1: Variables & Data Types",
    "theoryTimeSec": 60, // Reading time in seconds
    "theoryContent": "<h2>Variables & Data Types (JS)</h2><p>In JavaScript, variables are used to store data. The keywords <code>let</code> and <code>const</code> are standard today.</p><ul><li>**`let`**: Value can change.</li><li>**`const`**: Value must remain constant. Always prefer `const` unless you need to reassign.</li></ul><p>Common data types include: **String**, **Number**, and **Boolean**.</p>",
    "quizQuestions": [
      {
        "id": "js_q1_1",
        "question": "Which keyword should be used for a variable that will NOT be reassigned?",
        "options": ["var", "let", "const", "mutable"],
        "correctAnswer": "const",
        "xpReward": 10
      },
      {
        "id": "js_q1_2",
        "question": "What data type is the value `42`?",
        "options": ["String", "Number", "Boolean", "Object"],
        "correctAnswer": "Number",
        "xpReward": 10
      }
    ]
  },
  // --- PYTHON LEVEL 1 ---
  {
    "languageKey": "python",
    "levelId": "py_01_syntax_print",
    "levelTitle": "Level 1: Syntax and Print Function",
    "theoryTimeSec": 45,
    "theoryContent": "<h2>Python Syntax</h2><p>Python code blocks are defined by **indentation** (usually 4 spaces), not curly braces. The main output function is <code>print()</code>.</p><pre><code># This is a comment\nprint(\"Hello\")</code></pre><p>Python variables don't require explicit declaration keywords.</p>",
    "quizQuestions": [
      {
        "id": "py_q1_1",
        "question": "What defines a code block in Python?",
        "options": ["Curly braces {}", "Semicolons ;", "Indentation (whitespace)", "The 'block' keyword"],
        "correctAnswer": "Indentation (whitespace)",
        "xpReward": 10
      },
      {
        "id": "py_q1_2",
        "question": "Which function is used for output in Python?",
        "options": ["display()", "console.log()", "output()", "print()"],
        "correctAnswer": "print()",
        "xpReward": 10
      }
    ]
  }
  // Add all other levels here...
];

/**
 * Mocks fetching level content from the database.
 */
export function getLevelContent(lang, levelId) {
    return CONTENT_DATA.find(c => c.languageKey === lang && c.levelId === levelId);
}

// NOTE: You will need to implement actual MongoDB functions 
// using Firestore/Mongoose for real-world persistence.
export async function saveUserProgress(uid, progressData) {
    // Placeholder for actual database save logic
    console.log("MOCK DB SAVE:", progressData);
}

export async function fetchUserProgress(uid) {
    // Placeholder for actual database fetch logic
    return { completedLevels: {}, totalXP: 0 };
}