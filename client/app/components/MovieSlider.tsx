'use client';

import { useState, useRef, useEffect } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface MovieSliderProps {
  movies: Movie[];
}

export default function MovieSlider({ movies }: MovieSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getSlidesPerView = () => {
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 3;
      return 2;
    };

    setSlidesPerView(getSlidesPerView());

    const handleResize = () => {
      setSlidesPerView(getSlidesPerView());
      setCurrentIndex(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.max(1, movies.length - slidesPerView + 1);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = 100 / slidesPerView;
      sliderRef.current.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    }
  }, [currentIndex, slidesPerView]);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-300 ease-in-out"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="px-2"
              style={{ width: `${100 / slidesPerView}%`, minWidth: `${100 / slidesPerView}%` }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
      {movies.length > slidesPerView && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-accent/80 text-white p-2 rounded-full hover:bg-accent"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-accent/80 text-white p-2 rounded-full hover:bg-accent"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
}