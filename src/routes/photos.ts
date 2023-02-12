// Import modules
import express from "express";

// Import source
import {validateToken} from "../middleware/jwt";
import {index} from '../controllers/photos_controller'

const router = express.Router()

// GET photos
router.get('/', validateToken, index)

export default router