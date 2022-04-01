import { Body, Controller, HttpCode, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { BaseController } from "../base/base.controller";
import { GenericResponse } from "../base/generic-response";
import { LoginResponse, LoginViewModel, RegisterRequest } from "./auth-request";
import { AuthService } from "./auth.service";

@Controller('auth')
@ApiTags('auth')
export class AuthController extends BaseController {
    constructor(
        private authService: AuthService,
    ) {
        super();
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user', operationId: 'login' })
    @ApiResponse({ status: 200, description: 'Login response', type: LoginResponse })
    @HttpCode(200)
    async login(@Body() loginViewModel: LoginViewModel): Promise<LoginResponse> {
        const response = await this.authService.login(loginViewModel);
        return response;
    }

    @Post('register')
    @ApiOperation({ summary: 'register', operationId: 'register' })
    @ApiResponse({ status: 200, description: 'Generic Response', type: GenericResponse })
    @HttpCode(200)
    @ApiBearerAuth()
    async register(@Body() request: RegisterRequest): Promise<GenericResponse> {
        return await this.authService.register(request);
    }

    @Post('refresh-token')
    @ApiOperation({ summary: 'refresh token', operationId: 'refreshToken' })
    @ApiResponse({ status: 200, description: 'Generic Response', type: GenericResponse })
    @HttpCode(200)
    async refreshToken(@Req() request: Request): Promise<GenericResponse> {
        return await this.authService.refreshToken(request);
    }
}
