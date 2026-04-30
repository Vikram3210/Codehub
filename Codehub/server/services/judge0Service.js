import axios from 'axios';

const JUDGE0_LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || '';

function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = JUDGE0_API_KEY;
    headers['X-RapidAPI-Host'] = new URL(JUDGE0_API_URL).hostname;
  }
  return headers;
}

function looksLikeStandaloneProgram(code, language) {
  const source = String(code || '');
  if (language === 'javascript') {
    return /readFileSync\s*\(\s*0/.test(source) || /process\.stdin/.test(source);
  }
  if (language === 'python') {
    return /sys\.stdin|input\s*\(/.test(source);
  }
  return true;
}

function wrapFunctionStyleCode(code, language) {
  const source = String(code || '');
  if (looksLikeStandaloneProgram(source, language)) return source;

  if (language === 'javascript') {
    return `${source}

const __rawInput = require('fs').readFileSync(0, 'utf8');
if (typeof solve === 'function') {
  const __result = solve(__rawInput);
  if (__result !== undefined) console.log(__result);
}`;
  }

  if (language === 'python') {
    return `${source}

import sys
__raw_input = sys.stdin.read()
if 'solve' in globals() and callable(solve):
    __result = solve(__raw_input)
    if __result is not None:
        print(__result)`;
  }

  return source;
}

export async function runWithJudge0({ code, language, input = '' }) {
  const languageId = JUDGE0_LANGUAGE_IDS[language];
  if (!languageId) {
    throw new Error('Unsupported language');
  }

  const preparedCode = wrapFunctionStyleCode(code, language);

  const url = `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`;
  const response = await axios.post(
    url,
    {
      source_code: preparedCode,
      language_id: languageId,
      stdin: input,
    },
    {
      headers: buildHeaders(),
      timeout: 25000,
    },
  );

  return response.data;
}

export function mapJudge0StatusToVerdict(statusId, statusDescription) {
  if (statusId === 3) return 'ACCEPTED';
  if (statusId === 5) return 'TLE';
  if (statusId && statusId >= 6) return 'RUNTIME_ERROR';
  if (/time limit/i.test(statusDescription || '')) return 'TLE';
  return 'RUNTIME_ERROR';
}
