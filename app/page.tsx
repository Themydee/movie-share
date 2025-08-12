'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MovieSlider from './components/MovieSlider';
import axios from 'axios';

interface Movie {
  id: string;
  title: string;
  poster: string;
  genres: string[];
  rating: number;
  recommendedBy: string;
  fileUrl?: string;
  trailerUrl?: string; // Added
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([
    {
      id: '1',
      title: 'Inception',
      poster: '/images/inception.jpg',
      genres: ['Action', 'Sci-Fi'],
      rating: 9,
      recommendedBy: 'user1',
      fileUrl: '/movies/inception.mp4',
      trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    },
    {
      id: '2',
      title: 'The Matrix',
      poster: '/images/matrix.jpg',
      genres: ['Action', 'Sci-Fi'],
      rating: 8,
      recommendedBy: 'user2',
      fileUrl: '/movies/matrix.mp4',
      trailerUrl: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
    },
    {
      id: '3',
      title: 'Interstellar',
      poster: '/images/interstellar.jpg',
      genres: ['Sci-Fi', 'Drama'],
      rating: 9,
      recommendedBy: 'user3',
      fileUrl: '/movies/interstellar.mp4',
      trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    },
    {
      id: '4',
      title: 'The Dark Knight',
      poster: '/images/darkknight.jpg',
      genres: ['Action', 'Thriller'],
      rating: 9,
      recommendedBy: 'user4',
      fileUrl: '/movies/darkknight.mp4',
      trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    },
  ]);

  // useEffect(() => {
  //   const fetchMovies = async () => {
  //     try {
  //       const response = await axios.get('/api/movies');
  //       setMovies(response.data);
  //     } catch (error) {
  //       console.error('Failed to fetch movies:', error);
  //     }
  //   };
  //   fetchMovies();
  // }, []);

  return (
    <div className="container mx-auto p-4">
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Share the Movies You Love</h1>
        <Link href="/add-movie">
          <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/80">
            Add Movie
          </button>
        </Link>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Recommendations</h2>
        <MovieSlider movies={movies} />
      </section>
    </div>
  );
}