// Import modules
import express from "express"

// Import source
import { register, loginUser } from "../controllers/user_controller";
import { registerUserValidation } from "../validations/user_validation";

// instantiate a new router
const router = express.Router()

/**
 * GET /
 */
router.get('/', (req, res) => {
	res.send({
		message: "Machine intelligence is the last invention that humanity will ever need to make.",
	})
})

// POST - login
router.post('/login', loginUser)

// POST - register
router.post('/register', registerUserValidation, register)

export default router