# Questions JSON Files Structure

## Overview

Questions are now stored in separate JSON files in the `data/questions/` directory, completely separated from the lesson/theory content in `levelData.js`.

## File Structure

```
data/
  questions/
    javascript.json  - All JavaScript questions
    python.json     - All Python questions
    java.json       - All Java questions
    cpp.json        - All C++ questions
```

## JSON Format

Each question file contains an array of question objects:

```json
[
  {
    "levelId": "js_01_variables",
    "question": "Which keyword should be used for a value that will NOT be reassigned?",
    "options": ["let", "var", "const", "value"],
    "correctAnswer": "const",
    "explanation": "",
    "xpReward": 10,
    "order": 0
  }
]
```

### Field Descriptions

- **levelId** (string, required): The level identifier (e.g., "js_01_variables", "py_02_data_types")
- **question** (string, required): The question text
- **options** (array, required): Array of answer options (2-6 items)
- **correctAnswer** (string, required): The correct answer (must match one of the options)
- **explanation** (string, optional): Explanation for the answer
- **xpReward** (number, optional): XP points awarded (default: 10)
- **order** (number, optional): Display order within the level (default: 0)

## Extracting Questions

To extract questions from `levelData.js` and create JSON files:

```bash
npm run extract-questions
```

This will:
1. Read all questions from `src/data/levelData.js`
2. Create separate JSON files for each language in `data/questions/`
3. Organize questions by `levelId`

## Seeding Database

The seed script now reads questions from JSON files:

```bash
npm run seed
```

This will:
1. Load questions from `data/questions/*.json`
2. Load lessons/theory from `src/data/levelData.js`
3. Create relationships between lessons and questions in MongoDB

## Adding New Questions

### Option 1: Add to JSON files directly

1. Open the appropriate language file (e.g., `data/questions/javascript.json`)
2. Add a new question object following the format above
3. Run `npm run seed` to update the database

### Option 2: Extract from levelData.js

1. Add questions to `src/data/levelData.js` in the `quiz` array
2. Run `npm run extract-questions` to regenerate JSON files
3. Run `npm run seed` to update the database

## Benefits of Separation

✅ **Questions are independent** - Can be updated without touching lesson content  
✅ **Easier to manage** - Questions in one place, theory in another  
✅ **Better for APIs** - Can fetch questions separately from lessons  
✅ **Version control** - Clear separation of concerns in git  
✅ **Scalability** - Easy to add more questions or languages

## Example: Fetching Questions via API

```javascript
// Get all questions for a specific level
fetch('/api/questions?languageKey=javascript&levelId=js_01_variables')
  .then(res => res.json())
  .then(questions => {
    // Use questions
  });

// Get all questions for a language
fetch('/api/questions?languageKey=javascript')
  .then(res => res.json())
  .then(questions => {
    // Use questions
  });
```

