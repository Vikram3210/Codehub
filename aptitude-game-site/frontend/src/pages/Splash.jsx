import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash">
      <div className="logo">APTITUDE <span>ARENA</span></div>
      <div className="glitch">Initializing Arena...</div>
      <div className="grid"></div>
    </div>
  );
};

export default Splash;



