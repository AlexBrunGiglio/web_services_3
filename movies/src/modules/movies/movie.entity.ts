import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { MovieDto } from './movie-dto';

@Entity({ name: 'movies' })
export class Movie {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;
    @CreateDateColumn({ name: 'creationDate', nullable: false, type: 'datetime' })
    creationDate?: Date;
    @UpdateDateColumn({ name: 'modifDate', nullable: false, type: 'datetime' })
    modifDate?: Date;
    @Column('varchar', { name: 'name', length: 128, nullable: true })
    name?: string;
    @Column('text', { name: 'description', nullable: true })
    description?: string;
    @Column({ name: 'releaseDate', nullable: true, type: 'datetime' })
    releaseDate?: Date;
    @Column('int', { name: 'note', nullable: true })
    note?: number;

    @Column('varchar', { name: 'categoryId', length: 36, nullable: true })
    categoryId?: string;
    @ManyToOne(() => Category, category => category.movies)
    @JoinColumn({ name: 'categoryId' })
    category?: Category;

    public toDto(): MovieDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            name: this.name,
            description: this.description,
            releaseDate: this.releaseDate,
            note: this.note,
            categoryId: this.categoryId,
            category: this.category ? this.category.toDto() : undefined,
        }
    }

    public fromDto(dto: MovieDto) {
        this.id = dto.id;
        this.name = dto.name;
        this.description = dto.description;
        this.releaseDate = dto.releaseDate;
        this.note = dto.note;
        this.categoryId = dto.categoryId;

        if (!this.id)
            this.id = undefined;
    }
}