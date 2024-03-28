import { InjectRepository } from '@nestjs/typeorm'
import { LectureTimeTable } from '../entities/lecture-timetable.entity'
import { QueryRunner, Repository } from 'typeorm'
import { CreateLectureTimeTableDto } from '../dto/create-lecture-timetable.dto'
import { Lecture } from '../entities/lecture.entity'
import { LockModeType } from './lecture.repository'

export class LectureTimeTableRepository extends Repository<LectureTimeTable> {
    constructor(
        @InjectRepository(LectureTimeTable)
        private repository: Repository<LectureTimeTable>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner)
    }

    async read(lockMode?: LockModeType, queryRunner?: QueryRunner): Promise<LectureTimeTable[]> {
        if (queryRunner) {
            return queryRunner.manager.find(LectureTimeTable, {
                relations: ['lecture', 'lectureReservations'],
                lock: lockMode ? { mode: lockMode } : undefined,
            })
        } else {
            return this.repository.find({
                relations: ['lecture', 'lectureReservations'],
                lock: lockMode ? { mode: lockMode } : undefined,
            })
        }
    }

    async readById(id: number, lockMode?: LockModeType, queryRunner?: QueryRunner): Promise<LectureTimeTable> {
        if (queryRunner) {
            return queryRunner.manager.findOne(LectureTimeTable, {
                where: { id },
                relations: ['lecture', 'lectureReservations'],
                lock: lockMode ? { mode: lockMode } : undefined,
            })
        } else {
            return this.repository.findOne({
                where: { id },
                relations: ['lecture', 'lectureReservations'],
                lock: lockMode ? { mode: lockMode } : undefined,
            })
        }
    }

    async write(dto: CreateLectureTimeTableDto, lecture: Lecture, queryRunner?: QueryRunner): Promise<LectureTimeTable> {
        const timeTable = new LectureTimeTable()
        timeTable.startTime = dto.startTime
        timeTable.endTime = dto.endTime
        timeTable.lecture = lecture

        return queryRunner ? queryRunner.manager.save(timeTable) : this.repository.save(timeTable)
    }
}

export type LectureTimeTableReaderType = {
    read: InstanceType<typeof LectureTimeTableRepository>['read']
    readById: InstanceType<typeof LectureTimeTableRepository>['readById']
}

export type LectureTimeTableWriterType = InstanceType<typeof LectureTimeTableRepository>['write']
