import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../base/base.controller';
import { Roles } from '../../base/services/roles.decorator';
import { GetUserResponse, GetUsersRequest, GetUsersResponse, UserDto } from './user-dto';
import { UsersService } from './users.service';
import { RolesList } from '../../../../shared/shared-constant'
import { AppErrorWithMessage } from '../../base/app-error';
import { GenericResponse } from '../../base/generic-response';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthToolsService } from '../../auth/services/tools.service';
import { BaseSearchRequest } from '../../base/base-search-request';
import { User } from './user.entity';
import { FindConditions, In, Like } from 'typeorm';
import { UserRoleService } from '../users-roles/user-roles.service';
@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authToolsService: AuthToolsService,
        private readonly userRoleService: UserRoleService,

    ) {
        super();
    }
    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users', operationId: 'getAllUsers' })
    @ApiResponse({ status: 200, description: 'Get all users', type: GetUsersResponse })
    @HttpCode(200)
    async getAll(@Query() request: GetUsersRequest): Promise<GetUsersResponse> {
        const findOptions = BaseSearchRequest.getDefaultFindOptions<User>(request);
        if (request.search) {
            if (!findOptions.where)
                findOptions.where = [{}];
            findOptions.where = [
                {
                    firstname: Like('%' + request.search + '%'),
                },
                {
                    lastname: Like('%' + request.search + '%'),
                },
            ]
        }
        return await this.usersService.findAll(findOptions);
    }

    @UseGuards(RolesGuard)
    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user', operationId: 'getUser' })
    @ApiResponse({ status: 200, description: 'Get user', type: GetUserResponse })
    @HttpCode(200)
    async get(@Param('id') id: string): Promise<GetUserResponse> {
        return await this.usersService.findOne({ where: { id: id } });
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create or update user', operationId: 'createOrUpdateUser' })
    @ApiResponse({ status: 200, description: 'Create or update user', type: GetUserResponse })
    @HttpCode(200)
    async createOrUpdate(@Body() candidateResumeDto: UserDto): Promise<GetUserResponse> {
        if (!candidateResumeDto)
            throw new AppErrorWithMessage('Invalid Request');
        return await this.usersService.createOrUpdate(candidateResumeDto);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Delete()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete users', operationId: 'deleteUsers' })
    @ApiResponse({ status: 200, description: 'Delete users from ID', type: GenericResponse })
    @HttpCode(200)
    async deleteUsers(@Query('userIds') userIds: string): Promise<GenericResponse> {
        return await this.usersService.delete(userIds.split(','));
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Post('archiveUsers')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Archive user', operationId: 'archiveUsers' })
    @ApiResponse({ status: 200, description: 'Archive users from ID', type: GenericResponse })
    @HttpCode(200)
    async archiveUsers(@Query('userIds') userIds: string): Promise<GenericResponse> {
        return await this.usersService.archive(userIds.split(','));
    }

}