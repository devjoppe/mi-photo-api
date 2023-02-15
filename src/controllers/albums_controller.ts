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
    console.log("Check the photo ID: ", validPhoto)
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
        console.log("Error: ", err)
        return res.status(401).send({
            status: "fail",
            message: "Could not add photo to album"
        })
    }
}

// DELETE connection between album and photo
export const destroyPhoto = async (req:Request, res:Response) => {
    try {
        await deletePhotoConnection()
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