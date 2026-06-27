import React, { useEffect } from 'react';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-[calc(100vh-73px)] w-full flex items-center justify-center px-4 relative overflow-hidden bg-slate-50 dark:bg-[#0b0f19] py-10 transition-colors">
      {/* Decorative background blobs */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <RegisterForm />
    </div>
  );
};

export default Register;
