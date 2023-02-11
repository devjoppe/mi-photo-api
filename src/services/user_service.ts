// Import modules
import prisma from "../prisma";

// Import source
import { registerUser } from "../types/user";

// POST
// Register new user

// GET
// Get user by email
export const getUserByEmail = async (email:string) => {
    return prisma.user.findUnique({
        where: {
            email: email
        }
    })
}
