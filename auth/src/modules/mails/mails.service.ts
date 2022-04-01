import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { GenericResponse } from '../../base/generic-response';
import { Environment } from '../../environment/environment';
import { UserDto } from '../users/user-dto';

@Injectable()
export class MailsService {
    constructor
        (
            private mailerService: MailerService
        ) { }

    async sendUserConfirmation(user: UserDto, token: string): Promise<GenericResponse> {
        const response = new GenericResponse();
        try {
            const url = Environment.app_origin_url + `/auth/confirm?token=${token}`;

            await this.mailerService.sendMail({
                to: user.mail,
                subject: 'Bienvenue sur Taiga app ! Veuillez confirmer votre email !',
                template: 'confirm-account',
                context: {
                    name: user.firstname + ' ' + user.lastname,
                    url,
                },
            });
            response.success = true;
        } catch (error) {
            response.handleError(error)
        }
        return response;
    }
}
