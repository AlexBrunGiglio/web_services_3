import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCommonModule } from '../../shared/common.module';
import { Stat } from './stat.entity';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
    imports: [
        AppCommonModule,
        TypeOrmModule.forFeature([
            Stat,
        ]),
    ],
    controllers: [StatsController],

    providers: [StatsService],
    exports: [StatsService],
})
export class StatsModule {

}