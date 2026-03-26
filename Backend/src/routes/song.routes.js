import express from 'express'
import {upload} from '../middlewares/upload.middlewares.js'
import { uploadSong } from '../controllers/song.controllers.js';

const songRouter = express.Router();

songRouter.post("/", upload.single("song"), uploadSong)

export default songRouter;