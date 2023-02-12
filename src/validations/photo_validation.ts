// Photo validation
// Import modules
import { body } from 'express-validator'

export const createPhotoValidation = [
    body('title').isString().bail().isLength({ min: 3 }),
    body('url').isString().bail().isLength({ min: 3 }),
    body('comment').isString().bail().isLength({ min: 3 })
]