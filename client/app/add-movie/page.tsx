// app/add-movie/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function AddMovie() {
  const [title, setTitle] = useState<string>('');
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [movieFile, setMovieFile] = useState<File | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [year, setYear] = useState<number | ''>('');
  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState<string>('');
  const [trailerUrl, setTrailerUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const server_url = 'http://localhost:5000';
  const router = useRouter();
  const { token, refreshToken } = useAuth();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
    if (file && file.type.startsWith('image/')) {
      setPosterPreview(URL.createObjectURL(file));
    } else {
      setPosterPreview(null);
    }
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setGenres(selected);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!title || !year || !genres.length || !review || !poster || !movieFile) {
      setError('Please fill out all required fields and upload both a poster and movie file.');
      setIsSubmitting(false);
      return;
    }

    if (
      trailerUrl &&
      !/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/).+/.test(trailerUrl)
    ) {
      setError('Please enter a valid YouTube or Vimeo URL for the trailer.');
      setIsSubmitting(false);
      return;
    }

    if (!token) {
      setError('Please log in to upload a movie.');
      setIsSubmitting(false);
      router.push('/login');
      return;
    }

    let authToken = token;
    try {
      // Validate token format
      if (typeof token !== 'string' || !token.includes('.') || token.split('.').length !== 3) {
        console.error('Invalid token format:', token);
        throw new Error('Invalid token format');
      }

      let decodedPayload;
      try {
        const payload = token.split('.')[1];
        decodedPayload = JSON.parse(atob(payload));
      } catch (err) {
        console.error('Failed to decode token payload:', err, 'Token:', token);
        throw new Error('Failed to decode token payload');
      }

      if (!decodedPayload.exp) {
        console.error('Token payload missing exp:', decodedPayload);
        throw new Error('Token payload missing expiration');
      }

      console.log('Token expiration:', new Date(decodedPayload.exp * 1000), 'Current time:', new Date());
      if (decodedPayload.exp * 1000 < Date.now()) {
        console.log('Attempting token refresh...');
        authToken = await refreshToken();
        if (!authToken) {
          console.error('Refresh token failed, no new token returned');
          setError('Session expired. Please log in again.');
          setIsSubmitting(false);
          router.push('/login');
          return;
        }
        console.log('New token obtained:', authToken);
      }
    } catch (err: any) {
      console.error('Token validation failed:', err.message);
      setError('Invalid or corrupted token. Please log in again.');
      setIsSubmitting(false);
      router.push('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('poster', poster as File);
    formData.append('movieFile', movieFile as File);
    formData.append('genres', JSON.stringify(genres));
    formData.append('year', year.toString());
    formData.append('rating', rating.toString());
    formData.append('review', review);
    formData.append('trailerUrl', trailerUrl);

    try {
      const response = await axios.post(`${server_url}/api/movies/add`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message || 'Movie uploaded successfully!');
      setTitle('');
      setPoster(null);
      setPosterPreview(null);
      setMovieFile(null);
      setGenres([]);
      setYear('');
      setRating(5);
      setReview('');
      setTrailerUrl('');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      console.error('Upload failed:', err.response?.data, err.response?.status);
      const errorMessage =
        err.response?.data?.message || 'Failed to upload movie. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTrailerThumbnail = (url: string): string => {
    try {
      let videoId: string | null = null;
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v');
      } else if (url.includes('youtu.be')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      }
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
      if (url.includes('vimeo.com')) {
        return 'https://via.placeholder.com/300x169?text=Vimeo+Thumbnail';
      }
      return 'https://via.placeholder.com/300x169?text=Invalid+Trailer+URL';
    } catch {
      return 'https://via.placeholder.com/300x169?text=Invalid+Trailer+URL';
    }
  };

  return (
    <div className="relative container mx-auto p-4 max-w-2xl min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gray-900/80"></div>
      <div className="bg-gray-800/90 rounded-xl shadow-2xl p-6 animate-fade-in border border-accent/30">
        <h1 className="text-3xl font-extrabold text-white mb-6 text-center">Add a Movie</h1>
        {error && (
          <div className="flex items-center gap-2 bg-red-500/20 text-red-400 p-3 rounded-lg mb-6 animate-fade-in">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
                required
                placeholder="Enter movie title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Release Year *</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : '')}
                min={1900}
                max={new Date().getFullYear()}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
                required
                placeholder="e.g., 2023"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Poster Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setPoster)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-accent file:text-white file:cursor-pointer"
                required
              />
              {posterPreview && (
                <div className="mt-4">
                  <Image
                    src={posterPreview}
                    alt="Poster preview"
                    width={200}
                    height={300}
                    className="rounded-lg shadow-lg object-cover"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Movie File (MP4) *</label>
              <input
                type="file"
                accept="video/mp4"
                onChange={(e) => handleFileChange(e, setMovieFile)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-accent file:text-white file:cursor-pointer"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Trailer URL (YouTube/Vimeo)</label>
            <input
              type="url"
              value={trailerUrl}
              onChange={(e) => setTrailerUrl(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {trailerUrl && (
              <div className="mt-4">
                <Image
                  src={getTrailerThumbnail(trailerUrl)}
                  alt="Trailer thumbnail"
                  width={300}
                  height={169}
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Genres *</label>
            <select
              multiple
              value={genres}
              onChange={handleGenreChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
              required
            >
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Horror">Horror</option>
              <option value="Romance">Romance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Rating (1-10) *</label>
            <input
              type="number"
              min={1}
              max={10}
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value) || 1)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
              required
              placeholder="e.g., 8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Personal Review *</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-accent text-white"
              required
              placeholder="Write your review..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-accent text-white p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/80'
            }`}
          >
            {isSubmitting ? 'Uploading...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}