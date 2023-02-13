// Import modules
import prisma from "../prisma";

// Import source
import {album, photoAlbum} from "../types/albums";

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
export const connectPhotoAlbum = async (photoAlbum:photoAlbum) => {
    return prisma.photosInAlbums.createMany({
        data: {
            albumId: photoAlbum.albumId,
            photoId: photoAlbum.photoId
        }
    })
}

// GET Photo in Albums
export const getPhotosToAlbums = async (photoId:number, albumId:number) => {
    return prisma.photosInAlbums.findMany({
        where: {
            photoId: photoId,
            albumId: albumId
        }
    })
}