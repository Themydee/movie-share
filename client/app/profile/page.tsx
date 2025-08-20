"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

export default function Profile() {
  const [movies, setMovies] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");
  const server_url = "http://localhost:5000"; 

  useEffect(() => {
    const fetchUserMovies = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const userId = localStorage.getItem("userId"); 
        const username = localStorage.getItem("username"); 
        if (!token || !userId) return;

        setUsername(username || "");

        const res = await axios.get(server_url + '/api/movies/user/:userId', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMovies(res.data.movies);
      } catch (err) {
        console.error("Failed to fetch movies", err);
      }
    };

    fetchUserMovies();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">{username}</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Uploaded Movies</h2>

      {movies.length === 0 ? (
        <p className="text-gray-500">You haven’t uploaded any movies yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
