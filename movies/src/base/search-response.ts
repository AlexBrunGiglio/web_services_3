import { ApiProperty } from "@nestjs/swagger";
import { GenericResponse } from "./generic-response";

export class BaseSearchResponse extends GenericResponse {
    @ApiProperty()
    filteredResults = 0;
}