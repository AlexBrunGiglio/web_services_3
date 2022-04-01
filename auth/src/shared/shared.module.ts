import { Module } from "@nestjs/common";
import { AuthController } from "../auth/auth.controller";
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

