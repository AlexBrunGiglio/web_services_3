import { HttpException, HttpStatus } from "@nestjs/common";

export class ExpiredTokenException extends HttpException {
    constructor() {
        super('Forbidden', HttpStatus.FORBIDDEN);
    }
}