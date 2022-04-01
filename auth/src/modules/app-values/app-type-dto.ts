import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BaseSearchRequest } from "../../base/base-search-request";
import { GenericResponse } from "../../base/generic-response";
import { AppValueDto } from "./app-value-dto";

export class AppTypeDto {
    @ApiPropertyOptional()
    id?: string;
    @ApiProperty()
    label: string;
    @ApiProperty()
    code: string;
    @ApiProperty({ type: () => AppValueDto, isArray: true })
    appValues: AppValueDto[];
}

export class GetAppTypesResponse extends GenericResponse {
    @ApiProperty({ type: () => AppTypeDto, isArray: true })
    appTypes: AppTypeDto[] = [];
}

export class GetAppTypeResponse extends GenericResponse {
    @ApiProperty({ type: () => AppTypeDto })
    appType: AppTypeDto = null;
}

export class FindAppTypesRequest extends BaseSearchRequest {
    @ApiProperty({
        description: "Get with AppTypesCodes",
        required: true,
        type: String,
    })
    appTypesCodes: string;
}

export class GetTypeValuesRequest extends BaseSearchRequest {
    @ApiProperty()
    appTypeCode: string;

    @ApiPropertyOptional()
    alsoDisabled?: string;
}
