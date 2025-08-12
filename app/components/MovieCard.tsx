import Link from 'next/link';
import Image from 'next/image';

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

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-accent/50 transition-shadow">
      <Link href={`/movie/${movie.id}`}>
        <Image
          src={movie.poster}
          alt={movie.title}
          width={300}
          height={450}
          className="w-full h-64 object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="font-bold text-lg">{movie.title}</h3>
        <p className="text-sm text-gray-400">{movie.genres.join(', ')}</p>
        <p className="text-sm">Rating: {movie.rating}/10</p>
        <p className="text-sm text-gray-400">Recommended by: {movie.recommendedBy}</p>
        {/* {movie.fileUrl && (
          <a
            href={movie.fileUrl}
            download
            className="mt-2 inline-block bg-accent text-white px-4 py-2 rounded hover:bg-accent/80"
          >
            Download
          </a>
        )} */}
      </div>
    </div>
  );
}