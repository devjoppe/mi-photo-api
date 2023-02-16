// Validation of user
// Import modules
import { body } from 'express-validator'

// Import source
import { getUserByEmail } from "../services/user_service";

export const registerUserValidation = [
    body('first_name').isString().bail().isLength({ min: 3 }).trim(),
    body('last_name').isString().bail().isLength({ min: 3 }).trim(),
    body('email').isEmail().bail().custom(async (value:string) => {
        const user = await getUserByEmail(value)
        if(user) {
            return Promise.reject("Could not create user")
        }
    }),
    body('password').isString().bail().isLength({ min: 6 }).trim()
]