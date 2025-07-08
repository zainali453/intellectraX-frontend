import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import AuthService from '../services/auth.service';

const JWTExpiredHandler = () => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleJWTExpired = (event) => {
      setMessage(event.detail.message);
      setShowModal(true);
    };

    // Listen for JWT expiration events
    window.addEventListener('jwtExpired', handleJWTExpired);

    // Cleanup event listener
    return () => {
      window.removeEventListener('jwtExpired', handleJWTExpired);
    };
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    // Navigate to login page after modal is closed
    navigate('/');
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={handleModalClose}
      title="Session Expired"
      description={message || "Your session has expired. Please log in again."}
      buttonText="OK"
      status="error"
      showIcon={true}
    />
  );
};

export default JWTExpiredHandler; 