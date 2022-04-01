import { ExecutionContext, Inject, Injectable, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../../../shared/jwt-payload'
import { ApplicationBaseService } from '../../base/base-service';
import { UserDto } from '../../modules/users/user-dto';
import { Request, Response } from 'express';
import { AppErrorWithMessage } from '../../base/app-error';


export type JwtDecodeError = 'TokenExpiredError' | 'JsonWebTokenError' | 'NoTokenError' | 'NoRequestData';
export interface DecodeTokenResponse {
    payload?: JwtPayload; error?: JwtDecodeError;
}
@Injectable({ scope: Scope.REQUEST })
export class AuthToolsService extends ApplicationBaseService {
    public static createUserToken(jwtService: JwtService, user: UserDto) {
        if (!user)
            return null;
        let roles: string[] = [];
        if (user.roles)
            roles = user.roles.map(x => x.role);
        const payload: JwtPayload = {
            id: user.id,
            username: user.username,
            roles: roles,
            mail: user.mail,
            firstname: user.firstname,
            lastname: user.lastname,
            imgUrl: user.imgUrl,
        };
        return jwtService.sign(payload, { expiresIn: '7d' });
    }

    public static getRequestFromContext(context: ExecutionContext): Request {
        if (!context)
            return null;
        const httpContext = context.switchToHttp();
        if (!httpContext)
            return null;
        const request = httpContext.getRequest();
        if (!request)
            return null;
        return request;
    }
    public static getResponseFromContext(context: ExecutionContext): Response {
        if (!context)
            return null;
        const httpContext = context.switchToHttp();
        if (!httpContext)
            return null;
        const response = httpContext.getResponse();
        if (!response)
            return null;
        return response;
    }

    public static getJwtPayloadFromRequest(jwtService: JwtService, request: any, ignoreExpiration: boolean): DecodeTokenResponse {
        if (!request || !request.headers || !request.headers.authorization)
            return { error: 'NoTokenError' };
        return AuthToolsService.getJwtPayloadFromAuthHeader(jwtService, request.headers.authorization, ignoreExpiration);
    }

    public static getJwtTokenFromAuthHeader(authorizationHeader: string): string {
        if (authorizationHeader && authorizationHeader.indexOf('Bearer') !== -1) {
            const tokenArray = authorizationHeader.split('Bearer ');
            if (tokenArray.length > 1) {
                return tokenArray[1];
            }
        }
        return null;
    }
    public static getJwtPayloadFromAuthHeader(jwtService: JwtService, authorizationHeader: string, ignoreExpiration: boolean): DecodeTokenResponse {
        const jwtToken = this.getJwtTokenFromAuthHeader(authorizationHeader);
        if (jwtToken)
            return AuthToolsService.decodeToken(jwtService, jwtToken, ignoreExpiration);
        return { error: 'NoTokenError' };
    }

    public static decodeToken(jwtService: JwtService, encodedToken: string, ignoreExpiration: boolean): DecodeTokenResponse {
        let decoded: JwtPayload = null;
        let error: JwtDecodeError;
        try {
            decoded = jwtService.verify(encodedToken, { ignoreExpiration: ignoreExpiration });
        }
        catch (err) {
            if (err?.name)
                error = err.name;
        }
        return { payload: decoded, error: error };
    }

    constructor(
        @Optional() @Inject(REQUEST) private readonly request: Request,
        public readonly jwtService: JwtService,
    ) {
        super();
    }
    public getCurrentPayload(ignoreExpiration: boolean): JwtPayload {
        if (this.request)
            return AuthToolsService.getJwtPayloadFromRequest(this.jwtService, this.request, ignoreExpiration).payload;
        return null;
    }
}

export async function AuthCustomRules(user: UserDto) {
    //Write here custom auth rules
    const ok = !!user;
    if (!ok) {
        throw new AppErrorWithMessage('Custom error', 403);
    }
}