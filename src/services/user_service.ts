// Import modules
import prisma from "../prisma";

// Import source
import { registerUser as userTypes } from "../types/user"

// POST
// Register new user
export const registerUser = (userData:userTypes) => {
    return prisma.user.create({
        data: userData
    })
}

// GET
// Get user by email
export const getUserByEmail = async (email:string) => {
    return prisma.user.findUnique({
        where: {
            email: email
        }
    })
}
