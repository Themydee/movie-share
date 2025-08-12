'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!username || !email || !password) {
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
      await axios.post('/api/register', { username, email, password });
      setError('');
      alert('Registration successful! Please log in.');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  return (
    <div className="relative container mx-auto p-4 max-w-md min-h-screen">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 -z-10 bg-gray-900/80"></div>

      {/* Form card */}
      <div className="bg-gray-800/90 rounded-xl shadow-2xl p-6 animate-fade-in border border-accent/30">
        <h1 className="text-3xl font-extrabold text-white mb-6 text-center">Register</h1>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/20 text-red-400 p-3 rounded-lg mb-6 animate-fade-in">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Username *</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
              required
              aria-required="true"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Email *</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
              required
              aria-required="true"
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
              aria-required="true"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-accent text-white p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/80'
            }`}
            aria-label="Register"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}