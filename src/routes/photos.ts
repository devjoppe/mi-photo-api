// Import modules
import express from "express";

// Import source
import {validateToken} from "../middleware/jwt";
import {index, show, store} from '../controllers/photos_controller'
import {createPhotoValidation} from "../validations/photo_validation";

const router = express.Router()

// GET photos
router.get('/', validateToken, index)

// GET Photo by ID
router.get('/:id', validateToken, show)

// POST Photo
router.post('/', createPhotoValidation, validateToken, store)

export default router