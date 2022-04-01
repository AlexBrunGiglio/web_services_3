import { Module } from "@nestjs/common";
import { AccessTokenController, AuthController, RefreshTokenController } from "../auth/auth.controller";
import { AuthService } from "../auth/auth.service";
import { RolesGuard } from "../auth/guards/roles.guard";
import { DatabaseService } from "../database.service";
import { AppCommonModule } from "./common.module";

@Module({
    imports: [
        AppCommonModule,
    ],
    controllers: [
        AuthController,
        RefreshTokenController,
        AccessTokenController,
    ],
    providers: [
        AuthService,
        RolesGuard,
        DatabaseService,
    ],
    exports: [
        AppCommonModule,
        DatabaseService,
        AuthService,
    ],
})
export class SharedModule {

}

