import express from 'express';
import PrerequisiteQuestion from '../models/PrerequisiteQuestion.js';

const router = express.Router();

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Get all prerequisite questions for a language
router.get('/', async (req, res) => {
  try {
    const { languageKey, limit } = req.query;
    const query = { isActive: true };
    
    if (languageKey) {
      query.languageKey = languageKey.toLowerCase();
    }
    
    let queryBuilder = PrerequisiteQuestion.find(query).sort({ createdAt: -1 });
    
    // Limit results if specified (useful for getting random subset)
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        queryBuilder = queryBuilder.limit(limitNum);
      }
    }
    
    const questions = await queryBuilder;
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get random prerequisite questions for a language (for prerequisite test)
router.get('/random/:languageKey', async (req, res) => {
  try {
    const { languageKey } = req.params;
    const { count = 20, levelNumber } = req.query; // Default to 20 questions; levelNumber is OPTIONAL

    const normalizedKey = String(languageKey || '').toLowerCase().trim();
    const safeCount = parseInt(count, 10);
    const safeLevelNumber = parseInt(levelNumber, 10);

    // Case-insensitive match for DBs storing "Java" while frontend sends "java"
    const languageRegex = new RegExp(`^${escapeRegex(normalizedKey)}$`, 'i');

    // Base match: language only (most important)
    // Support both schema variants:
    // - prerequisite_questions.language (e.g. "Java")
    // - prerequisite_questions.languageKey (e.g. "java")
    const match = {
      $or: [
        { language: languageRegex },
        { languageKey: languageRegex }
      ]
    };

    // Only filter by levelNumber if the caller explicitly provided it.
    // This avoids accidentally restricting to a single document when
    // the database uses different levelNumber values (0, 2, etc.).
    if (!Number.isNaN(safeLevelNumber) && Number.isFinite(safeLevelNumber) && typeof levelNumber !== 'undefined') {
      match.levelNumber = safeLevelNumber;
    }

    console.log('[Prerequisites] incoming languageKey:', languageKey, 'normalized:', normalizedKey, 'levelNumber param:', levelNumber, 'resolved levelNumber:', match.levelNumber, 'count:', safeCount);
    console.log('[Prerequisites] mongo $match (language-based):', match);

    const questions = await PrerequisiteQuestion.aggregate([
      { $match: match },
      { $sample: { size: Number.isFinite(safeCount) ? safeCount : 20 } },
    ]);

    console.log('[Prerequisites] result length:', questions?.length ?? 0);
    
    if (questions.length === 0) {
      return res.status(404).json({ 
        error: 'No prerequisite questions found for this language',
        languageKey 
      });
    }
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get prerequisite questions by language
router.get('/language/:languageKey', async (req, res) => {
  try {
    const { languageKey } = req.params;
    const questions = await PrerequisiteQuestion.find({
      languageKey: languageKey.toLowerCase(),
      isActive: true
    }).sort({ createdAt: -1 });
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get prerequisite question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await PrerequisiteQuestion.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Prerequisite question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create prerequisite question
router.post('/', async (req, res) => {
  try {
    const question = new PrerequisiteQuestion(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update prerequisite question
router.put('/:id', async (req, res) => {
  try {
    const question = await PrerequisiteQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!question) {
      return res.status(404).json({ error: 'Prerequisite question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete prerequisite question
router.delete('/:id', async (req, res) => {
  try {
    const question = await PrerequisiteQuestion.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Prerequisite question not found' });
    }
    
    res.json({ message: 'Prerequisite question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
