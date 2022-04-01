import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { CategoryDto } from './category-dto';

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;
    @CreateDateColumn({ name: 'creationDate', nullable: false, type: 'datetime' })
    creationDate?: Date;
    @UpdateDateColumn({ name: 'modifDate', nullable: false, type: 'datetime' })
    modifDate?: Date;
    @Column('varchar', { name: 'name', length: 128, nullable: true })
    name?: string;
    @OneToMany(() => Movie, movies => movies.category, { cascade: true })
    movies?: Movie[];

    public toDto(): CategoryDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            name: this.name,
            movies: this.movies ? this.movies.map(x => x.toDto()) : [],
        }
    }

    public fromDto(dto: CategoryDto) {
        this.id = dto.id;
        this.name = dto.name;

        // if (dto.movies) {
        //     this.movies = [];
        //     for (const movie of dto.movies) {
        //         const movieToCreate = new Movie();
        //         movieToCreate.fromDto(movie);
        //         this.movies.push(movieToCreate);
        //     }
        // }

        if (!this.id)
            this.id = undefined;
    }
}