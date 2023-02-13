// Import modules
import {Request, Response} from "express"
// import {matchedData, validationResult} from "express-validator";

// Import source
import {getAllAlbums} from "../services/albums_service";

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