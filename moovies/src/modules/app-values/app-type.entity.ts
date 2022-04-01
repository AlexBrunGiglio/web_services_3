import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AppTypeDto } from "./app-type-dto";
import { AppValue } from "./app-value.entity";

@Entity({ name: 'app_types' })
export class AppType {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;
    @Column('varchar', { name: 'label', nullable: false })
    label: string;
    @Column('varchar', { name: 'code', length: 100, nullable: false, unique: true })
    code: string;

    @OneToMany(() => AppValue, appValue => appValue.appType, { cascade: true })
    public appValues: AppValue[];

    public toDto(): AppTypeDto {
        return {
            id: this.id,
            label: this.label,
            code: this.code,
            appValues: this.appValues ? this.appValues.map(x => x.toDto()) : [],
        };
    }

    public fromDto(dto: AppTypeDto, mapAppValues: boolean) {
        this.code = dto.code;
        this.label = dto.label;
        this.id = dto.id;
        if (mapAppValues && dto.appValues?.length) {
            this.appValues = [];
            for (const appValueDto of dto.appValues) {
                const appValue = new AppValue();
                appValue.fromDto(appValueDto);
                this.appValues.push(appValue);
            }
        }
        if (!this.id)
            this.id = undefined;
    }
}