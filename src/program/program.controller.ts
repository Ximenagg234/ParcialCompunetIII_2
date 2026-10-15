import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { PaginationDto } from '../student/dto/pagination.dto';
import { AssignStudentsDto } from './dto/assign-students.dto';
import { Auth } from 'src/user/decorators/auth.decorator';
import { ValidRoles } from 'src/user/enums/valid-roles.enum';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { BulkCreateProgramDto } from './dto/bulk-create-program.dto';

@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createProgramDto: CreateProgramDto, @GetUser() user: User){
    return this.programService.create(createProgramDto, user);
  }

  @Post("bulk")
  @Auth(ValidRoles.admin)
  bulkCreate(@Body() bulkCreateProgramDto: BulkCreateProgramDto, @GetUser() user: User){
    return this.programService.bulkCreate(bulkCreateProgramDto, user);
  }


  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.programService.findAll(paginationDto);
  }

   @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string){
    return this.programService.findOne(id);
  }

  @Patch(':id/students')
  @Auth(ValidRoles.admin)
  assignStudents(@Param('id', ParseUUIDPipe) id: string, @Body() assignStudentsDto: AssignStudentsDto) {
    return this.programService.assignStudents(id, assignStudentsDto);
  }
}
