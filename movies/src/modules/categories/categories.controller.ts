import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Like } from 'typeorm';
import { AppErrorWithMessage } from '../../base/app-error';
import { BaseSearchRequest } from '../../base/base-search-request';
import { BaseController } from '../../base/base.controller';
import { GenericResponse } from '../../base/generic-response';
import { CategoriesService } from './categories.service';
import { CategoryDto, GetCategoriesResponse, GetCategoryResponse } from './category-dto';
import { Category } from './category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController extends BaseController {
    constructor(
        private readonly categoriesService: CategoriesService,

    ) {
        super();
    }
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all categories', operationId: 'getAllCategories' })
    @ApiResponse({ status: 200, description: 'Get all categories', type: GetCategoriesResponse })
    @HttpCode(200)
    async getAll(@Query() request: BaseSearchRequest): Promise<GetCategoriesResponse> {
        const findOptions = BaseSearchRequest.getDefaultFindOptions<Category>(request);
        if (request.search) {
            if (!findOptions.where)
                findOptions.where = [{}];
            findOptions.where = [
                {
                    name: Like('%' + request.search + '%'),
                },
            ]
        }
        return await this.categoriesService.findAll(findOptions);
    }

    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get categorie', operationId: 'getCategorie' })
    @ApiResponse({ status: 200, description: 'Get categorie', type: GetCategoryResponse })
    @HttpCode(200)
    async get(@Param('id') id: string): Promise<GetCategoryResponse> {
        return await this.categoriesService.findOne({ where: { id: id } });
    }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create or update categorie', operationId: 'createOrUpdateCa' })
    @ApiResponse({ status: 201, description: 'Create or update categorie', type: GetCategoryResponse })
    @HttpCode(201)
    async createOrUpdate(@Body() categoryDto: CategoryDto): Promise<GetCategoryResponse> {
        if (!categoryDto)
            throw new AppErrorWithMessage('Invalid Request');
        return await this.categoriesService.createOrUpdate(categoryDto);
    }

    @Delete()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete categories', operationId: 'deleteCategories' })
    @ApiResponse({ status: 200, description: 'Delete categories from ID', type: GenericResponse })
    @HttpCode(200)
    async deleteUsers(@Query('categoriesIds') categoriesIds: string): Promise<GenericResponse> {
        return await this.categoriesService.delete(categoriesIds.split(','));
    }

}