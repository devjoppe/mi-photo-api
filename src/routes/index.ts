// Import modules
import express from "express"
import resource from './_router'

// Import source
import { register } from "../controllers/user_controller";
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

router.post('/register', registerUserValidation, register)

export default router
