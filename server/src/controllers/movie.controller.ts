import { Movie as MovieType } from '../types'
import { v4 as uuidv4 } from 'uuid'
import sanitizeHtml from 'sanitize-html'
import { Request, Response } from 'express'
import Movie from '../models/movie.model'
import cloudinary from '../config/cloudinary'


export const addMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as { [ fieldName: string]: Express.Multer.File[]}
        const { title, genres, year, rating, review, trailerUrl} = req.body

        if(!title || !genres || !files['poster'] || !files['movieFile'] || !year || !rating || !review){
            res.status(400).json({
                success: false,
                error: 'All required fields must be provided'
            })
        }

        const cleanTitle = sanitizeHtml(title)
        const cleanGenres = JSON.parse(genres).map((g: string) => sanitizeHtml(g))
        const cleanReview = sanitizeHtml(review)
        const cleanTrailer = trailerUrl ? sanitizeHtml(trailerUrl) : undefined

        const posterUpload = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {resource_type: 'image', 
                    upload_preset: process.env.CLOUDINARY_POSTER_PRESET
                },
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            ).end(files['poster'][0].buffer)
        }) as any;

         const videoUpload = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {resource_type: 'video', 
                    upload_preset: process.env.CLOUDINARY_VIDEO_PRESET
                },
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            ).end(files['movieFile'][0].buffer)
        }) as any;

        const movie = new Movie({
            id: uuidv4(),
            title: cleanTitle,
            poster: posterUpload.secure_url,
            fileUrl: videoUpload.secure_url,
            genres: cleanGenres,
            year: parseInt(year),
            rating: parseInt(rating),
            review: cleanReview,
            recommendedBy: req.user!.userId,
            trailerUrl: cleanTrailer
        })
        await movie.save()

        res.status(201).json({
            success: true,
            movie
        })
        return;
        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            error: 'Failerd to upload movie'
        })
    }
}

export const getMovie = async (req: Request, res: Response): Promise<void> => {
    try {
    const movies = await Movie.find();
     res.status(200).json(movies)
     return;
     ;
  } catch (error) {
    console.error(error);
     res.status(500).json({
        success: false,  
        error: 'Failed to fetch movies' 
    }) 
    return;
  }
}

export const getSingleMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const movie = await Movie.findOne({ id: req.params.id });
        if (!movie) {
            res.status(404).json({
                success: false,
                error: 'Movie not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            movie
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch movie'
        });
        return;
    }
}