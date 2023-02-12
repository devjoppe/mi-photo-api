// Import modules
import {Request, Response} from "express"
import prisma from "../prisma"

// Import source
import {getUserByEmail} from "../services/user_service";
import {getAllPhotos} from "../services/photos_service";

// GET All photos
export const index = async (req:Request, res:Response) => {
    try {
        // Get user
        const user = await getUserByEmail(req.token!.email)
        // Get all photos from user
        const allPhotos = await getAllPhotos(user!.id)
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