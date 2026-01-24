// Script to extract questions from levelData.js and create JSON files
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function extractQuestions() {
  try {
    // Dynamically import levelData
    const levelDataModule = await import('../../src/data/levelData.js');
    const LEVEL_DATA = levelDataModule.LEVEL_DATA;

    // Create questions directory if it doesn't exist
    const questionsDir = join(__dirname, '../../data/questions');
    mkdirSync(questionsDir, { recursive: true });

    // Extract questions for each language
    for (const [langKey, levels] of Object.entries(LEVEL_DATA)) {
      const questions = [];
      
      for (const [levelId, levelData] of Object.entries(levels)) {
        if (levelData.quiz && Array.isArray(levelData.quiz)) {
          levelData.quiz.forEach((q, index) => {
            questions.push({
              levelId: levelId,
              question: q.question,
              options: q.options,
              correctAnswer: q.answer,
              explanation: q.explanations ? JSON.stringify(q.explanations) : '',
              xpReward: 10,
              order: index
            });
          });
        }
      }
      
      // Write to JSON file
      const filePath = join(questionsDir, `${langKey}.json`);
      writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf-8');
      console.log(`✅ Created ${filePath} with ${questions.length} questions`);
    }

    console.log('\n🎉 All question files created successfully!');
  } catch (error) {
    console.error('❌ Error extracting questions:', error);
    process.exit(1);
  }
}

extractQuestions();

