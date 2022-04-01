import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '../../base/base-dto';
import { BaseSearchRequest } from '../../base/base-search-request';
import { GenericResponse } from '../../base/generic-response';
import { BaseSearchResponse } from '../../base/search-response';

export class LogDto extends BaseDto {
    @ApiProperty()
    code?: string;
    @ApiProperty()
    dbError: string;
}

export class GetLogResponse extends GenericResponse {
    @ApiProperty({ type: () => LogDto })
    log: LogDto;
}

export class GetLogsResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => LogDto, isArray: true })
    logs: LogDto[] = [];
}

export class GetLogsRequest extends BaseSearchRequest {
    @ApiPropertyOptional({ description: "Search by code", })
    code?: string;
}