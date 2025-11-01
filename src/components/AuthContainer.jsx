// src/components/AuthContainer.jsx
import React from 'react';
import { motion } from 'framer-motion'; // <-- CORRECTED IMPORT
import Logo from './Logo';

export default function AuthContainer({ children, title, subtitle }) {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center gradient-bg">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card-glow p-4 p-md-5 mx-3" 
        style={{ width: '100%', maxWidth: '450px' }} 
      >
        <div className="text-center mb-5">
            <Logo size={80} /> 

            <h2
                className="neon-text text-white mt-4"
                style={{
                    fontSize: '1.2rem',
                    marginBottom: '10px',
                }}
            >
                {title}
            </h2>

            {subtitle && (
                <p className="lead text-light-50 mb-0" style={{ fontSize: '0.9rem' }}>
                    {subtitle}
                </p>
            )}
        </div>

        {children}
      </motion.div>
    </div>
  );
}