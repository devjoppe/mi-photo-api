// Import modules
import prisma from "../prisma";

// Import source
import {album} from "../types/albums";

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
                        userId: true // Look at this awesome V... Arrow-coding FTW!
                    }
                  }
              }
          }
        }
    })
}

// POST new album
export const createAlbum = async (albumData:album) => {
    return prisma.album.create({
        data: {
            title: albumData.title,
            userId: albumData.userId
        }
    })
}