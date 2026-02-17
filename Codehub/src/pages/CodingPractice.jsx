import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';

const DEFAULT_SNIPPETS = {
  javascript: `// JavaScript playground
function greet(name) {
  return \`Hello, \${name} 👋\`;
}

console.log(greet('CodeHub'));`,
  python: `# Python playground
def greet(name: str) -> str:
    return f"Hello, {name} 👋"

print(greet("CodeHub"))`,
  java: `// Java playground
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodeHub 👋");
    }
}`,
  cpp: `// C++ playground
#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello, CodeHub 👋" << endl;
    return 0;
}`,
};

const LANGUAGE_LABELS = {
  javascript: 'JavaScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
};

export default function CodingPractice() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_SNIPPETS.javascript);
  const [output, setOutput] = useState('// Output will appear here after running your code.\n');
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (event) => {
    const value = event.target.value;
    setLanguage(value);
    setCode(DEFAULT_SNIPPETS[value] || '');
    setOutput(`// Switched to ${LANGUAGE_LABELS[value]}.\n// Code execution backend coming soon.\n`);
  };

  const handleRun = () => {
    setIsRunning(true);

    // Lightweight, client-side runner for JavaScript
    if (language === 'javascript') {
      try {
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(String).join(' '));
          originalLog(...args);
        };

        setOutput('// Running JavaScript locally...\n');
        // eslint-disable-next-line no-new-func
        const fn = new Function(code);
        fn();

        console.log = originalLog;
        setOutput((prev) => `${prev}${logs.length ? logs.join('\n') : '// (no output)'}\n`);
      } catch (err) {
        setOutput((prev) => `${prev}Error: ${err.message}\n`);
      } finally {
        setIsRunning(false);
      }
      return;
    }

    // For non-JS languages, keep structure ready for backend integration
    setTimeout(() => {
      setIsRunning(false);
      setOutput(
        `// ${LANGUAGE_LABELS[language]} execution is not wired yet.\n` +
        '// Connect this button to Judge0 or another code runner API.\n',
      );
    }, 400);
  };

  return (
    <div className="container-fluid min-vh-100 p-4 gradient-bg">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/practice')}
            className="btn btn-outline-light"
            style={{ whiteSpace: 'nowrap' }}
          >
            ← Back to Practice Modes
          </motion.button>
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="neon-text mb-0"
            style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)' }}
          >
            Coding Practice
          </motion.h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 text-light-50"
      >
        <p className="mb-1">
          Practice coding in a browser-based editor that feels like VS Code. Choose your language, write code,
          and prepare for online judges or interviews.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="coding-practice-shell p-3 p-md-4"
      >
        {/* Top toolbar */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="badge bg-primary bg-gradient coding-pill">VS Code Engine</span>
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
              onChange={handleLanguageChange}
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
              disabled={isRunning}
            >
              {isRunning ? 'Running…' : 'Run Code'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="coding-editor-wrapper mb-3">
          <Editor
            height="52vh"
            theme="vs-dark"
            defaultLanguage={language === 'cpp' ? 'cpp' : language}
            language={language === 'cpp' ? 'cpp' : language}
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

        {/* Output console */}
        <div className="coding-console">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-light-50 small">Output Console</span>
            <span className="badge bg-dark bg-opacity-75 coding-pill">Execution Preview</span>
          </div>
          <pre className="coding-console-body mb-0">{output}</pre>
        </div>
      </motion.div>
    </div>
  );
}

