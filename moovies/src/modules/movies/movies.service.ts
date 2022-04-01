import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationBaseModelService } from '../../base/base-model.service';
import { GetMovieResponse, GetMoviesResponse, MovieDto } from './movie-dto';
import { Movie } from './movie.entity';

@Injectable()
export class MoviesService extends ApplicationBaseModelService<Movie, MovieDto, GetMovieResponse, GetMoviesResponse> {
    constructor(
        @InjectRepository(Movie)
        public readonly repository: Repository<Movie>,
    ) {
        super();
        this.modelOptions = {
            getManyResponse: GetMoviesResponse,
            getOneResponse: GetMovieResponse,
            getManyResponseField: 'movies',
            getOneResponseField: 'movie',
            getOneRelations: ['category'],
            getManyRelations: ['category'],
            repository: this.repository,
            entity: Movie,
        };
    }
}