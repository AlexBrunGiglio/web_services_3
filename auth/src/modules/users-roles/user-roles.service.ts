import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApplicationBaseModelService } from "../../base/base-model.service";
import { GetUserRoleResponse, GetUserRolesResponse, UserRoleDto } from "./user-role-dto";
import { UserRole } from "./user-role.entity";

@Injectable()
export class UserRoleService extends ApplicationBaseModelService<UserRole, UserRoleDto, GetUserRoleResponse, GetUserRolesResponse> {
    private userRolesList: UserRoleDto[] = [];
    constructor(
        @InjectRepository(UserRole)
        private readonly userRolesRepository: Repository<UserRole>
    ) {
        super();
        this.modelOptions = {
            getManyResponse: GetUserRolesResponse,
            getOneResponse: GetUserRoleResponse,
            getManyResponseField: 'userRoles',
            getOneResponseField: 'userRole',
            getOneRelations: ['rights'],
            repository: this.userRolesRepository,
            entity: UserRole,
            archiveField: 'disabled',
            archiveFieldValue: false,
        };
    }

    async createOrUpdate(dto: UserRoleDto) {
        this.userRolesList = [];
        return await super.createOrUpdate(dto);
    }

    async getAllUserRoles() {
        const response = new GetUserRolesResponse();
        if (this.userRolesList?.length) {
            response.userRoles = this.userRolesList;
            response.success = true;
            return response;
        }
        const userRolesResponse = await this.findAll();
        if (userRolesResponse.success && userRolesResponse.userRoles) {
            this.userRolesList = userRolesResponse.userRoles;
            response.userRoles = this.userRolesList;
            response.success = true;
        }
        else if (!userRolesResponse.success) {
            response.message = userRolesResponse.message;
        }
        return response;
    }

    public async delete(ids: string[]) {
        this.userRolesList = [];
        return await super.delete(ids);
    }

    public async archive(ids: string[]) {
        this.userRolesList = [];
        return await super.archive(ids);
    }
}