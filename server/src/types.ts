export interface Movie {
  id: string;
  title: string;
  poster: string; // Cloudinary URL for poster
  fileUrl: string; // Cloudinary URL for video
  genres: string[];
  year: number;
  rating: number;
  review: string;
  recommendedBy: string;
  trailerUrl?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; 
}

export interface DecodedToken {
  userId: string;
  email: string;
}