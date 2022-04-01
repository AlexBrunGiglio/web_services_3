import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { User } from '../users/user.entity';
import { FileDto } from './file-dto';

@Entity({ name: 'files' })
export class File extends BaseEntity {
    @Column('varchar', { name: 'name', length: 50, unique: false })
    name: string;
    @Column('varchar', { name: 'type', length: 50, nullable: false })
    type: string;
    @Column('varchar', { name: 'originalname', length: 50, nullable: false })
    originalname: string;
    @Column('varchar', { name: 'path', length: 50, nullable: false })
    path: string;
    @Column('varchar', { name: 'userId', nullable: true })
    userId: string;
    @ManyToOne(() => User, user => user.files, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user?: User;

    public toDto(): FileDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            archived: this.archived,
            name: this.name,
            type: this.type,
            userId: this.userId,
            originalname: this.originalname,
            path: this.path,
        }
    }

    public fromDto(dto: FileDto) {
        this.id = dto.id;
        this.name = dto.name;
        this.type = dto.type;
        this.userId = dto.userId;
        this.originalname = dto.originalname;
        this.path = dto.path;

        if (!this.id)
            this.id = undefined;
    }
}
