import { Inject } from '@nestjs/common'
import { LectureReservationReaderType, LectureReservationWriterType, LectureReservationRepository } from '../repositories/lecture-reservation.repository'
import { LectureReservation } from '../entities/lecture-reservation.entity'
import { LectureTimeTable } from '../entities/lecture-timetable.entity'
import { QueryRunner } from 'typeorm'

export class LectureReservationReader {
    private readonly readType: LectureReservationReaderType

    constructor(
        @Inject('LectureReservationRepository')
        private repository: LectureReservationRepository,
    ) {
        this.readType = this.repository.read.bind(this.repository)
    }

    async read(userId: number): Promise<LectureReservation> {
        return await this.readType(userId)
    }
}

export class LectureReservationWriter {
    private readonly writeType: LectureReservationWriterType

    constructor(
        @Inject('LectureReservationRepository')
        private repository: LectureReservationRepository,
    ) {
        this.writeType = this.repository.write.bind(this.repository)
    }

    async write(userId: number, lectureTimeTable: LectureTimeTable, queryRunner?: QueryRunner): Promise<LectureReservation> {
        return await this.writeType(userId, lectureTimeTable, queryRunner)
    }
}
