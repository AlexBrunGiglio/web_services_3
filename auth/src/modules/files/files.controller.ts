import { Body, Controller, Get, HttpCode, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Like } from 'typeorm';
import { AuthToolsService } from '../../auth/services/tools.service';
import { AppErrorWithMessage } from '../../base/app-error';
import { BaseSearchRequest } from '../../base/base-search-request';
import { BaseController } from '../../base/base.controller';
import { UsersService } from '../users/users.service';
import { FileDto, GetFileResponse, GetFilesResponse } from './file-dto';
import { File } from './file.entity';
import { FilesService } from './files.service';

@ApiTags('files')
@Controller('files')
export class FilesController extends BaseController {
    constructor(
        private readonly filesService: FilesService,
        private readonly authToolsService: AuthToolsService,
        private readonly userService: UsersService,

    ) {
        super();
    }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all file', operationId: 'getAllFiles' })
    @ApiResponse({ status: 200, description: 'Get all file', type: GetFilesResponse })
    @HttpCode(200)
    async getAll(@Body() request: BaseSearchRequest): Promise<GetFilesResponse> {
        const findOptions = BaseSearchRequest.getDefaultFindOptions<File>(request);
        if (request.search) {
            if (!findOptions.where)
                findOptions.where = [{}];
            findOptions.where = [
                {
                    userId: Like('%' + request.search + '%'),
                },
            ]
        }
        return await this.filesService.findAll(findOptions);
    }

    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get file', operationId: 'getFile' })
    @ApiResponse({ status: 200, description: 'Get file', type: GetFileResponse })
    @HttpCode(200)
    async get(@Param('id') id: string): Promise<GetFileResponse> {
        return await this.filesService.findOne({ where: { id: id } });
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/temp', filename: (req, file, callback) => {

                const fileExtName = extname(file.originalname);
                const randomName = Array(30)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                callback(null, `${randomName}${fileExtName}`);
                return randomName;
            },
        }),
    }))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Upload a file', operationId: 'UploadFile' })
    @ApiResponse({ status: 200, description: 'Upload a file', type: GetFileResponse })
    @HttpCode(200)
    async uploadSingle(@UploadedFile() file: Express.Multer.File): Promise<GetFileResponse> {
        const response = new GetFileResponse();
        try {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!payload.id)
                throw new AppErrorWithMessage("Vous n'avez pas la possibilité d'effectuer cette action.");

            const fileToSave = new FileDto();
            fileToSave.name = file.filename;
            fileToSave.type = file.mimetype;
            fileToSave.path = file.path;
            fileToSave.originalname = file.originalname;
            fileToSave.userId = payload.id;

            const saveFileForUser = await this.filesService.createOrUpdate(fileToSave);

            if (!saveFileForUser.success)
                throw new AppErrorWithMessage(saveFileForUser.message);
            response.file = saveFileForUser.file;
            response.success = true;
        } catch (error) {
            response.handleError(error);
        }
        return response;
    }
}