import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BaseSearchRequest } from "../../base/base-search-request";
import { GenericResponse } from "../../base/generic-response";
import { BaseSearchResponse } from "../../base/search-response";
import { FileDto } from '../files/file-dto';
import { UserRoleDto } from "../users-roles/user-role-dto";

export class UserDto {
    @ApiPropertyOptional()
    id?: string;
    @ApiPropertyOptional()
    refreshToken?: string;
    @ApiProperty()
    username: string;
    @ApiPropertyOptional()
    lastname: string;
    @ApiPropertyOptional()
    firstname: string;
    @ApiPropertyOptional()
    password?: string;
    @ApiPropertyOptional()
    mail?: string;
    @ApiPropertyOptional()
    phone?: string;
    @ApiPropertyOptional()
    presentation?: string;
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public creationDate?: Date;
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public modifDate?: Date;
    @ApiPropertyOptional({ type: () => UserRoleDto, isArray: true })
    roles?: UserRoleDto[];
    @ApiPropertyOptional()
    rolesString?: string[];
    @ApiProperty()
    disabled: boolean;
    @ApiPropertyOptional()
    initial?: string;
    @ApiPropertyOptional()
    imgUrl?: string;
    @ApiPropertyOptional()
    accountActivated?: boolean;
    @ApiPropertyOptional({ type: () => FileDto, isArray: true })
    files?: FileDto[];
}

export class GetUserResponse extends GenericResponse {
    @ApiProperty({ type: () => UserDto })
    user: UserDto;
}

export class GetUsersResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => UserDto, isArray: true })
    users: UserDto[] = [];
}

export class GetUsersRequest extends BaseSearchRequest {
    @ApiPropertyOptional({ description: "Roles separated by comma", })
    role?: string;
}