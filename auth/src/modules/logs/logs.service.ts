import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationBaseModelService } from '../../base/base-model.service';
import { GetLogResponse, GetLogsResponse, LogDto } from './log-dto';
import { Log } from './log.entity';

@Injectable()
export class LogsService extends ApplicationBaseModelService<Log, LogDto, GetLogResponse, GetLogsResponse> {
    constructor(
        @InjectRepository(Log)
        public readonly repository: Repository<Log>,
    ) {
        super();
        this.modelOptions = {
            getManyResponse: GetLogsResponse,
            getOneResponse: GetLogResponse,
            getManyResponseField: 'logs',
            getOneResponseField: 'log',
            repository: this.repository,
            entity: Log,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
}