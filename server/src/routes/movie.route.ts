import express from 'express'

import { addMovie, getMovie, getSingleMovie } from '../controllers/movie.controller'
import { auth } from '../middleware/auth'
import { upload } from '../middleware/multer'
const router = express.Router()

router.post("/add", auth, upload.fields([{ name: 'poster', maxCount: 1}, { name: 'movieFile', maxCount: 1}]), addMovie)

router.get("/get", auth, getMovie)

router.get("/get/:id", auth, getSingleMovie)


export default router;