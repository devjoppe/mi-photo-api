// Import moduels
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Import source
import {jwtPayload} from "../types/user";

export const validateToken = (req:Request, res:Response, next:NextFunction) => {
    // Check auth header -> Important
    if(!req.headers.authorization) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization failed"
        })
    }
    // Split header


    // Check auth schema

    // Verify
}