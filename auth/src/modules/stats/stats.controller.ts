import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Like } from 'typeorm';
import { RolesList } from '../../../../shared/shared-constant';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthToolsService } from '../../auth/services/tools.service';
import { AppErrorWithMessage } from '../../base/app-error';
import { BaseSearchRequest } from '../../base/base-search-request';
import { BaseController } from '../../base/base.controller';
import { Roles } from '../../base/services/roles.decorator';
import { UsersService } from '../users/users.service';
import { GetStatResponse, GetStatsRequest, GetStatsResponse, StatDto } from './stat-dto';
import { Stat } from './stat.entity';
import { StatsService } from './stats.service';

@ApiTags('stats')
@Controller('stats')
export class StatsController extends BaseController {
    constructor(
        private readonly statsService: StatsService,
        private readonly authToolsService: AuthToolsService,
        private readonly userService: UsersService,

    ) {
        super();
    }
    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all stats', operationId: 'getAllStats' })
    @ApiResponse({ status: 200, description: 'Get all stats', type: GetStatsResponse })
    @HttpCode(200)
    async getAll(@Query() request: GetStatsRequest): Promise<GetStatsResponse> {
        const findOptions = BaseSearchRequest.getDefaultFindOptions<Stat>(request);
        if (request.search) {
            if (!findOptions.where)
                findOptions.where = [{}];
            findOptions.where = [
                {
                    label: Like('%' + request.search + '%'),
                },
            ]
        }
        return await this.statsService.findAll(findOptions);
    }

    @UseGuards(RolesGuard)
    @Get(':label')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get stat', operationId: 'getStat' })
    @ApiResponse({ status: 200, description: 'Get stat', type: GetStatResponse })
    @HttpCode(200)
    async get(@Param('label') label: string): Promise<GetStatResponse> {
        return await this.statsService.findOne({ where: { label: label } });
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.Visitor)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create or update stat', operationId: 'createOrUpdateStat' })
    @ApiResponse({ status: 200, description: 'Create or update stat', type: GetStatResponse })
    @HttpCode(200)
    async createOrUpdate(@Body() stat: StatDto): Promise<GetStatResponse> {
        let response = new GetStatResponse();
        try {
            if (!stat)
                throw new AppErrorWithMessage('Invalid Request');
            response = await this.statsService.createOrUpdate(stat);
        } catch (error) {
            response.handleError(error);
        }
        return response;
    }
}