import express from 'express';
import { addMovie, getMovie, getSingleMovie, getUserMovie } from '../controllers/movie.controller';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/multer';

const router = express.Router();

// Upload movie (protected)
router.post(
  "/add",
  auth,
  upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'movieFile', maxCount: 1 }]),
  addMovie
);

// Fetch all movies (public)
router.get("/get", getMovie);

// Fetch single movie by ID (public)
router.get("/get/:id", getSingleMovie);

// Fetch movies by user (protected)
router.get("/user/:userId", auth, getUserMovie);

export default router;
