import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Like } from 'typeorm';
import { AppErrorWithMessage } from '../../base/app-error';
import { BaseSearchRequest } from '../../base/base-search-request';
import { BaseController } from '../../base/base.controller';
import { GenericResponse } from '../../base/generic-response';
import { GetMovieResponse, GetMoviesResponse, MovieDto } from './movie-dto';
import { Movie } from './movie.entity';
import { MoviesService } from './movies.service';

@ApiTags('movies')
@Controller('movies')
export class MoviesController extends BaseController {
    constructor(
        private readonly moviesService: MoviesService,

    ) {
        super();
    }
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all movies', operationId: 'getAllMovies' })
    @ApiResponse({ status: 200, description: 'Get all movies', type: GetMoviesResponse })
    @HttpCode(200)
    async getAll(@Query() request: BaseSearchRequest): Promise<GetMoviesResponse> {
        const findOptions = BaseSearchRequest.getDefaultFindOptions<Movie>(request);
        if (request.search) {
            if (!findOptions.where)
                findOptions.where = [{}];
            findOptions.where = [
                {
                    name: Like('%' + request.search + '%'),
                },
            ]
        }
        return await this.moviesService.findAll(findOptions);
    }

    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get movie', operationId: 'getMovie' })
    @ApiResponse({ status: 200, description: 'Get movie', type: GetMovieResponse })
    @HttpCode(200)
    async get(@Param('id') id: string): Promise<GetMovieResponse> {
        return await this.moviesService.findOne({ where: { id: id } });
    }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create or update movie', operationId: 'createOrUpdateMovie' })
    @ApiResponse({ status: 201, description: 'Create or update movie', type: GetMovieResponse })
    @HttpCode(201)
    async createOrUpdate(@Body() movieDto: MovieDto): Promise<GetMovieResponse> {
        if (!movieDto)
            throw new AppErrorWithMessage('Invalid Request');
        return await this.moviesService.createOrUpdate(movieDto);
    }

    @Delete()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete movies', operationId: 'deleteMovies' })
    @ApiResponse({ status: 200, description: 'Delete movies from ID', type: GenericResponse })
    @HttpCode(200)
    async deleteUsers(@Query('moviesIds') moviesIds: string): Promise<GenericResponse> {
        return await this.moviesService.delete(moviesIds.split(','));
    }

}