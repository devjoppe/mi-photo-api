// Import moduels
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Import source
import {jwtPayload} from "../types/user";

export const valToken = (req:Request, res:Response, next:NextFunction) => {
    // Check auth header -> Important

    // Split header

    // Check auth schema

    // Verify
}