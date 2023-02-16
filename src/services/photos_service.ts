// Import modules
import prisma from "../prisma";

// Import source
import {photo} from "../types/photos";

// GET all photos for a user
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

// Get All based on photo ID
export const getAllPhotosById = async (photoId:any) => {
    return prisma.photo.findMany({
        where: {
            id: {
                in: photoId
            }
        },
        select: {
            id: true,
            userId: true,
            albums: true
        }
    })
}

// GET one photo from user
export const getPhoto = async (id:number) => {
    return prisma.photo.findUnique({
        where: {
            id: id
        }
    })
}

// POST Photo
export const createPhoto = async (photoData:photo, userId:number) => {
    return prisma.photo.create({
        data: {
            title: photoData.title,
            url: photoData.url,
            comment: photoData.comment,
            userId: userId
        }
    })
}

// PATCH Photo
export const updatePhoto = async (photoData:photo, photoId:number) => {
    return prisma.photo.update({
        where: {
            id: photoId,
        },
        data: {
            title: photoData.title,
            url: photoData.url,
            comment: photoData.comment
        }
    })
}

// DELETE photo
export const deletePhoto = async (photoId:number) => {
    return prisma.photo.delete({
        where: {
            id: photoId
        }
    })
}

// DELETE Disconnect photo from Albums
export const disconnectFromAlbums = async (photoId:number, albumsId:any) => {
    return prisma.photo.update({
        where: {
            id: photoId
        },
        data: {
            albums: {
                disconnect: albumsId
            }
        }
    })
}