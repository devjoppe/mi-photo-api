// Import modules
import express from "express";

// Import source
import {validateToken} from "../middleware/jwt";
import {index} from '../controllers/albums_controller'
//import {photoValidation} from "../validations/photo_validation"; //TODO: new validation

const router = express.Router()

// GET albums
router.get('/', validateToken, index)

export default router