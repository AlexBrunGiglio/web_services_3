import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { LogDto } from './log-dto';

@Entity({ name: 'logs' })
export class Log extends BaseEntity {
    @Column('varchar', { name: 'code', length: 30, unique: true })
    code: string;
    @Column('varchar', { name: 'dbError', length: 50, nullable: true })
    dbError: string;

    public toDto(): LogDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            archived: this.archived,
            code: this.code,
            dbError: this.dbError,
        }
    }

    public fromDto(dto: LogDto) {
        this.id = dto.id;
        this.code = dto.code;
        this.dbError = dto.dbError;

        if (!this.id)
            this.id = undefined;
    }
}
