import { EntityManager } from 'typeorm'
import { SpecialLectureReservation } from '../entities/special-lecture-reservation.entity'
import { SpecialLecture } from '../entities/special-lecture.entity'

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
