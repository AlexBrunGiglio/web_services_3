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
import { Like } from 'typeorm';
import { UserRoleService } from '../users-roles/user-roles.service';
import { SharedService } from '../../../../shared/shared-service';

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
        const payload = this.authToolsService.getCurrentPayload(false);
        if (!SharedService.userIsAdmin(payload) && payload.id !== id)
            throw new AppErrorWithMessage('Vous n\'avez pas l\'autorisation de faire cela.', 403);
        let getUserResponse = new GetUserResponse();
        try {
            getUserResponse = await this.usersService.findOne({ where: { id: id } });
        } catch (error) {
            getUserResponse.handleError(error);
        }
        return getUserResponse;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.Visitor)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create or update user', operationId: 'createOrUpdateUser' })
    @ApiResponse({ status: 200, description: 'Create or update user', type: GetUserResponse })
    @HttpCode(200)
    async createOrUpdate(@Body() userDto: UserDto): Promise<GetUserResponse> {
        let getUserResponse = new GetUserResponse();
        try {
            if (!userDto)
                throw new AppErrorWithMessage('Invalid Request');
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!SharedService.userIsAdmin(payload) && payload.id !== userDto.id)
                throw new AppErrorWithMessage('Vous n\'avez pas l\'autorisation de faire cela.', 403);
            getUserResponse = await this.usersService.createOrUpdate(userDto);
        } catch (error) {
            getUserResponse.handleError(error);
        }
        return getUserResponse;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Delete()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete users', operationId: 'deleteUsers' })
    @ApiResponse({ status: 200, description: 'Delete users from ID', type: GenericResponse })
    @HttpCode(200)
    async deleteUsers(@Query('userIds') userIds: string): Promise<GenericResponse> {
        console.log("🚀 ~ UsersController ~ deleteUsers ~ userIds", userIds);
        let response = new GenericResponse();
        try {
            response = await this.usersService.delete(userIds.split(','));
        } catch (error) {
            response.handleError(error);
        }
        console.log("🚀 ~ UsersController ~ deleteUsers ~ response", response);
        return response;
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

    @UseGuards(RolesGuard)
    @Roles(RolesList.Visitor)
    @Post('archiveMyAccount')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Archive my account', operationId: 'archiveMyAccount' })
    @ApiResponse({ status: 200, description: 'Archive my account', type: GenericResponse })
    @HttpCode(200)
    async archiveMAccount(): Promise<GenericResponse> {
        let response = new GenericResponse();
        try {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!payload.id)
                throw new AppErrorWithMessage('Une erreur est survenue !')
            response = await this.usersService.archiveOne(payload.id);
        } catch (error) {
            response.handleError(error);
        }
        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Visitor)
    @Delete('deleteMyAccount')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete account', operationId: 'deleteAccount' })
    @ApiResponse({ status: 200, description: 'Delete account', type: GenericResponse })
    @HttpCode(200)
    async deleteAccount(): Promise<GenericResponse> {
        let response = new GenericResponse();
        try {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!payload.id)
                throw new AppErrorWithMessage('Une erreur est survenue !')
            response = await this.usersService.deleteOne(payload.id);
        } catch (error) {
            response.handleError(error);
        }
        return response;
    }
}