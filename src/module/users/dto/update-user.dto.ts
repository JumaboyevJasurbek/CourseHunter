import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
    @IsString()
    @Transform(({value}): string => value.trim())
    user_name: string
}
