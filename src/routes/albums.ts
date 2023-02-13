// Import modules
import express from "express";

// Import source
import {validateToken} from "../middleware/jwt";
import {index, show, store, update} from '../controllers/albums_controller'
import {albumValidation} from "../validations/album_validation";

const router = express.Router()

// GET albums
router.get('/', validateToken, index)

// GET single album
router.get('/:id', validateToken, show)

// POST album
router.post('/', albumValidation, validateToken, store)

// PATCH album
router.patch('/:id', albumValidation, validateToken, update)

export default router