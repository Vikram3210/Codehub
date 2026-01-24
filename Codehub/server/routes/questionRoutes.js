import express from 'express';
import Question from '../models/Question.js';
import Lesson from '../models/Lesson.js';

const router = express.Router();

// Get all questions
router.get('/', async (req, res) => {
  try {
    const { languageKey, levelId, lessonId } = req.query;
    const query = { isActive: true };
    
    if (languageKey) {
      query.languageKey = languageKey.toLowerCase();
    }
    
    if (levelId) {
      query.levelId = levelId;
    }
    
    if (lessonId) {
      query.lessonId = lessonId;
    }
    
    const questions = await Question.find(query)
      .sort({ order: 1 })
      .populate('lessonId', 'title levelId');
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get questions by language and levelId
router.get('/:languageKey/:levelId', async (req, res) => {
  try {
    const questions = await Question.find({
      languageKey: req.params.languageKey.toLowerCase(),
      levelId: req.params.levelId,
      isActive: true
    })
    .sort({ order: 1 })
    .populate('lessonId', 'title levelId');
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('lessonId', 'title levelId');
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create question
router.post('/', async (req, res) => {
  try {
    // If lessonId is not provided, try to find lesson by languageKey and levelId
    if (!req.body.lessonId && req.body.languageKey && req.body.levelId) {
      const lesson = await Lesson.findOne({
        languageKey: req.body.languageKey.toLowerCase(),
        levelId: req.body.levelId
      });
      
      if (lesson) {
        req.body.lessonId = lesson._id;
      }
    }
    
    const question = new Question(req.body);
    await question.save();
    
    await question.populate('lessonId', 'title levelId');
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update question
router.put('/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('lessonId', 'title levelId');
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete question
router.delete('/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

