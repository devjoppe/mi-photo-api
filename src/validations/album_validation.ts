// Album validation
// Import modules
import {body} from 'express-validator'

export const albumValidation = [
    body('title').isString().bail().isLength({ min: 3 })
]