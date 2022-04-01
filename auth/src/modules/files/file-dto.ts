import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '../../base/base-dto';
import { GenericResponse } from '../../base/generic-response';
import { BaseSearchResponse } from '../../base/search-response';

export class FileDto extends BaseDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    type: string;
    @ApiProperty()
    originalname: string;
    @ApiProperty()
    path: string;
    @ApiPropertyOptional()
    userId?: string;
}

export class GetFileResponse extends GenericResponse {
    @ApiProperty({ type: () => FileDto })
    file: FileDto;
}

export class GetFilesResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => FileDto, isArray: true })
    files: FileDto[] = [];
}