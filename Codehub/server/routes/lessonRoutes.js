import express from 'express';
import mongoose from 'mongoose';
import Lesson from '../models/Lesson.js';
import Language from '../models/Language.js';

const router = express.Router();

// Helper: resolve languageKey -> languageId (_id)
async function resolveLanguageId(languageKey) {
  if (!languageKey) return null;
  const key = String(languageKey).toLowerCase();

  // First try match by key (preferred)
  let lang = await Language.findOne({
    key,
  }).lean();

  // Fallback: try case-insensitive match by name (in case keys weren't seeded)
  if (!lang) {
    lang = await Language.findOne({
      name: new RegExp(`^${key}$`, 'i'),
    }).lean();
  }

  if (!lang) return null;

  // Return as string to match MongoDB documents that store languageId as string
  return lang._id ? String(lang._id) : null;
}

// Get all lessons (optionally filtered by languageKey)
router.get('/', async (req, res) => {
  try {
    const { languageKey } = req.query;
    // NOTE: Do NOT filter by isActive here because existing lesson
    // documents in MongoDB don't have that field yet.
    
    let lessons = [];

    if (languageKey) {
      const key = String(languageKey).toLowerCase();
      const languageId = await resolveLanguageId(key);

      console.log('[Lessons API] languageKey:', languageKey, 'resolved languageId:', languageId);

      // Try multiple matching strategies to handle different data formats
      const matchConditions = [];

      // Strategy 1: Match by languageId (string format)
      if (languageId) {
        matchConditions.push({ languageId: languageId });
        // Strategy 2: Match by languageId (ObjectId format)
        try {
          matchConditions.push({ languageId: new mongoose.Types.ObjectId(languageId) });
        } catch (e) {
          console.warn('[Lessons API] Could not convert languageId to ObjectId:', e.message);
        }
      }

      // Strategy 3: Match by languageKey field
      matchConditions.push({ languageKey: key });
      matchConditions.push({ languageKey: new RegExp(`^${key}$`, 'i') });

      // Strategy 4: Match by levelId prefix (e.g., "java_00_intro")
      matchConditions.push({ levelId: new RegExp(`^${key}_`, 'i') });

      // Strategy 5: Match by levelId containing the language key
      matchConditions.push({ levelId: new RegExp(key, 'i') });

      const query = { $or: matchConditions };
      console.log('[Lessons API] Final query:', JSON.stringify(query, null, 2));
      
      lessons = await Lesson.find(query).lean().sort({ levelNumber: 1 });
      console.log('[Lessons API] Found', lessons.length, 'lessons');
      
      // Debug: Log first lesson structure if found
      if (lessons.length > 0) {
        console.log('[Lessons API] Sample lesson:', {
          _id: lessons[0]._id,
          title: lessons[0].title,
          languageId: lessons[0].languageId,
          languageKey: lessons[0].languageKey,
          levelId: lessons[0].levelId,
          levelNumber: lessons[0].levelNumber,
        });
      } else {
        // If no lessons found, try a broader search to see what exists
        const allLessons = await Lesson.find({}).lean().limit(5);
        console.log('[Lessons API] Sample of all lessons in DB:', allLessons.map(l => ({
          _id: l._id,
          title: l.title,
          languageId: l.languageId,
          languageKey: l.languageKey,
          levelId: l.levelId,
        })));
      }
    } else {
      // No languageKey filter - return all lessons
      lessons = await Lesson.find({}).lean().sort({ levelNumber: 1 });
      console.log('[Lessons API] No languageKey filter - returning all', lessons.length, 'lessons');
    }
    
    res.json(lessons);
  } catch (error) {
    console.error('[Lessons API] Error:', error);
    console.error('[Lessons API] Error stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// Get all lessons for a language (by language key)
router.get('/language/:languageKey', async (req, res) => {
  try {
    const key = String(req.params.languageKey).toLowerCase();
    const languageId = await resolveLanguageId(key);

    let lessons;
    if (languageId) {
      // Match both string and ObjectId formats
      lessons = await Lesson.find({
        $or: [
          { languageId: languageId },
          { languageId: new mongoose.Types.ObjectId(languageId) },
        ],
      }).lean().sort({ levelNumber: 1 });
    } else {
      // Fallback: match by levelId prefix if language document not found
      lessons = await Lesson.find({
        levelId: new RegExp(`^${key}_`, 'i'),
      }).lean().sort({ levelNumber: 1 });
    }
    
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[Lessons API] Fetching lesson by ID:', id);

    const lesson = await Lesson.findById(id).lean();

    if (!lesson) {
      console.log('[Lessons API] Lesson not found for ID:', id);
      return res.status(404).json({ error: 'Lesson not found' });
    }

    console.log('[Lessons API] Found lesson:', {
      _id: lesson._id,
      title: lesson.title,
      hasTheory: !!lesson.theory,
      theoryLength: lesson.theory?.length || 0,
      levelNumber: lesson.levelNumber,
    });

    // Only filter by isActive if the field exists and is explicitly false
    if (lesson.isActive === false) {
      console.log('[Lessons API] Lesson is marked as inactive:', id);
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    console.error('[Lessons API] Error fetching lesson by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create lesson
router.post('/', async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update lesson
router.put('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.json(lesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete lesson
router.delete('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

