import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { StatDto } from './stat-dto';

@Entity({ name: 'stats' })
export class Stat extends BaseEntity {
    @Column('varchar', { name: 'label', length: 30, unique: true })
    label: string;
    @Column('varchar', { name: 'value', length: 50, nullable: true })
    value: number;
    public toDto(): StatDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            archived: this.archived,
            label: this.label,
            value: this.value,
        }
    }

    public fromDto(dto: StatDto) {
        this.id = dto.id;
        this.label = dto.label;
        this.value = dto.value;

        if (!this.id)
            this.id = undefined;
    }
}
