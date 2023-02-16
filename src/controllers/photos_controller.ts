// Import modules
import {Request, Response} from "express"
import {matchedData, validationResult} from "express-validator";

// Import source
import {getAllPhotos, getPhoto, createPhoto, updatePhoto, deletePhoto, disconnectFromAlbums} from "../services/photos_service";
import {getAlbumPhotoId} from "../services/albums_service";

// GET All photos
export const index = async (req:Request, res:Response) => {
    try {
        // Get all photos from user
        const allPhotos = await getAllPhotos(req.token!.sub)
        res.status(200).send({
            status: "success",
            data: allPhotos
        })
    } catch (err) {
        return res.status(400).send({
            status: "fail",
            message: "Could not get user photos"
        })
    }
}

// GET Photo based on ID
export const show = async (req:Request, res:Response) => {
    try {
        const singlePhoto = await getPhoto(Number(req.params.id))
        if(singlePhoto!.userId !== req.token!.sub){
            return res.status(401).send({
                status: "fail",
                message: "No permission to access this photo"
            })
        }
        res.status(200).send({
            status: "success",
            data: {
                id: singlePhoto!.id,
                title: singlePhoto!.title,
                url: singlePhoto!.url,
                comment: singlePhoto?.comment
            }
        })
    } catch (err) {
        return res.status(400).send({
            status: "fail",
            message: "Could not get user photo"
        })
    }
}

// POST new user photo
export const store = async (req:Request, res:Response) => {

    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }
    const validatedData = matchedData(req)

    try {
        const newPhoto = await createPhoto({
            title: validatedData.title,
            url: validatedData.url,
            comment: validatedData.comment,
        }, Number(req.token!.sub))

        res.status(201).send({
            status: "success",
            data: {
                "title": newPhoto.title,
                "url": newPhoto.url,
                "comment": newPhoto.comment,
                "user_id": newPhoto.userId,
                "id": newPhoto.id
            }
        })
    } catch (err){
        return res.status(400).send({
            status: "fail",
            message: "Could not create new photo"
        })
    }
}

// PATCH existing photo
export const update = async (req:Request, res:Response) => {

    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }
    const validatedData = matchedData(req)

    try {
        // Check valid photo
        const validPhoto = await getPhoto(Number(req.params.id))
        if(validPhoto!.userId !== req.token!.sub) {
            return res.status(401).send({
                status: "fail",
                message: "User not authorized to update this photo"
            })
        }
        // Update photo
        const patchPhoto = await updatePhoto({
            title: validatedData.title,
            url: validatedData.url,
            comment: validatedData.comment,
        },Number(validPhoto!.id))

        res.status(200).send({
            status: "success",
            data: patchPhoto
        })
    } catch (err) {
        return res.status(400).send({
            status: "error",
            message: "Could not update photo" })
    }
}

// DELETE Photo
export const destroy = async (req:Request, res:Response) => {

    try {
        // Check valid photo
        const validPhoto = await getPhoto(Number(req.params.id))
        // Not authorized user
        if(validPhoto!.userId !== req.token!.sub) {
            return res.status(401).send({
                status: "fail",
                message: "You are not authorized to remove this photo"
            })
        }
        // Remove connection to albums and then delete the photo
        // Get albums this photo is a part of
        const photoAlbum = await getAlbumPhotoId(Number(validPhoto!.id))
        const albumIds = photoAlbum.map(item => {
            return {id: item.id}
        })

        await disconnectFromAlbums(Number(validPhoto!.id), albumIds)
        await deletePhoto(Number(validPhoto!.id))
        res.status(200).send({
            status: "success",
            data: null
        })
    } catch (err) {
        return res.status(400).send({
            status: "error",
            message: "Could not remove photo"
        })
    }
}