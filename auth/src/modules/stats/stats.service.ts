import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppErrorWithMessage } from '../../base/app-error';
import { ApplicationBaseModelService } from '../../base/base-model.service';
import { UsersService } from '../users/users.service';
import { GetStatResponse, GetStatsResponse, StatDto } from './stat-dto';
import { Stat } from './stat.entity';

@Injectable()
export class StatsService extends ApplicationBaseModelService<Stat, StatDto, GetStatResponse, GetStatsResponse> {
    constructor(
        @InjectRepository(Stat)
        public readonly repository: Repository<Stat>,
        public readonly userService: UsersService,
    ) {
        super();
        this.modelOptions = {
            getManyResponse: GetStatsResponse,
            getOneResponse: GetStatResponse,
            getManyResponseField: 'stats',
            getOneResponseField: 'stat',
            repository: this.repository,
            entity: Stat,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }

    @Cron(CronExpression.EVERY_DAY_AT_1AM, {
        name: 'user-stats',
        timeZone: 'Europe/Paris'
    })
    async setUserStats() {
        try {
            const getUserLenght = await this.userService.findAll();
            if (!getUserLenght.success)
                throw new AppErrorWithMessage(getUserLenght.message);
            const userLength = getUserLenght.users.length;
            const findUserStat = await super.findOne({ where: { label: 'userStat' } });
            let stat = {} as StatDto;
            if (findUserStat.success && findUserStat.stat?.id) {
                stat = findUserStat.stat;
                stat.value = userLength;
            } else {
                stat = { label: 'userStat', value: userLength, archived: false };
            }
            await super.createOrUpdate(stat);
            console.log('\x1b[34m', "Cron task setUserStats updated ");
        } catch (error) {
            throw new AppErrorWithMessage(error);
        }
    }
}