import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesList } from "../../../../shared/shared-constant";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { BaseSearchRequest } from "../../base/base-search-request";
import { BaseController } from "../../base/base.controller";
import { GenericResponse } from "../../base/generic-response";
import { Roles } from "../../base/services/roles.decorator";
import { GetUserRoleResponse, GetUserRolesRequest, GetUserRolesResponse, UserRoleDto } from "./user-role-dto";
import { UserRole } from "./user-role.entity";
import { UserRoleService } from "./user-roles.service";

@Controller('users-roles')
@ApiTags('users-roles')
export class UsersRolesController extends BaseController {
    constructor(
        private readonly userRoleService: UserRoleService,

    ) {
        super();
    }
    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'get role', operationId: 'getUserRole' })
    @ApiResponse({ status: 200, description: 'get roles response', type: GetUserRoleResponse })
    @HttpCode(200)
    async getUserRole(@Param('id') id: string): Promise<GetUserRoleResponse> {
        return await this.userRoleService.findOne({ where: { id: id } });
    }

    @UseGuards(RolesGuard)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'get list of roles', operationId: 'getUserRoles' })
    @ApiResponse({ status: 200, description: 'get roles response', type: GetUserRolesResponse })
    @HttpCode(200)
    async getUserRoles(@Query() request: GetUserRolesRequest): Promise<GetUserRolesResponse> {
        const findOptions = BaseSearchRequest.getDefaultFindOptions<UserRole>(request);
        if (request.includeDisabled === 'true') {
            findOptions.where = { disabled: true };
        }
        return await this.userRoleService.findAll(findOptions);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'createOrUpdateRole', operationId: 'createOrUpdateRole' })
    @ApiResponse({ status: 200, description: 'get role response', type: GetUserRoleResponse })
    @HttpCode(200)
    async createOrUpdateRole(@Body() userRole: UserRoleDto): Promise<GetUserRoleResponse> {
        return await this.userRoleService.createOrUpdate(userRole);
    }


    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Delete()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete roles', operationId: 'deleteRoles' })
    @ApiResponse({ status: 200, description: 'Delete roles', type: GenericResponse })
    @HttpCode(200)
    async deleteRoles(@Query('ids') ids: string): Promise<GenericResponse> {
        return await this.userRoleService.delete(ids.split(','));
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Post('archiveRoles')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Archive roles', operationId: 'archiveRoles' })
    @ApiResponse({ status: 200, description: 'Archive roles', type: GenericResponse })
    @HttpCode(200)
    async archiveRoles(@Query('ids') ids: string): Promise<GenericResponse> {
        return await this.userRoleService.archive(ids.split(','));
    }
}