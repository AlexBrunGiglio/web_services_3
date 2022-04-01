import { Body, Controller, Delete, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Like } from 'typeorm';
import { RolesList } from '../../../../shared/shared-constant';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthToolsService } from '../../auth/services/tools.service';
import { BaseSearchRequest } from '../../base/base-search-request';
import { BaseController } from '../../base/base.controller';
import { GenericResponse } from '../../base/generic-response';
import { Roles } from '../../base/services/roles.decorator';
import { GetLogsRequest, GetLogsResponse } from './log-dto';
import { Log } from './log.entity';
import { LogsService } from './logs.service';

@ApiTags('logs')
@Controller('logs')
export class LogsController extends BaseController {
    constructor(
        private readonly logService: LogsService,
        private readonly authToolsService: AuthToolsService,

    ) {
        super();
    }
    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all logs', operationId: 'getAllLogs' })
    @ApiResponse({ status: 200, description: 'Get all logs', type: GetLogsResponse })
    @HttpCode(200)
    async getAll(@Body() request: GetLogsRequest): Promise<GetLogsResponse> {
        const findOptions = BaseSearchRequest.getDefaultFindOptions<Log>(request);
        if (request.search) {
            if (!findOptions.where)
                findOptions.where = [{}];
            findOptions.where = [
                {
                    code: Like('%' + request.code + '%'),
                },
            ]
        }
        return await this.logService.findAll(findOptions);
    }

    // @UseGuards(RolesGuard)
    // @Roles(RolesList.Admin)
    @Delete()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete logs', operationId: 'deleteLogs' })
    @ApiResponse({ status: 200, description: 'Delete logs from ID', type: GenericResponse })
    @HttpCode(200)
    async deleteUsers(@Query('logIds') logIds: string): Promise<GenericResponse> {
        let response = new GenericResponse();
        try {
            response = await this.logService.delete(logIds.split(','));
        } catch (error) {
            console.log("🚀 ~ LogsController ~ deleteUsers ~ error", error);
            response.handleError(error);
        }
        return response;
    }
}