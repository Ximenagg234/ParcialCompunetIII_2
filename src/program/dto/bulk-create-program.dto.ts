import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { CreateProgramDto } from './create-program.dto';

export class BulkCreateProgramDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateProgramDto)
  programs: CreateProgramDto[];
}
