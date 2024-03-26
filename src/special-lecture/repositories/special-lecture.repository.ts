import { SpecialLecture } from '../entities/special-lecture.entity'
import { EntityManager } from 'typeorm'

export interface SpecialLectureRepository {
    read(
        lectureId: number,
        entityManager: EntityManager,
        lockMode?: LockModeType,
    ): Promise<SpecialLecture>

    write(
        entityManager: EntityManager,
        lockMode?: LockModeType,
    ): Promise<SpecialLecture>
}

export type LockModeType =
    | 'pessimistic_read'
    | 'pessimistic_write'
    | 'dirty_read'
    | 'pessimistic_partial_write'
    | 'pessimistic_write_or_fail'
    | 'for_no_key_update'
    | 'for_key_share'

export class SpecialLectureCoreRepository implements SpecialLectureRepository {
    async read(
        lectureId: number,
        entityManager: EntityManager,
        lockMode?: LockModeType,
    ): Promise<SpecialLecture> {
        return entityManager.findOne(SpecialLecture, {
            where: { id: lectureId },
            relations: ['specialLectureReservations'],
            lock: lockMode ? { mode: lockMode } : undefined,
        })
    }

    async write(entityManager: EntityManager): Promise<SpecialLecture> {
        const specialLectureData = new SpecialLecture()
        specialLectureData.title = 'Special Lecture'

        return entityManager.save(specialLectureData)
    }
}
