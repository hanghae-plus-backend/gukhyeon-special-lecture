import { EntityManager } from 'typeorm'
import { SpecialLectureReservation } from '../entities/special-lecture-reservation.entity'
import { Inject, Injectable } from '@nestjs/common'
import { SpecialLecture } from '../entities/special-lecture.entity'
import { SpecialLectureReservationRepository } from '../repositories/special-lecture-reservation.repository'

@Injectable()
export class SpecialLectureReservationReader {
    constructor(
        @Inject('SpecialLectureReservationRepository')
        private repository: SpecialLectureReservationRepository,
    ) {}

    async read(
        userId: number,
        entityManager: EntityManager,
    ): Promise<SpecialLectureReservation> {
        return this.repository.read(userId, entityManager)
    }
}

@Injectable()
export class SpecialLectureReservationWriter {
    constructor(
        @Inject('SpecialLectureReservationRepository')
        private repository: SpecialLectureReservationRepository,
    ) {}

    async write(
        entityManager: EntityManager,
        userId: number,
        specialLecture: SpecialLecture,
    ): Promise<SpecialLectureReservation> {
        return this.repository.write(entityManager, userId, specialLecture)
    }
}
