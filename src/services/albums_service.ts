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
          photos: true //TODO: Go back and rewrite this so the Output is correct
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

// PATCH Album
export const updateSingleAlbum = async (albumData:album, albumId:number) => {
    return prisma.album.update({
        where: {
            id: albumId
        },
        data: {
            title: albumData.title
        }
    })
}

// POST photos to album
export const connectPhotoAlbum = async (photoIds:any, albumIds:number) => {
    console.log("WHAT THE FUCK: ", photoIds)
    return prisma.album.update({
        where: { id: albumIds },
        data: {
            photos: {
                connect: photoIds,
            },
        },
    })
}