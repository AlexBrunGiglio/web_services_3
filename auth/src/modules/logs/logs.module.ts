import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCommonModule } from '../../shared/common.module';
import { Log } from './log.entity';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';

@Module({
    imports: [
        AppCommonModule,
        TypeOrmModule.forFeature([
            Log,
        ]),
    ],
    controllers: [LogsController],

    providers: [LogsService],
    exports: [LogsService],
})
export class LogsModule {

}