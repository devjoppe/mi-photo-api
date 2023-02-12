// Import modules
import {Request, Response} from "express"
import prisma from "../prisma"

// Import source
import {getAllPhotos} from "../services/photos_service";
import {photo} from "../types/photos";

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