import express from 'express';
import Lesson from '../models/Lesson.js';

const router = express.Router();

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const { languageKey } = req.query;
    const query = { isActive: true };
    
    if (languageKey) {
      query.languageKey = languageKey.toLowerCase();
    }
    
    const lessons = await Lesson.find(query)
      .sort({ languageKey: 1, order: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lesson by language and levelId
router.get('/:languageKey/:levelId', async (req, res) => {
  try {
    const lesson = await Lesson.findOne({
      languageKey: req.params.languageKey.toLowerCase(),
      levelId: req.params.levelId,
      isActive: true
    });
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lesson by language and levelNumber (new structure)
router.get('/:languageKey/level/:levelNumber', async (req, res) => {
  try {
    const lesson = await Lesson.findOne({
      languageKey: req.params.languageKey.toLowerCase(),
      levelNumber: parseInt(req.params.levelNumber),
      isActive: true
    });
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all lessons for a language
router.get('/language/:languageKey', async (req, res) => {
  try {
    const lessons = await Lesson.find({
      languageKey: req.params.languageKey.toLowerCase(),
      isActive: true
    })
    .sort({ order: 1 });
    
    res.json(lessons);
  } catch (error) {
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

