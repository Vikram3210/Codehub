import express from 'express';

const router = express.Router();

// Judge0 API language IDs mapping
const JUDGE0_LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  java: 62,       // Java
  cpp: 54,        // C++17
};

// Judge0 API endpoint
// - Self‑hosted: set JUDGE0_API_URL to your instance base URL (e.g. http://localhost:2358)
// - RapidAPI (judge0-ce): set JUDGE0_API_URL to https://judge0-ce.p.rapidapi.com and JUDGE0_API_KEY
const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || null;

/**
 * Execute code using Judge0 API
 * POST /api/execute-code
 * Body: { code: string, language: 'javascript' | 'python' | 'java' | 'cpp' }
 */
router.post('/execute-code', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required' });
    }

    if (!language || !JUDGE0_LANGUAGE_IDS[language]) {
      return res.status(400).json({ 
        error: 'Invalid language. Supported: javascript, python, java, cpp' 
      });
    }

    const languageId = JUDGE0_LANGUAGE_IDS[language];

    // Build headers (supports both plain Judge0 and RapidAPI variant)
    const headers = {
      'Content-Type': 'application/json',
    };
    if (JUDGE0_API_KEY) {
      headers['X-RapidAPI-Key'] = JUDGE0_API_KEY;
      headers['X-RapidAPI-Host'] = new URL(JUDGE0_API_URL).hostname;
    }

    // Simpler flow: ask Judge0 to wait for result in a single request
    // RapidAPI / Judge0 usually supports: ?base64_encoded=false&wait=true
    const submitUrl = `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`;

    const response = await fetch(submitUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: '',
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[Code Execution] Judge0 error:', text);
      return res.status(500).json({
        error: 'Execution service returned an error',
        details: text,
      });
    }

    const result = await response.json();

    // Status 3 = Accepted (completed)
    if (result.status?.id === 3) {
      return res.json({
        success: true,
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        compile_output: result.compile_output || '',
        time: result.time,
        memory: result.memory,
      });
    }

    // Status 4-12 = various errors
    return res.json({
      success: false,
      error: result.status?.description || 'Execution error',
      stderr: result.stderr || '',
      compile_output: result.compile_output || '',
    });

  } catch (error) {
    console.error('[Code Execution] Error:', error);
    res.status(500).json({ 
      error: 'Internal server error during code execution',
      message: error.message 
    });
  }
});

export default router;
