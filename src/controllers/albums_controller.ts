// Import modules
import {Request, Response} from "express"
// import {matchedData, validationResult} from "express-validator";

// Import source
import {getAllAlbums, getSingleAlbum} from "../services/albums_service";

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
            data: singleAlbum
        })
    } catch(err) {
        return res.status(401).send({
            status: "fail",
            message: "Could not get user album"
        })
    }
}