import express from "express"
import resource from './_router'

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

router.post('/register', register) //Setup a middleware to check validaton and rules.

export default router
