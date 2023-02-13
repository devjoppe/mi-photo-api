// Import modules
import express from "express";

// Import source
import {validateToken} from "../middleware/jwt";
import {index, show, store, update, destroy} from '../controllers/photos_controller'
import {photoValidation} from "../validations/photo_validation";

const router = express.Router()

// GET photos
router.get('/', validateToken, index)

// GET Photo by ID
router.get('/:id', validateToken, show)

// POST Photo
router.post('/', photoValidation, validateToken, store)

// PATCH Photo
router.patch('/:id', photoValidation, validateToken, update)

// DELETE Photo
// TODO: Update this with Albums
router.delete('/:id', validateToken, destroy)

export default router