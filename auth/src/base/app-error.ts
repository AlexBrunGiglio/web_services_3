import { MainHelpers } from "./main-helper";

export class AppError extends Error {
    public guid: string;
    constructor(public technicalMessage: string, public code?: number) {
        super(technicalMessage);
        this.guid = MainHelpers.generateUUID();
    }

    public static getBadRequestError(): AppError {
        return new AppError('Bad Request', 400);
    }
}

export class AppErrorWithMessage extends AppError {
    constructor(public message: string, public code?: number) {
        super(message, code);
        this.message = message;
    }
}