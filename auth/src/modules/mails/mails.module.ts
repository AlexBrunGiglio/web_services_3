import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { Environment } from '../../environment/environment';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailsService } from './mails.service';

@Global()
@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: Environment.smtp_host,
                secure: false,
                auth: {
                    user: Environment.smtp_user,
                    pass: Environment.smtp_password,
                },
            },
            defaults: {
                from: '"No reply" <noreply-' + Environment.smtp_host + '>',
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [MailsService],
    exports: [MailsService],
})
export class MailModule { }