
import MovieCard from '../components/MovieCard';

// Mock data
const mockUser = {
  username: 'user1',
  profilePic: '/images/naruto.jpg',
  bio: 'Movie enthusiast',
  movies: [
    {
      id: '1',
      title: 'Inception',
      poster: '/images/inception.jpg',
      genres: ['Action', 'Sci-Fi'],
      rating: 9,
      recommendedBy: 'user1',
    },
    // Add more
  ],
};

export default function Profile() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-8">
        <img
          src={mockUser.profilePic}
          alt={mockUser.username}
          className="w-24 h-24 rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold">{mockUser.username}</h1>
          <p className="text-gray-400">{mockUser.bio}</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Recommended Movies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockUser.movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}