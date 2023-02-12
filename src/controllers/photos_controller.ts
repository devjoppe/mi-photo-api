// Import modules
import {Request, Response} from "express"
import prisma from "../prisma"

// Import source
import {getAllPhotos, getPhoto} from "../services/photos_service";
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

}