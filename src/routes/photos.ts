// Import modules
import express from "express";

// Import source
import {validateToken} from "../middleware/jwt";
import {index, show} from '../controllers/photos_controller'

const router = express.Router()

// GET photos
router.get('/', validateToken, index)

// GET Photo by ID
router.get('/:id', validateToken, show)

export default router