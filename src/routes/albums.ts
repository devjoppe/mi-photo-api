// Import modules
import express from "express";

// Import source
import {validateToken} from "../middleware/jwt";
import {index, show, store} from '../controllers/albums_controller'
import {albumValidation} from "../validations/album_validation";

const router = express.Router()

// GET albums
router.get('/', validateToken, index)

// GET single album
router.get('/:id', validateToken, show)

// Post album
router.get('/', albumValidation, validateToken, store)

export default router