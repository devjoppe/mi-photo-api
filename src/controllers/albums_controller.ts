// Import modules
import {Request, Response} from "express"
// import {matchedData, validationResult} from "express-validator";

// Import source
import {getAllAlbums, getSingleAlbum, createAlbum} from "../services/albums_service";
import {matchedData, validationResult} from "express-validator";

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
                photos: singleAlbum!.photos.map(rel => { {return rel.Photo}})
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