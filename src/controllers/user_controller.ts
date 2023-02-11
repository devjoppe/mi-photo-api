import Debug from 'debug'
import { Request, Response } from 'express'

const debug = Debug('prisma-photos:user_controller')

// Register a new user
export const register = async (req:Request, res:Response) => {
    const { email, password } = req.body
    console.log("req.body: ", email, password)
}