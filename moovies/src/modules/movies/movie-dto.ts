import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenericResponse } from '../../base/generic-response';
import { BaseSearchResponse } from '../../base/search-response';
import { CategoryDto } from '../categories/category-dto';

export class MovieDto {
    @ApiPropertyOptional()
    id: string;
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public creationDate?: Date;
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public modifDate?: Date;
    @ApiPropertyOptional()
    name?: string;
    @ApiPropertyOptional()
    description?: string;
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    releaseDate?: Date;
    @ApiPropertyOptional()
    note?: number;
    @ApiPropertyOptional()
    categoryId?: string;
    @ApiPropertyOptional({ type: () => CategoryDto })
    category?: CategoryDto;
}

export class GetMovieResponse extends GenericResponse {
    @ApiProperty({ type: () => MovieDto })
    movie: MovieDto;
}

export class GetMoviesResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => MovieDto, isArray: true })
    movies: MovieDto[] = [];
}