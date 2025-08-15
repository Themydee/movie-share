import mongoose, { Schema } from "mongoose";
import { Movie } from "../types";

const movieSchema = new Schema<Movie>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  recommendedBy: {
    type: String,
    required: true,
  },
  trailerUrl: {
    type: String,
  },
});

export default mongoose.model<Movie>('Movie', movieSchema)