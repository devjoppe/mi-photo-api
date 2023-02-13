// Import modules
import prisma from "../prisma";
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
export const deletePhoto = async () => {

}