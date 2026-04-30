import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE } from '../config/env';

export default function Problems() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/problems`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load problems');
        }
        setProblems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const difficultyClass = (difficulty) => {
    if (difficulty === 'Easy') return 'bg-success';
    if (difficulty === 'Medium') return 'bg-warning text-dark';
    if (difficulty === 'Hard') return 'bg-danger';
    return 'bg-secondary';
  };

  return (
    <div className="container-fluid min-vh-100 p-4 gradient-bg">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="h3 text-light mb-0">Coding Problems</h1>
        <button type="button" className="btn btn-outline-light" onClick={() => navigate('/practice')}>
          Back to Practice
        </button>
      </div>

      {loading && <div className="text-light">Loading problems...</div>}
      {error && !loading && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="row g-3">
          {problems.map((problem, index) => (
            <div key={problem.id} className="col-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="coding-problem-list-item"
                onClick={() => navigate(`/coding-practice/${problem.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') navigate(`/coding-practice/${problem.id}`);
                }}
              >
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="text-light fw-semibold">{problem.title}</div>
                  <span className={`badge ${difficultyClass(problem.difficulty)}`}>{problem.difficulty}</span>
                </div>
              </motion.div>
            </div>
          ))}
          {!problems.length && <div className="text-light-50">No problems found.</div>}
        </div>
      )}
    </div>
  );
}
