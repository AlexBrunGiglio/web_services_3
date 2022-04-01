import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenericResponse } from '../../base/generic-response';
import { BaseSearchResponse } from '../../base/search-response';
import { MovieDto } from '../movies/movie-dto';

export class CategoryDto {
    @ApiPropertyOptional()
    id: string;
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public creationDate?: Date;
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public modifDate?: Date;
    @ApiPropertyOptional()
    name?: string;
    @ApiPropertyOptional({ type: () => MovieDto, isArray: true })
    movies?: MovieDto[];
}

export class GetCategoryResponse extends GenericResponse {
    @ApiProperty({ type: () => CategoryDto })
    category: CategoryDto;
}

export class GetCategoriesResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => CategoryDto, isArray: true })
    categories: CategoryDto[] = [];
}