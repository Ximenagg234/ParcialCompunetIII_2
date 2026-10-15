import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProgramDto } from './dto/create-program.dto';
import { Program } from './entities/program.entity';
import { Student } from '../student/entities/student.entity';
import { AssignStudentsDto } from './dto/assign-students.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class ProgramService {
    constructor(
        @InjectRepository(Program) private readonly programRepository: Repository<Program>,
        private readonly dataSource: DataSource,
    ) {}


    // TODO Reto 1: inyecta el repositorio de Program (y lo que necesites para las transacciones)

    async create(createProgramDto: CreateProgramDto): Promise<Program> {
        try {
            return await this.programRepository.save(this.programRepository.create(createProgramDto));
        } catch (error) {
            if (error?.code === '23505') throw new ConflictException('Program name or code already exists');
            throw error;
        }
    }

    async bulkCreate(createProgramDtos: CreateProgramDto[]): Promise<Program[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const repository = queryRunner.manager.getRepository(Program);
            const programs = await repository.save(
                repository.create(createProgramDtos),
            );
            await queryRunner.commitTransaction();
            return programs;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            if (error?.code === '23505') throw new ConflictException('Program name or code already exists');
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findOne(id: string): Promise<Program> {
        const program = await this.programRepository.findOne({
            where: { id },
            relations: { students: true },
        });

        if (!program) throw new NotFoundException(`Program with id ${id} not found`);
        return program;
    }

    async assignStudents(id: string, assignStudentsDto: AssignStudentsDto): Promise<Program> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const programRepository = queryRunner.manager.getRepository(Program);
            const studentRepository = queryRunner.manager.getRepository(Student);
            const program = await programRepository.findOne({ where: { id }, relations: { students: true } });
            if (!program) throw new NotFoundException(`Program with id ${id} not found`);

            const students = await studentRepository.findByIds(assignStudentsDto.studentIds);
            if (students.length !== new Set(assignStudentsDto.studentIds).size) {
                throw new NotFoundException('One or more students were not found');
            }

            const combined = new Map((program.students ?? []).map((student) => [student.id, student]));
            students.forEach((student) => combined.set(student.id, student));
            program.students = [...combined.values()];
            const saved = await programRepository.save(program);
            await queryRunner.commitTransaction();
            return saved;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // TODO Reto 1: create(createProgramDto, user) -> guarda el programa
    //   - nombre o código repetido -> 409 Conflict (no 500)

    // TODO Reto 1: findAll(paginationDto) -> lista paginada (limit / skip)

    // TODO Reto 2: assignStudents(id, assignStudentsDto) -> AGREGA estudiantes al programa
    //   dentro de una transacción (QueryRunner), conservando los que ya tenía.
    //   Mismo patrón del update de estudiantes corregido en clase (combinar las notas):
    //   traer los actuales -> combinar con los nuevos -> guardar la lista completa.
    //   Si algún id no existe: 404 y rollback.

    // TODO Reto 3: bulkCreate(bulkCreateProgramDto, user) -> crea todos los programas o ninguno
    //   (transacción). Cualquier nombre/código repetido -> 409 y rollback.
}
