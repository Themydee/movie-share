// app/login/page.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const server_url = 'http://localhost:5000';
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Please fill out all required fields.');
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${server_url}/api/auth/login`, { email, password });
      login(response.data.token, response.data.user, response.data.refreshToken);
      toast.success('Login successful! Redirecting...');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to log in. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  return (
    <div className="relative container mx-auto p-4 max-w-md min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gray-900/80"></div>
      <div className="bg-gray-800/90 rounded-xl shadow-2xl p-6 animate-fade-in border border-accent/30">
        <h1 className="text-3xl font-extrabold text-white mb-6 text-center">Log In</h1>
        {error && (
          <div className="flex items-center gap-2 bg-red-500/20 text-red-400 p-3 rounded-lg mb-6 animate-fade-in">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email *</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password *</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
              required
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-accent text-white p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/80'
            }`}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          Don’t have an account?{' '}
          <Link href="/register" className="text-accent hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}