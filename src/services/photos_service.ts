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

export const getPhoto = async (id:number) => {
    return prisma.photo.findUnique({
        where: {
            id: id
        }
    })
}