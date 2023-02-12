// Import modules
import prisma from "../prisma";
import Debug from 'debug'
import {Request, Response} from 'express'
import {matchedData, validationResult} from "express-validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Import source
import { getUserByEmail, registerUser } from "../services/user_service";
import { jwtPayload } from "../types/user";

const debug = Debug('prisma-photos:user_controller')

// Register a new user
export const register = async (req:Request, res:Response) => {

    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }

    const validatedData = matchedData(req)

    // Hashed password
    validatedData.password = await bcrypt.hash(validatedData.password, Number(process.env.SALT_ROUNDS) || 10)

    // Store the new user to the database
    try {
        const user = await registerUser({
            first_name: validatedData.first_name,
            last_name: validatedData.last_name,
            email: validatedData.email,
            password: validatedData.password
        })

        res.status(201).send({
            status: "success",
            data: {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        })

    } catch(err){
        return res.status(500).send({
            status: "Error",
            message: "User could not be created"
        })
    }
}

// Login user
export const loginUser = async (req:Request, res:Response) => {
    const { email, password } = req.body

    // Find and check existing user
    const existingUser = await getUserByEmail(email)
    if(!existingUser) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization failed"
        })
    }

    // Check hash
    const hashCheck = await bcrypt.compare(password, existingUser.password)
    if(!hashCheck) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization failed"
        })
    }

    // JWT: payload construction - Keeping it to a minimum
    const jwtPayload:jwtPayload = {
        sub: existingUser.id,
        email: existingUser.email,
    }
    // JWT: check if access token is available -> Important validation
    if(!process.env.ACCESS_TOKEN_PASS) {
        return res.status(500).send({
            status: "error",
            message: "No access token available"
        })
    }
    // JWT: Sign
    const access_token = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_PASS, {
        expiresIn: process.env.ACCESS_TOKEN_EXP || '2h'
    })

    // ---
    // Refresh token
    // ---

    // JWT: Login response with jwt-token
    res.status(200).send({
        status: "success",
        data: {
            access_token
        }
    })
}