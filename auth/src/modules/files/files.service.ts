import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationBaseModelService } from '../../base/base-model.service';
import { FileDto, GetFileResponse, GetFilesResponse } from './file-dto';
import { File } from './file.entity';

@Injectable()
export class FilesService extends ApplicationBaseModelService<File, FileDto, GetFileResponse, GetFilesResponse> {
    constructor(
        @InjectRepository(File)
        public readonly repository: Repository<File>,
    ) {
        super();
        this.modelOptions = {
            getManyResponse: GetFilesResponse,
            getOneResponse: GetFileResponse,
            getManyResponseField: 'files',
            getOneResponseField: 'file',
            repository: this.repository,
            entity: File,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
}