// TODO Reto 2: relación 1:N con Student -> propiedad `students?: Student[]`
// TODO Reto 4: relación N:1 con User -> propiedad `createdBy?: User` (el admin que lo creó)
//
// Usa imports relativos (ej. "../../student/entities/student.entity"), no "src/...":
// Jest no resuelve el alias "src/" y el test de Student dejaría de correr.



import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Student } from "../../student/entities/student.entity";
import { User } from "../../user/entities/user.entity";


// RETO 1
// ☐ ProgramModule está registrado en AppModule y la entidad Program con
// TypeOrmModule.forFeature. Al arrancar, se crea la tabla program.
// ☐ CreateProgramDto valida: name string de mínimo 3 caracteres; code de 3 a 6 letras
// mayúsculas; credits entero positivo. Si algo no cumple, la respuesta es 400.
// ☐ POST /api/program crea el programa y responde 201 con el programa creado.
// ☐ Un name o code repetido responde 409 Conflict, no 500 ni una respuesta vacía.
// ☐ GET /api/program lista los programas y acepta limit y skip (reutilice PaginationDto)

@Entity("program")
export class Program {



    @ApiProperty({ example: "CS101", description: "Program's code" })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({ example: "Computer Science", description: "Program's name" })
    @Column({ type: "text", unique: true })
    name: string;


    @ApiProperty({ example: "CS101", description: "Program's code" })
    @Column({ type: "text", unique: true })
    code: string;

    @Column({ type: "int" })
    @ApiProperty({ example: 3, description: "Program's credits" })
    credits: number;

    @OneToMany(() => Student, (student) => student.program)
    @ApiProperty({ type: () => Student, isArray: true })
    students?: Student[];

    @ManyToOne(() => User, (user) => user.programs)
    @ApiProperty({ type: () => User })
    createdBy?: User;

    

}
