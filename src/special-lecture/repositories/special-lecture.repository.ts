import {
    SpecialLecture,
    SpecialLectureReservation,
} from '../entities/special-lecture.entity'
import { EntityManager } from 'typeorm'

export type LockModeType =
    | 'pessimistic_read'
    | 'pessimistic_write'
    | 'dirty_read'
    | 'pessimistic_partial_write'
    | 'pessimistic_write_or_fail'
    | 'for_no_key_update'
    | 'for_key_share'

export interface SpecialLectureRepository {
    read(
        lectureId: number,
        entityManager: EntityManager,
        lockMode?: LockModeType,
    ): Promise<SpecialLecture>

    write(entityManager: EntityManager): Promise<SpecialLecture>
}

export class SpecialLectureCoreRepository implements SpecialLectureRepository {
    async read(
        lectureId: number,
        entityManager: EntityManager,
        lockMode?: LockModeType,
    ): Promise<SpecialLecture> {
        const queryBuilder = entityManager
            .createQueryBuilder(SpecialLecture, 'specialLecture')
            .leftJoinAndSelect(
                'specialLecture.specialLectureReservations',
                'reservation',
            )
            .where('specialLecture.id = :id', { id: lectureId })

        if (lockMode) {
            queryBuilder.setLock(lockMode)
        }

        return await queryBuilder.getOne()
    }

    async write(entityManager: EntityManager): Promise<SpecialLecture> {
        const specialLectureData = new SpecialLecture()
        specialLectureData.title = 'Special Lecture'

        return entityManager.save(specialLectureData)
    }
}

export interface SpecialLectureReservationRepository {
    read(
        userId: number,
        entityManager: EntityManager,
    ): Promise<SpecialLectureReservation>

    write(
        entityManager: EntityManager,
        userId: number,
        specialLecture: SpecialLecture,
    ): Promise<SpecialLectureReservation>
}

export class SpecialLectureReservationCoreRepository
    implements SpecialLectureReservationRepository
{
    async read(
        userId: number,
        entityManager: EntityManager,
    ): Promise<SpecialLectureReservation> {
        const queryBuilder = entityManager
            .createQueryBuilder(
                SpecialLectureReservation,
                'specialLectureReservation',
            )
            .leftJoinAndSelect(
                'specialLectureReservation.specialLecture',
                'specialLecture',
            )
            .where('specialLectureReservation.userId = :userId', { userId })

        return await queryBuilder.getOne()
    }

    async write(
        entityManager: EntityManager,
        userId: number,
        specialLecture: SpecialLecture,
    ): Promise<SpecialLectureReservation> {
        const reservationData = new SpecialLectureReservation()
        reservationData.userId = userId
        reservationData.specialLecture = specialLecture

        return entityManager.save(reservationData)
    }
}
