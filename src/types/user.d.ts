// Declaration of user

export type registerUser = {
    email: string,
    password: string,
    first_name: string,
    last_name: string
}

export type jwtPayload = {
    sub: number,
    email: string,
    iat?: number,
    exp?: number
}