// Seed script to store lessons with embedded MCQs matching your MongoDB structure
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import Lesson from '../models/Lesson.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sakupatil2004_db_user:<db_password>@cluster0.f23zbb5.mongodb.net/CodeHub?retryWrites=true&w=majority&appName=Cluster0';

async function seedLessons() {
  try {
    // Load questions from JSON files
    console.log('📦 Loading questions from JSON files...');
    const questionsData = {};
    const questionsDir = join(__dirname, '../../data/questions');
    
    const languages = ['javascript', 'python', 'java', 'cpp'];
    for (const lang of languages) {
      try {
        const filePath = join(questionsDir, `${lang}.json`);
        const fileContent = readFileSync(filePath, 'utf-8');
        questionsData[lang] = JSON.parse(fileContent);
        console.log(`✅ Loaded ${questionsData[lang].length} questions for ${lang}`);
      } catch (error) {
        console.warn(`⚠️  Could not load questions for ${lang}: ${error.message}`);
        questionsData[lang] = [];
      }
    }

    // Import level data for lessons (theory content)
    console.log('\n📦 Loading lesson data from levelData.js...');
    let LEVEL_DATA;
    try {
      const levelDataModule = await import('../../src/data/levelData.js');
      LEVEL_DATA = levelDataModule.LEVEL_DATA;
      console.log('✅ Lesson data loaded successfully');
    } catch (error) {
      console.error('❌ Error importing levelData:', error);
      console.log('Please ensure src/data/levelData.js exists and exports LEVEL_DATA');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing lessons (optional - comment out if you want to keep existing data)
    console.log('\n🗑️  Clearing existing lessons...');
    await Lesson.deleteMany({});
    console.log('✅ Existing lessons cleared');

    // Seed Lessons with embedded MCQs
    let totalLessons = 0;
    let totalMCQs = 0;

    for (const [langKey, levels] of Object.entries(LEVEL_DATA)) {
      console.log(`\n📚 Processing ${langKey}...`);
      
      // Get questions for this language
      const langQuestions = questionsData[langKey] || [];
      
      // Group questions by levelId
      const questionsByLevel = {};
      langQuestions.forEach(q => {
        if (!questionsByLevel[q.levelId]) {
          questionsByLevel[q.levelId] = [];
        }
        questionsByLevel[q.levelId].push(q);
      });
      
      for (const [levelId, levelData] of Object.entries(levels)) {
        // Get questions for this level
        const levelQuestions = questionsByLevel[levelId] || [];
        
        // Convert questions to MCQ format (with answer as index)
        const mcqs = levelQuestions.map(q => {
          // Find the index of correct answer in options
          const answerIndex = q.options.findIndex(opt => opt === q.correctAnswer);
          
          return {
            question: q.question,
            options: q.options,
            answer: answerIndex >= 0 ? answerIndex : 0, // Default to first option if not found
            explanations: q.explanation ? [q.explanation] : []
          };
        });

        // Extract level number from levelId (e.g., "js_01_variables" -> 1)
        // Or use order from levelData
        const levelNumber = levelData.order !== undefined ? Math.floor(levelData.order) + 1 : 
                          parseInt(levelId.match(/\d+/)?.[0] || '1');

        // Create lesson with embedded MCQs
        const lesson = new Lesson({
          languageKey: langKey,
          levelNumber: levelNumber,
          title: levelData.title || `${langKey} Level ${levelNumber}`,
          description: levelData.title || '', // Using title as description if no separate description
          lessonTitle: levelData.title || `${langKey} Level ${levelNumber}`,
          theory: levelData.theory || '',
          mcqs: mcqs,
          isActive: true
        });

        await lesson.save();
        totalLessons++;
        totalMCQs += mcqs.length;
        console.log(`  ✅ Level ${levelNumber} (${levelId}): ${mcqs.length} MCQs embedded`);
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`   Lessons: ${totalLessons}`);
    console.log(`   Total MCQs: ${totalMCQs}`);
    console.log('\n🎉 Database seeding completed successfully!');

    // Close connection
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seedLessons();


