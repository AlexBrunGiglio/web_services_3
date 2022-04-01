import { Body, Controller, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtPayload } from '../../../shared/jwt-payload';
import { AppErrorWithMessage } from '../base/app-error';
import { BaseController } from "../base/base.controller";
import { GenericResponse } from "../base/generic-response";
import { GetUserResponse, UserDto } from '../modules/users/user-dto';
import { UsersService } from '../modules/users/users.service';
import { LoginViewModel, RegisterRequest } from "./auth-request";
import { AuthService } from "./auth.service";
import { AuthToolsService } from './services/tools.service';

@Controller('account')
@ApiTags('account')
export class AuthController extends BaseController {
    constructor(
        private authService: AuthService,
        private authToolsService: AuthToolsService,
        private userService: UsersService,
    ) {
        super();
    }

    @Post()
    @ApiOperation({ summary: 'Création d\'un compte utilisateur', operationId: 'register' })
    @ApiResponse({ status: 200, description: 'Création d\'un compte utilisateur', type: GenericResponse })
    @HttpCode(200)
    @ApiBearerAuth()
    async register(@Body() request: RegisterRequest): Promise<GenericResponse> {
        return await this.authService.register(request);
    }

    @Get(':uid')
    @ApiOperation({ summary: 'Récupération d\'un compte utilisateur', operationId: 'getUser' })
    @ApiResponse({ status: 200, description: 'Récupération d\'un compte utilisateur', type: GetUserResponse })
    @HttpCode(200)
    async get(@Param('uid') uid: string): Promise<GetUserResponse> {
        let getUserResponse = new GetUserResponse();
        try {
            getUserResponse = await this.userService.findOne({ where: { id: uid } });
        } catch (error) {
            getUserResponse.handleError(error);
        }
        return getUserResponse;
    }

    @Put(':uid')
    @ApiOperation({ summary: 'Modification d\'un utilisateur', operationId: 'createOrUpdateUser' })
    @ApiResponse({ status: 200, description: 'Modification d\'un utilisateur', type: GetUserResponse })
    @HttpCode(200)
    async createOrUpdate(@Param('uid') uid: string, @Body() userDto: UserDto): Promise<GetUserResponse> {
        console.log("🚀 ~ AuthController ~ createOrUpdate ~ userDto", userDto);
        let getUserResponse = new GetUserResponse();
        try {
            if (!userDto)
                throw new AppErrorWithMessage('Invalid Request');
            userDto.id = uid;
            const response = await this.userService.repository.save(userDto);
            if (response)
                getUserResponse = await this.userService.findOne({ where: { id: uid } });
        } catch (error) {
            getUserResponse.handleError(error);
        }
        return getUserResponse;
    }
}

@Controller('refresh-token')
@ApiTags('Refresh token')
export class RefreshTokenController extends BaseController {
    constructor(
        private authService: AuthService,
        private authToolsService: AuthToolsService,
        private userService: UsersService,
    ) {
        super();
    }

    @Post(':refreshToken/token')
    @ApiOperation({ summary: 'Création d\'un refresh token', operationId: 'refreskToken' })
    @ApiResponse({ status: 200, description: 'Création d\'un refresh token', type: GenericResponse })
    @HttpCode(200)
    async refreshToken(@Param('refreshToken') refreshToken: string): Promise<GenericResponse> {
        let response = new GenericResponse();
        try {
            if (!refreshToken)
                throw new AppErrorWithMessage("No token provided");
            const userFromPayload: JwtPayload = this.authService.validateRefreshToken(refreshToken);
            if (!userFromPayload.id)
                return;
            userFromPayload.iat = null;
            userFromPayload.exp = null;
            const user: UserDto = userFromPayload as any;
            response.token = this.authService.generateAccesToken(user);
            response.success = true;
        } catch (error) {
            response.handleError(error)
        }
        return response;
    }
}

@Controller('access-token')
@ApiTags('Access token')
export class AccessTokenController extends BaseController {
    constructor(
        private authService: AuthService,
        private authToolsService: AuthToolsService,
        private userService: UsersService,
    ) {
        super();
    }
    @Post('/token')
    @ApiOperation({ summary: 'Création d\'un token de connection', operationId: 'refreskToken' })
    @ApiResponse({ status: 200, description: 'Création d\'un compte utilisateur', type: GenericResponse })
    @HttpCode(200)
    @ApiBearerAuth()
    async register(@Body() request: LoginViewModel): Promise<GenericResponse> {
        return await this.authService.login(request);
    }

    @Get('/validate/:accessToken')
    @ApiOperation({ summary: 'Confirme la validité d\'un access token', operationId: 'validateAccesToken' })
    @ApiResponse({ status: 200, description: 'Confirme la validité d\'un access token', type: GenericResponse })
    @HttpCode(200)
    async get(@Param('accessToken') accessToken: string): Promise<GenericResponse> {
        let response = new GenericResponse();
        try {
            this.authService.validateToken(accessToken);
            response.success = true;
        } catch (error) {
            response.handleError(error);
        }
        return response;
    }
}
