import { User } from '@prisma/client'
import {jwtPayload} from "../user";

declare global {
    namespace Express {
        export interface Request {
            token?: jwtPayload,
            user?: User
        }
    }
}