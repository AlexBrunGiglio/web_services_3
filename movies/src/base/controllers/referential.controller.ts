import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesList } from "../../../../shared/shared-constant";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { AppTypeDto, FindAppTypesRequest, GetAppTypeResponse, GetAppTypesResponse, GetTypeValuesRequest } from "../../modules/app-values/app-type-dto";
import { AppValueDto, GetAppValueResponse, MultipleAppValuesRequest } from "../../modules/app-values/app-value-dto";
import { BaseController } from "../base.controller";
import { GenericResponse } from "../generic-response";
import { ReferentialService } from "../services/referential.service";
import { Roles } from "../services/roles.decorator";

@Controller('referential')
@ApiTags('referential')
export class ReferentialController extends BaseController {
    constructor(
        private referentialService: ReferentialService,
    ) {
        super();
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Get('getOneAppType/:id')
    @ApiOperation({ summary: 'Get App Type', operationId: 'getOneAppType' })
    @ApiResponse({ status: 200, description: 'App Type', type: GetAppTypeResponse })
    @HttpCode(200)
    async getOneAppType(@Param('id') id: string): Promise<GetAppTypeResponse> {
        return await this.referentialService.getOneAppType(id);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Get('getTypeValues')
    @ApiOperation({ summary: 'Get values of a type', operationId: 'getTypeValues' })
    @ApiResponse({ status: 200, description: 'List of type values', type: GetAppTypeResponse })
    @HttpCode(200)
    async getTypeValues(@Query() request: GetTypeValuesRequest): Promise<GetAppTypeResponse> {
        return await this.referentialService.getTypeValues(request);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Get('getMultipleTypeValues')
    @ApiOperation({ summary: 'Get values of a type', operationId: 'getMultipleTypeValues' })
    @ApiResponse({ status: 200, description: 'List of type values', type: GetAppTypesResponse })
    @HttpCode(200)
    async getMultipleTypeValues(@Query() request: FindAppTypesRequest): Promise<GetAppTypesResponse> {
        return await this.referentialService.getMultipleTypeValues(request);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @ApiBearerAuth()
    @Post('insertOrUpdateAppValue')
    @ApiOperation({ summary: 'insert or update App Value', operationId: 'insertOrUpdateAppValue' })
    @ApiResponse({ status: 200, description: 'App Value', type: GetAppValueResponse })
    @HttpCode(200)
    async insertOrUpdateAppValue(@Body() appValueDto: AppValueDto): Promise<GetAppValueResponse> {
        return await this.referentialService.insertOrUpdateAppValue(appValueDto);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @ApiBearerAuth()
    @Post('insertOrUpdateAppType')
    @ApiOperation({ summary: 'insert or update App Type', operationId: 'insertOrUpdateAppType' })
    @ApiResponse({ status: 200, description: 'App Type', type: GetAppTypeResponse })
    @HttpCode(200)
    async insertOrUpdateAppType(@Body() appTypeDto: AppTypeDto): Promise<GetAppTypeResponse> {
        return await this.referentialService.insertOrUpdateAppType(appTypeDto, true, true);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @ApiBearerAuth()
    @Post('removeAppValues')
    @ApiOperation({ summary: 'remove App Values', operationId: 'removeAppValues' })
    @ApiResponse({ status: 200, description: 'generic response', type: GenericResponse })
    @HttpCode(200)
    async removeAppValues(@Body() request: MultipleAppValuesRequest): Promise<GenericResponse> {
        let response = new GenericResponse();
        try {
            response = await this.referentialService.removeAppValues(request.ids, request.codes);
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @ApiBearerAuth()
    @Post('disableAppValues')
    @ApiOperation({ summary: 'disable App Values', operationId: 'disableAppValues' })
    @ApiResponse({ status: 200, description: 'generic response', type: GenericResponse })
    @HttpCode(200)
    async disableAppValues(@Body() request: MultipleAppValuesRequest): Promise<GenericResponse> {
        let response = new GenericResponse();
        try {
            response = await this.referentialService.disableAppValues(request.ids, request.codes);
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }
}