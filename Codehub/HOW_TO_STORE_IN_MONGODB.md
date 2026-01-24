# How to Store Data in MongoDB - Your Structure

## Your Current MongoDB Structure

Based on your MongoDB Atlas data, your lessons are stored with this structure:

```json
{
  "_id": ObjectId("..."),
  "levelNumber": 1,
  "title": "Introduction to Java",
  "description": "Basics, history, features of Java",
  "lessonTitle": "What is Java?",
  "theory": "Java is a high-level, object-oriented programming language...",
  "mcqs": [
    {
      "question": "JDK stands for?",
      "options": ["Java Development Kit", "Java Debug Kit", "Java Design Kit", "Java Data Kit"],
      "answer": 0,
      "explanations": ["Explanation 1", "Explanation 2", "Explanation 3", "Explanation 4"]
    }
  ]
}
```

## Key Differences from Standard Structure

1. **`levelNumber`** instead of `levelId` (numeric, not string)
2. **`lessonTitle`** separate from `title`
3. **`mcqs`** array embedded directly in the lesson document
4. **`answer`** is an index (0, 1, 2, 3) not the answer text

## How to Store Data

### Option 1: Using the Seed Script (Recommended)

I've created a seed script that matches your structure:

```bash
npm run seed-lessons
```

This will:
1. ✅ Load questions from `data/questions/*.json`
2. ✅ Load lessons from `src/data/levelData.js`
3. ✅ Convert questions to MCQ format with answer as index
4. ✅ Store lessons with embedded MCQs matching your structure

### Option 2: Manual Insert via MongoDB Atlas

1. Go to MongoDB Atlas → Data Explorer
2. Select your `CodeHub` database → `lessons` collection
3. Click "INSERT DOCUMENT"
4. Use this format:

```json
{
  "languageKey": "java",
  "levelNumber": 1,
  "title": "Introduction to Java",
  "description": "Basics, history, features of Java",
  "lessonTitle": "What is Java?",
  "theory": "Java is a high-level, object-oriented programming language...",
  "mcqs": [
    {
      "question": "Who created Java?",
      "options": ["James Gosling", "Dennis Ritchie", "Bjarne Stroustrup", "Guido van Rossum"],
      "answer": 0,
      "explanations": []
    }
  ],
  "isActive": true
}
```

### Option 3: Using the API

```javascript
// POST /api/lessons
fetch('http://localhost:5000/api/lessons', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    languageKey: 'java',
    levelNumber: 1,
    title: 'Introduction to Java',
    description: 'Basics, history, features of Java',
    lessonTitle: 'What is Java?',
    theory: 'Java is a high-level...',
    mcqs: [
      {
        question: 'Who created Java?',
        options: ['James Gosling', 'Dennis Ritchie', 'Bjarne Stroustrup', 'Guido van Rossum'],
        answer: 0,
        explanations: []
      }
    ]
  })
});
```

## MCQ Format

Each MCQ in the `mcqs` array should have:

- **`question`** (string): The question text
- **`options`** (array): Array of answer options (usually 4)
- **`answer`** (number): Index of correct answer (0, 1, 2, or 3)
- **`explanations`** (array): Optional array of explanations

### Example MCQ:

```json
{
  "question": "JDK stands for?",
  "options": [
    "Java Development Kit",
    "Java Debug Kit", 
    "Java Design Kit",
    "Java Data Kit"
  ],
  "answer": 0,
  "explanations": [
    "Correct! JDK stands for Java Development Kit",
    "Incorrect",
    "Incorrect", 
    "Incorrect"
  ]
}
```

## Updated Model

The `Lesson` model has been updated to match your structure:

```javascript
{
  languageKey: String,      // e.g., "java", "javascript"
  levelNumber: Number,      // e.g., 1, 2, 3
  title: String,             // e.g., "Introduction to Java"
  description: String,       // e.g., "Basics, history, features"
  lessonTitle: String,       // e.g., "What is Java?"
  theory: String,            // Full theory content
  mcqs: [                    // Embedded MCQs array
    {
      question: String,
      options: [String],
      answer: Number,         // Index (0, 1, 2, 3)
      explanations: [String]
    }
  ],
  isActive: Boolean
}
```

## API Endpoints

### Get all lessons for a language
```
GET /api/lessons?languageKey=java
```

### Get lesson by level number
```
GET /api/lessons/java/level/1
```

### Create a new lesson
```
POST /api/lessons
```

### Update a lesson
```
PUT /api/lessons/:id
```

## Converting Questions from JSON to MCQ Format

If you have questions in JSON format (from `data/questions/*.json`), the seed script automatically converts them:

**From JSON:**
```json
{
  "question": "Who created Java?",
  "options": ["James Gosling", "Dennis Ritchie", ...],
  "correctAnswer": "James Gosling"
}
```

**To MCQ:**
```json
{
  "question": "Who created Java?",
  "options": ["James Gosling", "Dennis Ritchie", ...],
  "answer": 0  // Index of "James Gosling" in options array
}
```

## Quick Start

1. **Extract questions** (if not done):
   ```bash
   npm run extract-questions
   ```

2. **Seed lessons with MCQs**:
   ```bash
   npm run seed-lessons
   ```

3. **Verify in MongoDB Atlas**:
   - Go to Data Explorer
   - Check `CodeHub` → `lessons` collection
   - You should see lessons with embedded `mcqs` arrays

## Troubleshooting

### Questions not showing
- ✅ Ensure `data/questions/*.json` files exist
- ✅ Run `npm run extract-questions` first
- ✅ Check that `levelId` in JSON matches the level structure

### Answer index incorrect
- ✅ The `answer` field must be the index (0-based) of the correct option
- ✅ Example: If correct answer is at position 2, use `answer: 2`

### Level number mismatch
- ✅ The seed script extracts level number from `order` field or levelId
- ✅ You can manually set `levelNumber` in the seed script if needed


