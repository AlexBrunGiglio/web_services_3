import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { UserDto } from './user-dto';
import { UserRole } from '../users-roles/user-role.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;
    @CreateDateColumn({ name: 'creationDate', nullable: false, type: 'datetime' })
    creationDate: Date;
    @UpdateDateColumn({ name: 'modifDate', nullable: false, type: 'datetime' })
    modifDate: Date;
    @Column('varchar', { name: 'username', length: 30, unique: true })
    username: string;
    @Column('varchar', { name: 'firstName', length: 250, nullable: true })
    firstname: string;
    @Column('varchar', { name: 'lastName', length: 250, nullable: true })
    lastname: string;
    @Column('varchar', { name: 'password', length: 70, nullable: true })
    password: string;
    @Column('varchar', { name: 'mail', length: 255, nullable: true, unique: true })
    mail?: string;
    @Column('varchar', { name: 'phone', length: 50, nullable: true })
    phone?: string;
    @Column('text', { name: 'presentation', nullable: true })
    presentation?: string;
    @Column('varchar', { name: 'initial', nullable: true })
    initial?: string;
    @ManyToMany(() => UserRole, (userRole) => userRole.users, { cascade: true })
    public roles: UserRole[];
    @Column('boolean', { name: 'disabled', nullable: false, default: 0 })
    disabled: boolean;
    @Column('varchar', { name: 'refreshToken', length: 36, nullable: true })
    refreshToken?: string;
    @Column('varchar', { name: 'imgUrl', length: 100, nullable: true })
    imgUrl?: string;
    public toDto(getPassword = false): UserDto {
        return {
            id: this.id,
            refreshToken: this.refreshToken,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            firstname: this.firstname,
            lastname: this.lastname,
            username: this.username,
            mail: this.mail,
            phone: this.phone,
            presentation: this.presentation,
            roles: this.roles ? this.roles.map(x => x.toDto()) : [],
            disabled: this.disabled,
            initial: this.initial,
            password: getPassword ? this.password : undefined,
            imgUrl: this.imgUrl,
        }
    }

    public fromDto(dto: UserDto) {
        this.id = dto.id;
        this.refreshToken = dto.refreshToken;
        this.firstname = dto.firstname;
        this.lastname = dto.lastname;
        this.username = dto.username;
        this.mail = dto.mail;
        this.phone = dto.phone;
        this.presentation = dto.presentation;
        this.disabled = dto.disabled;
        this.initial = dto.initial;
        this.imgUrl = dto.imgUrl;

        if (dto.roles) {
            this.roles = dto.roles.map<UserRole>(xDto => {
                const userRole = new UserRole();
                userRole.fromDto(xDto);
                return userRole;
            });
        }

        if (!this.id)
            this.id = undefined;
    }
}
