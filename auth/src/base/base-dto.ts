import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseDto {
    @ApiPropertyOptional()
    id?: string;
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public creationDate?: Date;
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public modifDate?: Date;
    @ApiProperty()
    archived: boolean;
}