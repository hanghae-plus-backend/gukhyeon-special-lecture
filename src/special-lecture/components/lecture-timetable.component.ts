import { Inject } from '@nestjs/common'
import { LectureTimeTableReaderType, LectureTimeTableWriterType, LectureTimeTableRepository } from '../repositories/lecture-timetable.repository'
import { LectureTimeTable } from '../entities/lecture-timetable.entity'
import { CreateLectureTimeTableDto } from '../dto/create-lecture-timetable.dto'
import { Lecture } from '../entities/lecture.entity'
import { QueryRunner } from 'typeorm'
import { LockModeType } from '../repositories/lecture.repository'

export class LectureTimeTableReader {
    private readonly readType: LectureTimeTableReaderType['read']
    private readonly readByIdType: LectureTimeTableReaderType['readById']

    constructor(
        @Inject('LectureTimeTableRepository')
        private repository: LectureTimeTableRepository,
    ) {
        this.readType = this.repository.read.bind(this.repository)
        this.readByIdType = this.repository.readById.bind(this.repository)
    }

    async read(lockMode?: LockModeType, queryRunner?: QueryRunner): Promise<LectureTimeTable[]> {
        return await this.readType(lockMode, queryRunner)
    }

    async readById(id: number, lockMode?: LockModeType, queryRunner?: QueryRunner): Promise<LectureTimeTable> {
        return await this.readByIdType(id, lockMode, queryRunner)
    }
}

export class LectureTimeTableWriter {
    private readonly writeType: LectureTimeTableWriterType

    constructor(
        @Inject('LectureTimeTableRepository')
        private repository: LectureTimeTableRepository,
    ) {
        this.writeType = this.repository.write.bind(this.repository)
    }

    async write(dto: CreateLectureTimeTableDto, lecture: Lecture, queryRunner?: QueryRunner): Promise<LectureTimeTable> {
        return await this.writeType(dto, lecture, queryRunner)
    }
}
