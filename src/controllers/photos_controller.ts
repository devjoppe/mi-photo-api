// Import modules
import {Request, Response} from "express"
import {matchedData, validationResult} from "express-validator";

// Import source
import {getAllPhotos, getPhoto, createPhoto, updatePhoto} from "../services/photos_service";

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
        return res.status(401).send({
            status: "fail",
            message: "Could not get user photos"
        })
    }
}

// GET Photo based on ID
export const show = async (req:Request, res:Response) => {
    try {
        const singlePhoto = await getPhoto(Number(req.params.id))
        if(singlePhoto!.userId == req.token!.sub){
            res.status(200).send({
                status: "success",
                data: {
                    id: singlePhoto!.id,
                    title: singlePhoto!.title,
                    url: singlePhoto!.url,
                    comment: singlePhoto?.comment
                }
            })
        } else {
            return res.status(401).send({
                status: "fail",
                message: "No permission to access this photo"
            })
        }
    } catch (err) {
        return res.status(401).send({
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
        return res.status(401).send({
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

    // Check valid photo
    const validPhoto = await getPhoto(Number(req.params.id))
    if(validPhoto!.userId == req.token!.sub) {
        try {
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
            return res.status(500).send({
                status: "error",
                message: "Could not update photo in database" })
        }
    } else {
        // Returns error if not users photo
        return res.status(500).send({
            status: "error",
            message: "User not authorized to update this photo" })
    }
}