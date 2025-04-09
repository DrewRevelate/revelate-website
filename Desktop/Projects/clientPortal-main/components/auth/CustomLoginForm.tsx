"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Button from '@/components/ui/Button';

interface CustomLoginFormProps {
  view: 'sign_in' | 'sign_up' | 'forgotten_password';
}

const CustomLoginForm = ({ view }: CustomLoginFormProps) => {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setErrorMessage(error.message);
      } else {
        // AuthContext will handle the redirect
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setErrorMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const { error, data } = await signUp(email, password);
      
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Check your email for the confirmation link!');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setErrorMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = view === 'sign_in' ? handleSignIn : handleSignUp;
  
  return (
    <div className="w-full max-w-md">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            isFullWidth
            isLoading={loading}
          >
            {view === 'sign_in' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CustomLoginForm;
