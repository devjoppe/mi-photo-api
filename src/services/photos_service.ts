// Import modules
import prisma from "../prisma";

// GET
// Get all photos for a user
export const getAllPhotos = async (userId:number) => {
    return prisma.photo.findMany({
        where: {
            userId: userId
        },
        select: {
            id: true,
            title: true,
            url: true,
            comment: true
        }
    })
}