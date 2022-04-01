import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AppError, AppErrorWithMessage } from "./app-error";
import { MainHelpers } from "./main-helper";

export class GenericResponse {
    @ApiProperty()
    success: boolean;
    @ApiPropertyOptional()
    message?: string;
    @ApiPropertyOptional()
    error?: any;
    @ApiPropertyOptional()
    statusCode?: number;
    @ApiPropertyOptional()
    errorGuid?: string;
    @ApiPropertyOptional()
    token?: string;
    constructor(success = false, message = undefined) {
        this.success = success;
        this.message = message;
    }
    public async handleError(error: any) {
        this.success = false;
        let errorToLog: string;
        if (error instanceof AppErrorWithMessage) {
            this.message = error.message;
            errorToLog = this.message;
            if (error.technicalMessage) {
                errorToLog += "\n - Technical message : " + error.technicalMessage;
            }
            this.statusCode = error.code;
        }
        else if (error instanceof AppError) {
            if (error.technicalMessage)
                this.error = error.technicalMessage;
            else
                this.error = error.message;
            this.statusCode = error.code;
            this.errorGuid = error.guid;
            errorToLog = this.error + '\n---Stack---\n' + error.stack + '\n---End of Stack---';
        }
        else if (error instanceof Error) {
            this.error = error.message;
            errorToLog = this.error + '\n---Stack---\n' + error.stack + '\n---End of Stack---';
        }
        else {
            this.error = error;
            errorToLog = this.error;
        }

        if (!this.message) {
            if (!this.errorGuid)
                this.errorGuid = MainHelpers.generateUUID();
            this.message = `Une erreur s'est produite. Voici le code d'erreur à transmettre à l'administrateur :${this.errorGuid}.`;
        }
    }
}