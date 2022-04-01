import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { ApplicationBaseModelService, LinqQueryWrapper } from "../../base/base-model.service";
import { MainHelpers } from "../../base/main-helper";
import { GetUserResponse, GetUsersResponse, UserDto } from "./user-dto";
import { User } from "./user.entity";

@Injectable()
export class UsersService extends ApplicationBaseModelService<User, UserDto, GetUserResponse, GetUsersResponse> {
    constructor(
        @InjectRepository(User)
        public readonly repository: Repository<User>,
    ) {
        super();
        this.modelOptions = {
            getManyResponse: GetUsersResponse,
            getOneResponse: GetUserResponse,
            getManyResponseField: 'users',
            getOneResponseField: 'user',
            repository: this.repository,
            entity: User,
            getManyRelations: ['roles'],
            getOneRelations: ['roles'],
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }

    async createOrUpdate(user: UserDto): Promise<GetUserResponse> {
        const response = new GetUserResponse();
        try {
            let userEntity = await this.repository.findOne({ id: user.id });
            if (!userEntity) {
                userEntity = new User();
            }
            userEntity.fromDto(user);
            if (user.password)
                userEntity.password = await MainHelpers.hashPassword(user.password);


            if (!user.username)
                userEntity.username = user.firstname + '-' + user.lastname;
            userEntity = await this.repository.save(userEntity);
            const getUserResponse = await this.findOne({ where: { id: userEntity.id } });
            if (getUserResponse.success && getUserResponse.user)
                response.user = getUserResponse.user;
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async findOne(conditions: FindOneOptions<User> | LinqQueryWrapper<User>, getPassword = false): Promise<GetUserResponse> {
        return super.findOne(conditions, getPassword);
    }
}