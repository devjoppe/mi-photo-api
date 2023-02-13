// Album validation
// Import modules
import {body} from 'express-validator'

export const albumValidation = [
    body('title').isString().bail().isLength({ min: 3 })
]

export const photoToAlbumValidation = [
    body('photo_id').custom((value) => {
        try {
            if(typeof value == 'number') {
                return true
            }
            if(Array.isArray(value)) {
                return true
            }
        } catch (err) {
            return Promise.reject("That is not a valid type")
        }
    })
]