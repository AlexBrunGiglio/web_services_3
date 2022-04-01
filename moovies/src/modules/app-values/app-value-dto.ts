import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { GenericResponse } from "../../base/generic-response";
import { AppTypeDto } from "./app-type-dto";

export class AppValueDto {
    @ApiPropertyOptional()
    id?: string;
    @ApiProperty()
    label: string;
    @ApiPropertyOptional()
    order?: number;
    @ApiProperty()
    code: string;
    @ApiProperty({ type: () => AppTypeDto })
    appType: AppTypeDto;
    @ApiProperty()
    appTypeId: string;
    @ApiProperty()
    enabled: boolean;
}

export class GetAppValuesResponse extends GenericResponse {
    @ApiProperty({ type: () => AppValueDto, isArray: true })
    appValues: AppValueDto[] = [];
}
export class GetAppValueResponse extends GenericResponse {
    @ApiProperty({ type: () => AppValueDto })
    appValue: AppValueDto = null;
}

export class MultipleAppValuesRequest {
    @ApiPropertyOptional({ type: String, isArray: true })
    ids?: string[];
    @ApiPropertyOptional({ type: String, isArray: true })
    codes?: string[];
}

