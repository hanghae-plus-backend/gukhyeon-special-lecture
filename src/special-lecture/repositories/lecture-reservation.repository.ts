import { InjectRepository } from '@nestjs/typeorm'
import { LectureReservation } from '../entities/lecture-reservation.entity'
import { LectureTimeTable } from '../entities/lecture-timetable.entity'
import { QueryRunner, Repository } from 'typeorm'

export class LectureReservationRepository extends Repository<LectureReservation> {
    constructor(
        @InjectRepository(LectureReservation)
        private repository: Repository<LectureReservation>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner)
    }
    async read(userId: number): Promise<LectureReservation> {
        return this.repository.findOne({
            where: { userId },
            relations: ['lectureTimeTable'],
        })
    }

    async write(userId: number, LectureTimeTable: LectureTimeTable, queryRunner?: QueryRunner): Promise<LectureReservation> {
        const reservation = new LectureReservation()
        reservation.userId = userId
        reservation.lectureTimeTable = LectureTimeTable

        return queryRunner ? queryRunner.manager.save(reservation) : this.repository.save(reservation)
    }
}

export type LectureReservationReaderType = InstanceType<typeof LectureReservationRepository>['read']

export type LectureReservationWriterType = InstanceType<typeof LectureReservationRepository>['write']
