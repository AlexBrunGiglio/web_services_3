export interface JwtPayload {
    username: string;
    id: string;
    roles: string[];
    mail: string;
    firstname: string;
    lastname?: string;
    imgUrl?: string;
}