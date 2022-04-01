import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '../../base/base-dto';
import { BaseSearchRequest } from '../../base/base-search-request';
import { GenericResponse } from '../../base/generic-response';
import { BaseSearchResponse } from '../../base/search-response';

export class StatDto extends BaseDto {
    @ApiProperty()
    label?: string;
    @ApiProperty()
    value: number;
}

export class GetStatResponse extends GenericResponse {
    @ApiProperty({ type: () => StatDto })
    stat: StatDto;
}

export class GetStatsResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => StatDto, isArray: true })
    stats: StatDto[] = [];
}

export class GetStatsRequest extends BaseSearchRequest {
    @ApiPropertyOptional({ description: "Label of the stat requested", })
    label?: string;
}