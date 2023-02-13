// Photo validation
// Import modules
import { body } from 'express-validator'

export const photoValidation = [
    body('title').isString().bail().isLength({ min: 3 }),
    body('url').isString().bail().isLength({ min: 3 }).custom((value:string) => {
        try {
            const checkURL = new URL(value)
            if(checkURL){
                return true
            }
        } catch (err) {
            return Promise.reject("That is not a valid URL")
        }
    }),
    body('comment').isString().bail().isLength({ min: 3 })
]