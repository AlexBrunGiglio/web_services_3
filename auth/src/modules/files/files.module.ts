import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCommonModule } from '../../shared/common.module';
import { File } from './file.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
    imports: [
        AppCommonModule,
        TypeOrmModule.forFeature([
            File,
        ]),
    ],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService],
})
export class FilesModule { }