import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { PaginationDto } from '../student/dto/pagination.dto';
import { AssignStudentsDto } from './dto/assign-students.dto';
import { Auth } from 'src/user/decorators/auth.decorator';
import { ValidRoles } from 'src/user/enums/valid-roles.enum';

@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createProgramDto: CreateProgramDto) {
    return this.programService.create(createProgramDto);
  }

  @Post('bulk')
  @Auth(ValidRoles.admin)
  bulkCreate(@Body() createProgramDtos: CreateProgramDto[]) {
    return this.programService.bulkCreate(createProgramDtos);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.programService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programService.findOne(id);
  }

  @Patch(':id/students')
  @Auth(ValidRoles.admin)
  assignStudents(@Param('id') id: string, @Body() assignStudentsDto: AssignStudentsDto) {
    return this.programService.assignStudents(id, assignStudentsDto);
  }
}
