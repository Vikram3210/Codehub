import express from 'express';
import mongoose from 'mongoose';
import Question from '../models/Question.js';

const router = express.Router();

// Get all quiz questions (optionally filtered by lessonId)
router.get('/', async (req, res) => {
  try {
    const { lessonId } = req.query;
    // NOTE: Do NOT filter by isActive here because existing question
    // documents in MongoDB might not have that field yet.
    const query = {};

    if (lessonId) {
      // Match both string and ObjectId formats
      try {
        const objectId = new mongoose.Types.ObjectId(lessonId);
        query.$or = [
          { lessonId: lessonId }, // String match
          { lessonId: objectId }, // ObjectId match
        ];
      } catch (e) {
        // If lessonId is not a valid ObjectId format, just use string match
        query.lessonId = lessonId;
      }
    }

    const questions = await Question.find(query)
      .sort({ order: 1 })
      .lean();

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get quiz questions for a specific lesson
// GET /api/questions/:lessonId
router.get('/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;

    console.log('[Questions API] Fetching questions for lessonId:', lessonId);

    // Match both string and ObjectId formats
    let query;
    try {
      const objectId = new mongoose.Types.ObjectId(lessonId);
      query = {
        $or: [
          { lessonId: lessonId }, // String match
          { lessonId: objectId }, // ObjectId match
        ],
      };
    } catch (e) {
      // If lessonId is not a valid ObjectId format, just use string match
      query = { lessonId: lessonId };
    }

    // Do NOT filter by isActive - allow documents without this field
    const questions = await Question.find(query)
      .sort({ order: 1 })
      .lean();

    console.log('[Questions API] Found', questions.length, 'questions for lessonId:', lessonId);

    // Return empty array instead of 404 - some lessons might not have questions yet
    res.json(questions || []);
  } catch (error) {
    console.error('[Questions API] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create quiz question
router.post('/', async (req, res) => {
  try {
    const { lessonId, question, options, correctAnswer, explanation, points, order } = req.body;

    if (!lessonId) {
      return res.status(400).json({ error: 'lessonId is required' });
    }

    const payload = {
      lessonId,
      question,
      options,
      correctAnswer,
      explanation,
      points,
      order,
    };

    const created = await Question.create(payload);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update quiz question by question ID
router.put('/by-id/:id', async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete quiz question by ID
router.delete('/by-id/:id', async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id).lean();

    if (!deleted) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

