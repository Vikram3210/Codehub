import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import Language from '../models/Language.js';
import Lesson from '../models/Lesson.js';
import Question from '../models/Question.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sakupatil2004_db_user:<db_password>@cluster0.f23zbb5.mongodb.net/CodeHub?retryWrites=true&w=majority&appName=Cluster0';

// Language mappings
const languageData = [
  {
    key: 'javascript',
    name: 'JavaScript',
    description: 'The programming language of the web. Learn JavaScript to build interactive websites and web applications.',
    icon: '/images/js.png',
    difficulty: 'beginner',
    isActive: true,
    order: 1
  },
  {
    key: 'python',
    name: 'Python',
    description: 'A versatile, high-level programming language known for its simplicity and readability.',
    icon: '/images/python.png',
    difficulty: 'beginner',
    isActive: true,
    order: 2
  },
  {
    key: 'java',
    name: 'Java',
    description: 'A powerful, object-oriented programming language used for building enterprise applications.',
    icon: '/images/java.png',
    difficulty: 'intermediate',
    isActive: true,
    order: 3
  },
  {
    key: 'cpp',
    name: 'C++',
    description: 'A powerful, high-performance programming language used for system programming and game development.',
    icon: '/images/C++.png',
    difficulty: 'advanced',
    isActive: true,
    order: 4
  }
];

async function seedDatabase() {
  try {
    // Load questions from JSON files
    console.log('📦 Loading questions from JSON files...');
    const questionsData = {};
    const questionsDir = join(__dirname, '../../data/questions');

    // Languages for which we have question JSON files
    const questionLanguages = ['javascript', 'python', 'java', 'cpp'];
    for (const lang of questionLanguages) {
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
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await Language.deleteMany({});
    await Lesson.deleteMany({});
    await Question.deleteMany({});
    console.log('✅ Existing data cleared');

    // Seed Languages
    console.log('📝 Seeding languages...');
    const insertedLanguages = await Language.insertMany(languageData);
    console.log(`✅ Inserted ${insertedLanguages.length} languages`);

    // Seed Lessons and Questions
    let totalLessons = 0;
    let totalQuestions = 0;

    for (const [langKey, levels] of Object.entries(LEVEL_DATA)) {
      console.log(`\n📚 Processing ${langKey}...`);
      
      for (const [levelId, levelData] of Object.entries(levels)) {
        // Create lesson
        const lesson = new Lesson({
          languageKey: langKey,
          levelId: levelId,
          order: levelData.order || 0,
          difficulty: levelData.difficulty || 'easy',
          title: levelData.title || `${langKey} Level`,
          theory: levelData.theory || '',
          theoryTimeSec: levelData.theoryTimeSec || 60,
          xp: levelData.xp || 10,
          isActive: true
        });

        await lesson.save();
        totalLessons++;

        // Create questions for this lesson from JSON files
        const questionsForLevel = (questionsData[langKey] || []).filter(q => q.levelId === levelId);
        
        if (questionsForLevel.length > 0) {
          const questions = questionsForLevel.map((q, index) => ({
            lessonId: lesson._id,
            languageKey: langKey,
            levelId: levelId,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || '',
            xpReward: q.xpReward || 10,
            order: q.order !== undefined ? q.order : index,
            isActive: true
          }));

          await Question.insertMany(questions);
          totalQuestions += questions.length;
          console.log(`  ✅ Level ${levelId}: ${questions.length} questions from JSON`);
        } else {
          console.log(`  ⚠️  Level ${levelId}: No questions found in JSON file`);
        }
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`   Languages: ${insertedLanguages.length}`);
    console.log(`   Lessons: ${totalLessons}`);
    console.log(`   Questions: ${totalQuestions}`);
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
seedDatabase();

