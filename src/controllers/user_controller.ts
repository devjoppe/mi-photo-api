import Debug from 'debug'
import { Request, Response } from 'express'
import {matchedData, validationResult} from "express-validator";

const debug = Debug('prisma-photos:user_controller')

// Register a new user
export const register = async (req:Request, res:Response) => {
    const { email, password } = req.body

    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }

    const validatedData = matchedData(req)
    console.log("Validated data: ", validatedData)
}