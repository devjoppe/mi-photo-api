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

// GET single album
export const getSingleAlbum = async (albumId:number) => {
    return prisma.album.findUnique({
        where: {
            id: albumId
        },
        include: {
          photos: {
              include: {
                  Photo: {
                    select: {
                        id: true,
                        title: true,
                        url: true,
                        comment: true,
                        userId: true
                    }
                  }
              }
          }
        }
    })
}