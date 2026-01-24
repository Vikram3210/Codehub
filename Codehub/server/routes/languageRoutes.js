import express from 'express';
import Language from '../models/Language.js';

const router = express.Router();

// Get all languages
router.get('/', async (req, res) => {
  try {
    const languages = await Language.find({ isActive: true })
      .sort({ order: 1 });
    res.json(languages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get language by key
router.get('/:key', async (req, res) => {
  try {
    const language = await Language.findOne({ 
      key: req.params.key.toLowerCase(),
      isActive: true 
    });
    
    if (!language) {
      return res.status(404).json({ error: 'Language not found' });
    }
    
    res.json(language);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create language
router.post('/', async (req, res) => {
  try {
    const language = new Language(req.body);
    await language.save();
    res.status(201).json(language);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update language
router.put('/:id', async (req, res) => {
  try {
    const language = await Language.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!language) {
      return res.status(404).json({ error: 'Language not found' });
    }
    
    res.json(language);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete language
router.delete('/:id', async (req, res) => {
  try {
    const language = await Language.findByIdAndDelete(req.params.id);
    
    if (!language) {
      return res.status(404).json({ error: 'Language not found' });
    }
    
    res.json({ message: 'Language deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

