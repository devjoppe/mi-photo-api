// Import modules
import Debug from 'debug'
import {NextFunction, Request, Response} from 'express'
import jwt from 'jsonwebtoken'

// Import source
import {jwtPayload} from "../types/user";

const debug = Debug('prisma-photos:jwt')

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    // Check auth header -> Important
    if(!req.headers.authorization) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization failed"
        })
    }
    // Split header
    const [authSchema, token] = req.headers.authorization.split(" ")

    // Check auth schema
    if(authSchema.toLowerCase() !== "bearer") {
        return res.status(401).send({
            status: "fail",
            message: "Authorization failed"
        })
    }

    // Verify token
    try {
        req.token = (jwt.verify(token, process.env.ACCESS_TOKEN_PASS || "") as unknown) as jwtPayload
        debug(req.token) // <- Delete this one when I am done
    } catch (err) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization failed"
        })
    }
    // Go to next route
    next()
}