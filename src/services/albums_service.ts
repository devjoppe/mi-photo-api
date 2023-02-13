// Import modules
import prisma from "../prisma";

// GET all Albums
export const getAllAlbums = async (userId:number) => {
    return prisma.album.findMany({
        where: {
            userId: userId
        }
    })
}