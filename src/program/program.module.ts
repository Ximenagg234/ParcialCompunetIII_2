import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { Student } from '../student/entities/student.entity';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ProgramController],
  imports: [TypeOrmModule.forFeature([Program, Student]), UserModule],
  providers: [ProgramService],
})
export class ProgramModule {}
