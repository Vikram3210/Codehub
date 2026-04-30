import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { useAuth } from '../state/useAuth';
import { logout } from '../services/firebase';
import { API_BASE } from '../config/env';

const VERDICT_META = {
  ACCEPTED: { label: 'Accepted', badge: 'bg-success' },
  WRONG_ANSWER: { label: 'Wrong Answer', badge: 'bg-danger' },
  TLE: { label: 'Time Limit Exceeded', badge: 'bg-warning text-dark' },
  RUNTIME_ERROR: { label: 'Runtime Error', badge: 'bg-dark' },
};

export default function CodingPractice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [language, setLanguage] = useState('javascript');
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('// Output will appear here.\n');
  const [verdict, setVerdict] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const consoleRef = useRef(null);

  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Coder';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const loadProblem = async () => {
      setLoadingProblem(true);
      try {
        const problemId = id || 'default';
        const response = await fetch(`${API_BASE}/problem/${problemId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load problem');
        }
        setProblem(data);
        setCode(data?.starterCode?.javascript || '');
        setOutput('// Problem loaded. Run with custom input or submit.\n');
      } catch (error) {
        setOutput(`Error loading problem: ${error.message}\n`);
      } finally {
        setLoadingProblem(false);
      }
    };

    loadProblem();
  }, [id]);

  useEffect(() => {
    if (!problem?.starterCode) return;
    setCode(problem.starterCode[language] || '');
  }, [language, problem]);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output, verdict]);

  const handleRun = async () => {
    setLoading(true);
    setVerdict('');
    setOutput('// Running code...\n');
    try {
      const response = await fetch(`${API_BASE}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          input: customInput,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Execution failed');
      }

      const finalOutput = data.stderr || data.compile_output || data.stdout || '(no output)';
      setOutput(`${finalOutput}\n`);
    } catch (error) {
      setOutput(`Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem?._id || !currentUser?.uid) {
      setOutput('Error: Missing problem or user information.\n');
      return;
    }
    setLoading(true);
    setVerdict('');
    setOutput('// Submitting solution against hidden + visible testcases...\n');
    try {
      const response = await fetch(`${API_BASE}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem._id,
          code,
          language,
          userId: currentUser.uid,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Submit failed');
      }

      setVerdict(data.verdict || '');
      setOutput(`Passed ${data.passed}/${data.total} testcases.\n`);
    } catch (error) {
      setOutput(`Error: ${error.message}\n`);
      setVerdict('RUNTIME_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const verdictUI = useMemo(() => {
    if (!verdict) return null;
    return VERDICT_META[verdict] || { label: verdict, badge: 'bg-secondary' };
  }, [verdict]);

  if (loadingProblem) {
    return (
      <div className="container-fluid min-vh-100 p-4 gradient-bg d-flex align-items-center justify-content-center text-light">
        Loading coding problem...
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 p-4 gradient-bg">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/profile')}
          className="btn btn-outline-light d-flex align-items-center gap-2 px-3 py-2"
          style={{ borderRadius: '999px' }}
        >
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-dark"
            style={{ width: 28, height: 28, fontWeight: 600 }}
          >
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </span>
          <span className="fw-semibold" style={{ fontSize: '0.95rem' }}>
            {userName}
          </span>
        </motion.button>

        <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/leaderboard')}
            className="btn btn-outline-info"
            title="View Leaderboard"
            style={{ whiteSpace: 'nowrap' }}
          >
            🏆 Leaderboard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/practice')}
            className="btn btn-outline-light"
            title="Back to Practice"
            style={{ whiteSpace: 'nowrap' }}
          >
            ← Back to Practice
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="btn btn-logout"
            title="Logout"
            style={{ whiteSpace: 'nowrap' }}
          >
            🚪 Logout
          </motion.button>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="coding-problem-panel p-3 p-md-4 h-100"
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h2 className="h4 mb-0 text-light">{problem?.title || 'Coding Problem'}</h2>
              <span className="badge bg-info text-dark">{problem?.difficulty || 'Easy'}</span>
            </div>
            <p className="text-light-50 mb-3" style={{ whiteSpace: 'pre-wrap' }}>
              {problem?.description || 'No description found.'}
            </p>
            <h3 className="h6 text-light">Input Format</h3>
            <p className="text-light-50" style={{ whiteSpace: 'pre-wrap' }}>{problem?.inputFormat || '-'}</p>
            <h3 className="h6 text-light">Output Format</h3>
            <p className="text-light-50" style={{ whiteSpace: 'pre-wrap' }}>{problem?.outputFormat || '-'}</p>
            <h3 className="h6 text-light">Constraints</h3>
            <p className="text-light-50" style={{ whiteSpace: 'pre-wrap' }}>{problem?.constraints || '-'}</p>
            <h3 className="h6 text-light">Examples</h3>
            <div className="d-flex flex-column gap-2">
              {(problem?.examples || []).map((example, index) => (
                <div key={`${example.input}-${index}`} className="coding-example-box">
                  <div className="small text-info mb-1">Example {index + 1}</div>
                  <div className="small text-light">Input: {example.input}</div>
                  <div className="small text-light">Output: {example.output}</div>
                </div>
              ))}
            </div>
            {!!problem?.visibleTestcases?.length && (
              <div className="mt-3">
                <h3 className="h6 text-light mb-2">Visible Testcases</h3>
                <div className="d-flex flex-column gap-2">
                  {problem.visibleTestcases.map((tc, idx) => (
                    <div key={`${tc.input}-${idx}`} className="coding-example-box">
                      <div className="small text-light">Input: {tc.input}</div>
                      <div className="small text-light">Expected: {tc.expectedOutput}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="col-12 col-lg-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="coding-practice-shell p-3 p-md-4"
          >
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="badge bg-primary bg-gradient coding-pill">LeetCode Mode</span>
                <span className="badge bg-secondary bg-gradient coding-pill">Monaco Editor</span>
              </div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <label className="text-light-50 me-2 mb-0" htmlFor="language-select">
                  Language
                </label>
                <select
                  id="language-select"
                  className="form-select form-select-sm coding-select"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                >
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
                <button
                  type="button"
                  className="btn btn-sm btn-primary coding-run-btn"
                  onClick={handleRun}
                  disabled={loading}
                >
                  {loading ? 'Running...' : 'Run'}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>

            <div className="coding-editor-wrapper mb-3">
              <Editor
                height="45vh"
                theme="vs-dark"
                defaultLanguage={language}
                language={language}
                value={code}
                onChange={(value) => setCode(value ?? '')}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  roundedSelection: false,
                  autoIndent: 'full',
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="custom-input" className="form-label text-light-50">
                Custom Input
              </label>
              <textarea
                id="custom-input"
                className="form-control coding-custom-input"
                rows={3}
                value={customInput}
                onChange={(event) => setCustomInput(event.target.value)}
                placeholder="Type stdin here for Run..."
              />
            </div>

            <div className="coding-console">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-light-50 small">Console Output</span>
                <div className="d-flex align-items-center gap-2">
                  {loading && <span className="spinner-border spinner-border-sm text-info" role="status" />}
                  {verdictUI && (
                    <span className={`badge ${verdictUI.badge}`}>{verdictUI.label}</span>
                  )}
                </div>
              </div>
              <pre ref={consoleRef} className="coding-console-body mb-0">{output}</pre>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
