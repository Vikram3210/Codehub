import express from 'express';
import {
  createProblem,
  createTestcase,
  getProblem,
  getProblems,
  runCode,
  submitCode,
} from '../controllers/codingController.js';

const router = express.Router();

router.get('/problems', getProblems);
router.get('/problem/:id', getProblem);
router.post('/problem', createProblem);
router.post('/testcase', createTestcase);
router.post('/run', runCode);
router.post('/submit', submitCode);

export default router;
