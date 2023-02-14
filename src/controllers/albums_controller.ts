// Import modules
import {Request, Response} from "express"
import {matchedData, validationResult} from "express-validator";

// Import source
import {
    getAllAlbums,
    getSingleAlbum,
    createAlbum,
    updateSingleAlbum,
    connectPhotoAlbum,
} from "../services/albums_service";
import {getPhoto} from "../services/photos_service";

// GET All Albums
export const index = async (req:Request, res:Response) => {
    try {
        const allAlbums = await getAllAlbums(req.token!.sub)
        res.status(200).send({
            status: "success",
            data: allAlbums
        })
    }catch (err) {
        return res.status(401).send({
            status: "fail",
            message: "Could not get user Albums"
        })
    }
}

// GET single album
export const show = async (req:Request, res:Response) => {
    try {
        const singleAlbum = await getSingleAlbum(Number(req.params.id))
        if(singleAlbum!.userId !== req.token!.sub) {
            return res.status(401).send({
                status: "fail",
                message: "No permission to access this album"
            })
        }
        res.status(200).send({
            status: "success",
            data: {
                id: singleAlbum!.id,
                title: singleAlbum!.title,
                // TODO: This one below needs to be fixed
                //photos: singleAlbum!.photos.map(rel => { {return rel.photos}})
            }
        })
    } catch(err) {
        return res.status(401).send({
            status: "fail",
            message: "Could not get user album"
        })
    }
}

// POST Album
export const store = async (req:Request, res:Response) => {
    // Validating request body
    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }
    const validatedData = matchedData(req)

    try {
        const newAlbum = await createAlbum({
            title: validatedData.title,
            userId: Number(req.token!.sub)
        })

        res.status(200).send({
            status: "success",
            data: newAlbum
        })
    } catch (err) {
        return res.status(401).send({
            status: "fail",
            message: "Could not create new photo"
        })
    }
}

// PATCH album
export const update = async (req:Request, res:Response) => {

    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }

    const validatedData = matchedData(req)
    // Check if Album exists
    const validAlbum = await getSingleAlbum(Number(req.params.id))
    if(!validAlbum || validAlbum.userId !== Number(req.token!.sub)) {
        return res.status(500).send({
            status: "error",
            message: "Could not get the Album"
        })
    }
    try {
        const updateAlbum = await updateSingleAlbum({
            title: validatedData.title,
            userId: Number(req.token!.sub)
        }, Number(req.params.id))
        res.status(201).send({
            status: "success",
            data: updateAlbum
        })
    } catch (err) {
        return res.status(401).send({
            status: "fail",
            message: "Could not update album"
        })
    }
}

// POST photos to album
export const storePhotos = async (req:Request, res:Response) => {

    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }

    const validatedData = matchedData(req)

    console.log("Check if there is something: ", validatedData.photo_id)
    console.log("TYPE OF: ", typeof validatedData.photo_id)

    // Check if albums exists and is connected to the user
    /* const validAlbum = await getSingleAlbum(Number(req.params.id))
    if(!validAlbum || validAlbum.userId !== Number(req.token!.sub)) {
        return res.status(401).send({
            status: "error",
            message: "You are not authorized to add this photo"
        })
    }
    // Check if photo is on the user
    const checkPhoto = async (photoId:number) => {
        const validPhoto = await getPhoto(photoId)
        if(!validPhoto || validPhoto!.userId !== Number(req.token!.sub)) {
            return res.status(500).send({
                status: "Error",
                message: "You are not Authorized or the photo could not be found"
            })
        }
    }
    validatedData.photo_id.forEach((item:number) => {
        checkPhoto(item)
    }) */
    // Check if Photo already is in album
    /* const validPhotoAlbum = await getPhotosToAlbums(validatedData.photo_id, Number(req.params.id))
    console.log("Check if there is something: ", validPhotoAlbum)
    if(validPhotoAlbum.length > 0) {
        return res.status(401).send({
            status: "fail",
            message: "Photo already exists in album "
        })
    } */
    // Send added photos to the photo_to_album service
    let photoIds
    if(isNaN(validatedData.photo_id)) {
         photoIds = validatedData.photo_id.map((item:number) => {
            return {id: item}
        })
    } else {
        photoIds = {id: validatedData.photo_id}
    }

    console.log("TYPE OF: ", photoIds)

    try {
        await connectPhotoAlbum(photoIds, Number(req.params.id))
        res.status(200).send({
            status: "success",
            data: null
        })
    } catch (err) {
        console.log("Error: ", err)
        return res.status(401).send({
            status: "fail",
            message: "Could not add photo to album"
        })
    }
}