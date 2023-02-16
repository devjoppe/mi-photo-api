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
    deletePhotoConnection
} from "../services/albums_service";
import {getAllPhotosById} from "../services/photos_service";

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

    // Validation
    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }

    const validatedData = matchedData(req)

    // Check if albums exists and is connected to the user
    const validAlbum = await getSingleAlbum(Number(req.params.id))
    if(!validAlbum || validAlbum.userId !== Number(req.token!.sub)) {
        return res.status(401).send({
            status: "error",
            message: "You are not authorized to add this photo"
        })
    }

    // Variable for setting the correct data type
    const baseId = validatedData.photo_id

    let photoIds = baseId
    if(!isNaN(baseId)) {
        photoIds = [baseId]
    }
    // Check if photo is owned by user
    let validPhoto = await getAllPhotosById(photoIds)
    let isValid = true
    validPhoto.forEach(item => {
        if(!item || item.userId !== Number(req.token!.sub)) {
            isValid = false
        }
    })
    if(!isValid){
        return res.status(500).send({
            status: "Error",
            message: "You are not Authorized or the photo could not be found"
        })
    }

    // Check if the photo already exists in Album
    for(let i=0; i < validPhoto.length; i++) {
        let checkAlbum = validPhoto[i].albums
        if(checkAlbum.length > 0) {
            if(checkAlbum[0].id == Number(req.params.id)) {
                return res.status(400).send({
                    status: "fail",
                    message: "The photos you trying to add already exists in album"
                })
            }
        }
    }

    // correct type before sending in to ConnectPhotoAlbum service
    let connectId
    if(isNaN(baseId)) {
         connectId = baseId.map((item:number) => {
            return {id: item}
        })
    } else {
        connectId = {id: baseId}
    }

    try {
        await connectPhotoAlbum(connectId, Number(req.params.id))
        res.status(200).send({
            status: "success",
            data: null
        })
    } catch (err) {
        return res.status(401).send({
            status: "fail",
            message: "Could not add photo to album"
        })
    }
}

// DELETE album without deleting photos - Just remove the connections.
export const destroy = async (req:Request, res:Response) => {
    // Check if album exist and that the user is the owner
    const validAlbum = await getSingleAlbum(Number(req.params.id))
    if(!validAlbum || req.token!.sub !== validAlbum.userId) {
        return res.status(400).send({
            status: "fail",
            message: "Not authorized or the album does not exist"
        })
    }

    // Get all images from the album
    console.log("Get all photos in album: ", validAlbum.photos)
    const photoIds = validAlbum.photos.map(item => {
        return {id: item.id}
    })

    try {
        await deletePhotoConnection(photoIds, Number(req.params.id))

        console.log("WORKING")
    } catch (err) {
        return res.status(401).send({
            status: "fail",
            message: "Could not delete the album"
        })
    }
}

// DELETE connection between album and photo
export const destroyPhoto = async (req:Request, res:Response) => {

    const photoId = [ Number(req.params.photoId) ]
    // Get the image the user wants to disconnect
    let validPhoto = await getAllPhotosById(photoId)

    // Does the photo exists or is the photo connected to an album??
    if(validPhoto.length <= 0 || validPhoto[0].albums.length <= 0) {
        return res.status(400).send({
            status: "fail",
            message: "No photo found, or the photo is not part of this album"
        })
    }
    // Check if the album exists and if the user owns the album
    // Does not need to check if photo is the users. If it is in album then the validation is already done.
    if(req.token!.sub !== validPhoto[0].albums[0].userId || Number(req.params.albumId) !== validPhoto[0].albums[0].id) {
        return res.status(401).send({
            status: "fail",
            message: "You are not authorized on this album"
        })
    }
    try {
        await deletePhotoConnection({id: Number(req.params.photoId)}, Number(req.params.albumId))
        res.status(200).send({
            status: "success",
            data: null
        })
    } catch (err) {
        return res.status(401).send({
            status: "fail",
            message: "Could not remove photo from album"
        })
    }
}