'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

interface Movie {
  id: string;
  title: string;
  poster: string;
  genres: string[];
  year: number;
  rating: number;
  review: string;
  recommendedBy: string;
  fileUrl?: string;
  trailerUrl?: string;
}

// Mock data function
async function getMovie(id: string): Promise<Movie> {
  // In real app, fetch from API
  return {
    id,
    title: 'Inception',
    poster: '/images/inception.jpg',
    genres: ['Action', 'Sci-Fi'],
    year: 2010,
    rating: 9,
    review: 'A mind-bending thriller that explores the depths of dreams and reality. Christopher Nolan’s masterpiece keeps you on the edge of your seat with stunning visuals and a gripping storyline.',
    recommendedBy: 'user1',
    fileUrl: '/movies/inception.mp4',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
  };
}

export default function MovieDetails({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise); // Unwrap params with React.use()
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Fetch movie data
  useEffect(() => {
    getMovie(params.id).then(setMovie).catch(() => setMovie(null));
  }, [params.id]);

  if (!movie) {
    return <div className="container mx-auto p-4 text-red-500">Movie not found</div>;
  }

  // Convert YouTube/Vimeo URL to embeddable format
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return (
    <div className="relative container mx-auto p-4 max-w-5xl min-h-screen">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={movie.poster}
          alt={`${movie.title} backdrop`}
          fill
          className="object-cover filter blur-lg opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gray-900/80"></div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-800/90 rounded-xl shadow-2xl p-6 animate-fade-in">
        {/* Poster */}
        <div className="lg:col-span-1">
          <Image
            src={movie.poster}
            alt={movie.title}
            width={600}
            height={900}
            className="w-full rounded-lg shadow-lg object-cover"
            priority
          />
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-extrabold text-white">{movie.title}</h1>
          <div className="flex flex-wrap gap-2 text-sm text-gray-300">
            <span>{movie.genres.join(', ')}</span>
            <span>•</span>
            <span>{movie.year}</span>
            <span>•</span>
            <span>Rating: {movie.rating}/10</span>
          </div>
          <p className="text-gray-400 italic">Recommended by: {movie.recommendedBy}</p>
          <p className="text-base text-gray-200 leading-relaxed">{movie.review}</p>

          {/* Action buttons */}
          <div className="flex gap-4 flex-wrap">
            {movie.fileUrl && (
              <a
                href={movie.fileUrl}
                download
                className="inline-flex items-center bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label={`Download ${movie.title}`}
              >
                Download Movie
              </a>
            )}
            {movie.trailerUrl && (
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="inline-flex items-center bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label={`Watch trailer for ${movie.title}`}
              >
                Watch Trailer
              </button>
            )}
            <Link href="/">
              <button
                className="inline-flex items-center bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Back to home"
              >
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {isTrailerOpen && movie.trailerUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative bg-gray-800 rounded-lg p-4 max-w-3xl w-full">
            <button
              onClick={() => setIsTrailerOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-accent"
              aria-label="Close trailer"
            >
              ✕
            </button>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
              <iframe
                src={getEmbedUrl(movie.trailerUrl)}
                title={`${movie.title} trailer`}
                className="absolute top-0 left-0 w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}