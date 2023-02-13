// Import modules
import express from "express";

// Import source
import {validateToken} from "../middleware/jwt";
import {index, show} from '../controllers/albums_controller'
//import {photoValidation} from "../validations/photo_validation"; //TODO: new validation

const router = express.Router()

// GET albums
router.get('/', validateToken, index)

// GET single album
router.get('/:id', validateToken, show)

export default router